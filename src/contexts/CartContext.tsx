import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ICart, ICartItem, ICartContext } from '../interfaces';
import { isCustomerAuthenticated, getCustomerUser } from '../utils/sessionManager';

// Cart actions
type CartAction =
  | { type: 'ADD_TO_CART'; payload: Omit<ICartItem, 'quantity'> }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: ICartItem[] }
  | { type: 'RESET_CART' }; // For when user logs out

// Initial cart state
const initialCartState: ICart = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

// Cart reducer
const cartReducer = (state: ICart, action: CartAction): ICart => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id && item.restaurantId === action.payload.restaurantId
      );

      let newItems: ICartItem[];

      if (existingItemIndex > -1) {
        // Item already exists, increase quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // New item, add to cart
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return {
        items: newItems,
        totalItems,
        totalAmount,
      };
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return {
        items: newItems,
        totalItems,
        totalAmount,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: id });
      }

      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return {
        items: newItems,
        totalItems,
        totalAmount,
      };
    }

    case 'CLEAR_CART':
    case 'RESET_CART':
      return initialCartState;

    case 'LOAD_CART': {
      const totalItems = action.payload.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return {
        items: action.payload,
        totalItems,
        totalAmount,
      };
    }

    default:
      return state;
  }
};

// Helper function to get cart storage key for specific user
const getCartStorageKey = (userId?: string): string => {
  return userId ? `foodease-cart-${userId}` : 'foodease-cart-guest';
};

// Create context
const CartContext = createContext<ICartContext | undefined>(undefined);

// Cart Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialCartState);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);

  // Check authentication and load appropriate cart
  useEffect(() => {
    const checkAuthAndLoadCart = () => {
      if (isCustomerAuthenticated()) {
        const user = getCustomerUser();
        const userId = user?.id?.toString();
        
        if (userId && userId !== currentUserId) {
          setCurrentUserId(userId);
          
          // Load cart for this specific user
          const savedCart = localStorage.getItem(getCartStorageKey(userId));
          if (savedCart) {
            try {
              const parsedCart = JSON.parse(savedCart);
              dispatch({ type: 'LOAD_CART', payload: parsedCart });
            } catch (error) {
              console.error('Error loading user cart from localStorage:', error);
              localStorage.removeItem(getCartStorageKey(userId));
            }
          } else {
            // No saved cart for this user, start fresh
            dispatch({ type: 'RESET_CART' });
          }
        }
      } else {
        // User logged out
        if (currentUserId) {
          setCurrentUserId(null);
          dispatch({ type: 'RESET_CART' });
        }
      }
    };

    checkAuthAndLoadCart();
  }, [currentUserId]);

  // Save cart to localStorage whenever cart changes (only if user is logged in)
  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(getCartStorageKey(currentUserId), JSON.stringify(cart.items));
    }
  }, [cart.items, currentUserId]);

  const addToCart = (item: Omit<ICartItem, 'quantity'>) => {
    // Check if user is authenticated before adding to cart
    if (!isCustomerAuthenticated()) {
      window.location.href = '/foodease/login';
      return;
    }

    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (itemId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (itemId: number): number => {
    const item = cart.items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  const contextValue: ICartContext = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = (): ICartContext => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartProvider; 