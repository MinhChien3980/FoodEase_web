import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ICart, ICartItem, ICartContext } from '../interfaces';
import { isCustomerAuthenticated, getCustomerUser, getCustomerCartId, setCustomerCartId } from '../utils/sessionManager';
import { cartService } from '../services/cartService';

// Cart actions
type CartAction =
  | { type: 'ADD_TO_CART'; payload: Omit<ICartItem, 'quantity'> }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: number; restaurantId: number; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { itemId: number; restaurantId: number } }
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

    case 'UPDATE_QUANTITY': {
      const { itemId, restaurantId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // If quantity is 0 or less, remove the item
        const newItems = state.items.filter(
          item => !(item.id === itemId && item.restaurantId === restaurantId)
        );
        
        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        return {
          items: newItems,
          totalItems,
          totalAmount,
        };
      }

      const newItems = state.items.map(item =>
        item.id === itemId && item.restaurantId === restaurantId
          ? { ...item, quantity }
          : item
      );

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return {
        items: newItems,
        totalItems,
        totalAmount,
      };
    }

    case 'REMOVE_ITEM': {
      const { itemId, restaurantId } = action.payload;
      const newItems = state.items.filter(
        item => !(item.id === itemId && item.restaurantId === restaurantId)
      );

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return {
        items: newItems,
        totalItems,
        totalAmount,
      };
    }

    case 'LOAD_CART': {
      // Deduplicate items in case of any data inconsistency
      const deduplicatedItems = action.payload.reduce((acc, item) => {
        const existingIndex = acc.findIndex(existing => 
          existing.id === item.id && existing.restaurantId === item.restaurantId
        );
        
        if (existingIndex > -1) {
          // Item already exists, combine quantities
          acc[existingIndex].quantity += item.quantity;
          console.log(`🔄 Merged duplicate item in LOAD_CART: ${item.name}`);
        } else {
          // New item, add to result
          acc.push(item);
        }
        
        return acc;
      }, [] as ICartItem[]);

      const totalItems = deduplicatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = deduplicatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      console.log(`📥 Loading ${deduplicatedItems.length} items into cart state`);

      return {
        items: deduplicatedItems,
        totalItems,
        totalAmount,
      };
    }

    case 'RESET_CART':
      return initialCartState;

    default:
      return state;
  }
};

// Create context
const CartContext = createContext<ICartContext | undefined>(undefined);

