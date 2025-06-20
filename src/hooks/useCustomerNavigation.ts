import { useNavigate } from 'react-router';
import { ROUTE_PATHS } from '../routes';

export const useCustomerNavigation = () => {
  const navigate = useNavigate();

  const navigateToHome = () => navigate(ROUTE_PATHS.CUSTOMER_HOME);
  const navigateToRestaurants = () => navigate(ROUTE_PATHS.CUSTOMER_RESTAURANTS);
  const navigateToOffers = () => navigate(ROUTE_PATHS.CUSTOMER_OFFERS);
  const navigateToCart = () => navigate(ROUTE_PATHS.CUSTOMER_CART);
  const navigateToFavorites = () => navigate(ROUTE_PATHS.CUSTOMER_FAVORITES);
  const navigateToProfile = () => navigate(ROUTE_PATHS.CUSTOMER_PROFILE);
  const navigateToLogin = () => navigate(ROUTE_PATHS.CUSTOMER_LOGIN);
  const navigateToRegister = () => navigate(ROUTE_PATHS.CUSTOMER_REGISTER);

  // Navigation with state/props
  const navigateWithReplace = (path: string) => navigate(path, { replace: true });
  const navigateWithState = (path: string, state: any) => navigate(path, { state });

  // Safe navigation - prevents navigation to same route
  const safeNavigate = (path: string) => {
    if (window.location.pathname !== path) {
      navigate(path);
    }
  };

  return {
    // Direct navigation methods
    navigateToHome,
    navigateToRestaurants,
    navigateToOffers,
    navigateToCart,
    navigateToFavorites,
    navigateToProfile,
    navigateToLogin,
    navigateToRegister,
    
    // Advanced navigation methods
    navigateWithReplace,
    navigateWithState,
    safeNavigate,
    
    // Raw navigate function for custom usage
    navigate,
  };
}; 