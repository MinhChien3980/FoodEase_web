// Customer session management utilities for FoodEase

export interface CustomerSession {
  token: string;
  user: any; // User data from API
}

/**
 * Store customer authentication token in session
 */
export const setCustomerToken = (token: string): void => {
  sessionStorage.setItem('customer_token', token);
};

/**
 * Get customer authentication token from session
 */
export const getCustomerToken = (): string | null => {
  return sessionStorage.getItem('customer_token');
};

/**
 * Store customer user data in session
 */
export const setCustomerUser = (user: any): void => {
  sessionStorage.setItem('customer_user', JSON.stringify(user));
};

/**
 * Get customer user data from session
 */
export const getCustomerUser = (): any | null => {
  try {
    const userData = sessionStorage.getItem('customer_user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing customer user data:', error);
    return null;
  }
};

/**
 * Check if customer is authenticated
 */
export const isCustomerAuthenticated = (): boolean => {
  const token = getCustomerToken();
  const user = getCustomerUser();
  return !!(token && user);
};

/**
 * Store complete customer session (token + user data)
 */
export const setCustomerSession = (token: string, user: any): void => {
  setCustomerToken(token);
  setCustomerUser(user);
};

/**
 * Get complete customer session
 */
export const getCustomerSession = (): CustomerSession | null => {
  const token = getCustomerToken();
  const user = getCustomerUser();
  
  if (token && user) {
    return { token, user };
  }
  
  return null;
};

/**
 * Clear customer session (logout)
 */
export const clearCustomerSession = (): void => {
  sessionStorage.removeItem('customer_token');
  sessionStorage.removeItem('customer_user');
  sessionStorage.removeItem('customer_cart_id');
};

/**
 * Update customer user data in session
 */
export const updateCustomerUser = (updatedUser: any): void => {
  const currentUser = getCustomerUser();
  if (currentUser) {
    const mergedUser = { ...currentUser, ...updatedUser };
    setCustomerUser(mergedUser);
  }
};

/**
 * Get customer cart ID from session
 */
export const getCustomerCartId = (): number | null => {
  const cartId = sessionStorage.getItem('customer_cart_id');
  return cartId ? parseInt(cartId, 10) : null;
};

/**
 * Set customer cart ID in session
 */
export const setCustomerCartId = (cartId: number): void => {
  sessionStorage.setItem('customer_cart_id', cartId.toString());
};

/**
 * Create authorization header for API requests
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = getCustomerToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'accept': '*/*'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Session storage event listener for cross-tab synchronization
 */
export const onSessionChange = (callback: () => void): (() => void) => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'customer_token' || e.key === 'customer_user') {
      callback();
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};

/**
 * Get session expiry info (sessions expire when browser tab closes)
 */
export const getSessionInfo = () => {
  const token = getCustomerToken();
  const user = getCustomerUser();
  
  return {
    isActive: !!(token && user),
    tokenExists: !!token,
    userExists: !!user,
    expiresOn: 'Browser tab close' // Session storage characteristic
  };
};

/**
 * Validate if the stored token is still valid
 */
export const validateStoredToken = async (): Promise<boolean> => {
  const token = getCustomerToken();
  
  if (!token) {
    return false;
  }

  try {
    const response = await fetch('http://localhost:8080/api/users/profile', {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      try {
        const responseText = await response.text();
        if (responseText.trim()) {
          const data = JSON.parse(responseText);
          if (data.code === 200) {
            // Update user data with fresh profile info
            setCustomerUser(data.data);
            return true;
          }
        }
      } catch (parseError) {
        console.error('Token validation JSON parsing error:', parseError);
      }
    }
    
    // Token is invalid, clear session
    clearCustomerSession();
    return false;
  } catch (error) {
    console.error('Token validation failed:', error);
    // Don't clear session on network error, token might still be valid
    return false;
  }
};

/**
 * Helper function to check/create cart for user
 */
export const ensureUserCart = async (userId: number): Promise<void> => {
  try {
    // Dynamic import to avoid circular dependency
    const { cartService } = await import('../services/cartService');
    
    console.log('Checking/creating cart for user:', userId);
    const cart = await cartService.getOrCreateCart(userId);
    console.log('Cart ready:', cart);
    
    // Lưu cart info vào sessionStorage
    setCustomerCartId(cart.id);
  } catch (error) {
    console.error('Cart operation failed:', error);
    // Không throw error để không block login process
  }
};

/**
 * Auto-login if valid token exists
 */
export const autoLoginIfTokenExists = async (): Promise<{ success: boolean; user?: any }> => {
  const token = getCustomerToken();
  const user = getCustomerUser();
  
  if (!token) {
    return { success: false };
  }

  // If we have both token and user data, try to validate
  if (user) {
    const isValid = await validateStoredToken();
    if (isValid) {
      const updatedUser = getCustomerUser();
      // Ensure cart exists for user
      if (updatedUser && updatedUser.id) {
        await ensureUserCart(updatedUser.id);
      }
      return { success: true, user: updatedUser };
    }
  }

  // If we only have token, try to fetch user profile
  try {
    const response = await fetch('http://localhost:8080/api/users/profile', {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      try {
        const responseText = await response.text();
        if (responseText.trim()) {
          const data = JSON.parse(responseText);
          if (data.code === 200) {
            setCustomerUser(data.data);
            // Ensure cart exists for user
            await ensureUserCart(data.data.id);
            return { success: true, user: data.data };
          }
        }
      } catch (parseError) {
        console.error('Auto-login JSON parsing error:', parseError);
      }
    }
    
    // Token is invalid
    clearCustomerSession();
    return { success: false };
  } catch (error) {
    console.error('Auto-login failed:', error);
    return { success: false };
  }
}; 