// Cart Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialCartState);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const [isLoadingServerCart, setIsLoadingServerCart] = React.useState(false);

  // Load cart from server based on userId
  const loadServerCartForUser = async (userId: number) => {
    try {
      setIsLoadingServerCart(true);
      console.log(`🛒 Loading cart for user ${userId}...`);
      
      // Always get or create cart for this user from server
      const userCart = await cartService.getOrCreateCart(userId);
      console.log(`📦 Cart ID for user ${userId}: ${userCart.id}`);
      
      // Store cartId in session for future API calls
      setCustomerCartId(userCart.id);
      
      // Load cart items for this cart from server
      const serverCartItems = await cartService.loadCartItemsWithDetails(userCart.id);
      
      // Only update state if we still have the same user (prevent race conditions)
      const currentUser = isCustomerAuthenticated() ? getCustomerUser() : null;
      const currentUserIdCheck = currentUser?.id?.toString();
      
      if (currentUserIdCheck === userId.toString()) {
        if (serverCartItems.length > 0) {
          console.log(`✅ Loaded ${serverCartItems.length} items from server cart`);
          dispatch({ type: 'LOAD_CART', payload: serverCartItems });
        } else {
          console.log('📭 Server cart is empty');
          dispatch({ type: 'RESET_CART' });
        }
      } else {
        console.log(`⚠️ User changed during cart load, skipping state update for user ${userId}`);
      }
    } catch (error) {
      console.error('❌ Error loading cart from server:', error);
      
      // Only update state if we're still dealing with the same user
      const currentUser = isCustomerAuthenticated() ? getCustomerUser() : null;
      const currentUserIdCheck = currentUser?.id?.toString();
      
      if (currentUserIdCheck === userId.toString()) {
        // Instead of fallback to localStorage, just reset cart
        // Cart should always be server-based for authenticated users
        dispatch({ type: 'RESET_CART' });
        console.warn('Failed to load cart from server. Cart reset to empty state.');
      }
    } finally {
      setIsLoadingServerCart(false);
    }
  };

  // Initial authentication check on component mount
  useEffect(() => {
    let isMounted = true;

    const initialAuthCheck = async () => {
      try {
        const isAuth = isCustomerAuthenticated();
        const user = isAuth ? getCustomerUser() : null;
        const userId = user?.id?.toString() || null;

        if (!isMounted) return; // Component unmounted

        if (userId) {
          console.log(`🚀 Initial load: loading cart for user ${userId}`);
          setCurrentUserId(userId);
          await loadServerCartForUser(parseInt(userId));
        } else {
          console.log('🚀 Initial load: no authenticated user found');
          setCurrentUserId(null);
          dispatch({ type: 'RESET_CART' });
        }
      } catch (error) {
        console.error('Error in initial auth check:', error);
        if (isMounted) {
          setCurrentUserId(null);
          dispatch({ type: 'RESET_CART' });
        }
      }
    };

    initialAuthCheck();

    return () => {
      isMounted = false;
    };
  }, []); // Run only once on mount

  // Check authentication state periodically to catch login/logout events
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    // Start immediate polling without delay
    const startPolling = () => {
      interval = setInterval(async () => {
        try {
          const isAuth = isCustomerAuthenticated();
          const user = isAuth ? getCustomerUser() : null;
          const userId = user?.id?.toString() || null;

          // If authentication state changed
          if (userId !== currentUserId) {
            if (userId) {
              console.log(`🔄 User changed detected: ${currentUserId} -> ${userId}`);
              setCurrentUserId(userId);
              await loadServerCartForUser(parseInt(userId));
            } else {
              console.log('🚪 Logout detected: clearing cart');
              setCurrentUserId(null);
              dispatch({ type: 'RESET_CART' });
            }
          }
        } catch (error) {
          console.error('Error in auth polling:', error);
        }
      }, 500); // Check every 0.5 seconds for fastest response
    };

    // Start polling immediately, no delay
    startPolling();

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentUserId]);
  
  const addToCart = (item: Omit<ICartItem, 'quantity'>, onUnauthenticated?: () => void) => {
    // Check if user is authenticated before adding to cart
    if (!isCustomerAuthenticated()) {
      if (onUnauthenticated) {
        onUnauthenticated();
      }
      return;
    }

    // Check if item already exists to determine the new quantity
    const existingItem = cart.items.find(cartItem => cartItem.id === item.id && cartItem.restaurantId === item.restaurantId);
    const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

    // Add to local cart first for immediate UI feedback
    dispatch({ type: 'ADD_TO_CART', payload: item });

    // Sync with server in background with the correct new quantity
    syncAddToCartWithServer(item, newQuantity);
  };

  // Sync add to cart with server
  const syncAddToCartWithServer = async (item: Omit<ICartItem, 'quantity'>, quantity: number) => {
    try {
      const cartId = getCustomerCartId();
      
      if (!cartId) {
        console.warn('No cartId found, cannot sync with server');
        return;
      }

      // Check if this menu item already exists in the server cart
      const existingCartItemId = await cartService.findCartItemIdByMenuItemId(cartId, item.id);

      if (existingCartItemId) {
        // Item exists, update quantity on server with full data
        await cartService.updateCartItem(existingCartItemId, { 
          cartId: cartId,
          menuItemId: item.id,
          quantity: quantity 
        });
        console.log(`✅ Successfully updated cart item quantity on server: ${item.name} (quantity: ${quantity})`);
      } else {
        // Item doesn't exist, add new item to server
        await cartService.addCartItem({
          cartId: cartId,
          menuItemId: item.id,
          quantity: quantity
        });
        console.log(`✅ Successfully added new cart item to server: ${item.name} (quantity: ${quantity})`);
      }
    } catch (error) {
      console.error('Failed to sync cart with server:', error);
      // Note: We don't revert the local change to maintain good UX
      // The next cart reload will sync with server state
    }
  };

  // Get quantity of a specific item in cart
  const getItemQuantity = (itemId: number): number => {
    const item = cart.items.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  // Update quantity of a specific item in cart
  const updateQuantity = (itemId: number, restaurantId: number, quantity: number) => {
    // Update local cart first for immediate UI feedback
    dispatch({ 
      type: 'UPDATE_QUANTITY', 
      payload: { itemId, restaurantId, quantity } 
    });

    // Sync with server in background
    syncUpdateQuantityWithServer(itemId, restaurantId, quantity);
  };

  // Remove item from cart
  const removeItem = (itemId: number, restaurantId: number) => {
    // Remove from local cart first for immediate UI feedback
    dispatch({ 
      type: 'REMOVE_ITEM', 
      payload: { itemId, restaurantId } 
    });

    // Sync with server in background
    syncRemoveItemWithServer(itemId, restaurantId);
  };

  // Sync update quantity with server
  const syncUpdateQuantityWithServer = async (itemId: number, restaurantId: number, quantity: number) => {
    try {
      const cartId = getCustomerCartId();
      
      if (!cartId) {
        console.warn('No cartId found, cannot sync update with server');
        return;
      }

      // Find the cart item ID by menu item ID
      const cartItemId = await cartService.findCartItemIdByMenuItemId(cartId, itemId);

      if (cartItemId) {
        if (quantity <= 0) {
          // If quantity is 0 or less, delete the item
          await cartService.deleteCartItem(cartItemId);
          console.log(`✅ Successfully deleted cart item from server: itemId ${itemId}`);
        } else {
          // Update quantity on server with full data
          await cartService.updateCartItem(cartItemId, { 
            cartId: cartId,
            menuItemId: itemId,
            quantity: quantity 
          });
          console.log(`✅ Successfully updated cart item quantity on server: itemId ${itemId} (quantity: ${quantity})`);
        }
      } else {
        console.warn(`Cart item not found on server for itemId ${itemId}`);
      }
    } catch (error) {
      console.error('Failed to sync quantity update with server:', error);
      // Note: We don't revert the local change to maintain good UX
      // The next cart reload will sync with server state
    }
  };

  // Sync remove item with server
  const syncRemoveItemWithServer = async (itemId: number, restaurantId: number) => {
    try {
      const cartId = getCustomerCartId();
      
      if (!cartId) {
        console.warn('No cartId found, cannot sync removal with server');
        return;
      }

      // Find the cart item ID by menu item ID
      const cartItemId = await cartService.findCartItemIdByMenuItemId(cartId, itemId);

      if (cartItemId) {
        await cartService.deleteCartItem(cartItemId);
        console.log(`✅ Successfully removed cart item from server: itemId ${itemId}`);
      } else {
        console.warn(`Cart item not found on server for itemId ${itemId}`);
      }
    } catch (error) {
      console.error('Failed to sync item removal with server:', error);
      // Note: We don't revert the local change to maintain good UX
      // The next cart reload will sync with server state
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const cartId = getCustomerCartId();
      
      if (!cartId) {
        return;
      }

      // Clear cart on server
      await cartService.clearCart(cartId);

      // Reset local cart state
      dispatch({ type: 'RESET_CART' });
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const contextValue: ICartContext = {
    cart,
    addToCart,
    updateQuantity,
    removeItem,
    getItemQuantity,
    isLoadingServerCart,
    clearCart,
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