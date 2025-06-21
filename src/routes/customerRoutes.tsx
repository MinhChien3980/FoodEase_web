import { Route } from "react-router";

// Customer Layout and Components
import CustomerLayout from "../layouts/CustomerLayout";
import HomePage from "../pages/customer/views/HomePage";
import RestaurantsPage from "../pages/customer/views/RestaurantsPage";
import OffersPage from "../pages/customer/views/OffersPage";
import CartPage from "../pages/customer/views/CartPage";
import ProfilePage from "../pages/customer/views/ProfilePage";
import CustomerLogin from "../pages/customer/auth/CustomerLogin";
import CustomerRegister from "../pages/customer/auth/CustomerRegister";
import RestaurantDetailPage from "../pages/customer/views/RestaurantDetailPage";
import MenuPage from "../pages/customer/views/MenuPage";
import CustomerProtectedRoute from "../components/auth/CustomerProtectedRoute";
import FavoritesPage from "../pages/customer/views/FavoritesPage";

// Customer Routes Configuration
export const customerRoutes = (
  <>
    {/* Customer-facing FoodEase Routes */}
    <Route path="/foodease" element={<CustomerLayout />}>
      <Route index element={<HomePage />} />
      <Route path="restaurants" element={<RestaurantsPage />} />
      <Route path="restaurants/:id" element={<RestaurantDetailPage />} />
      <Route path="menu" element={<MenuPage />} />
      <Route path="offers" element={<OffersPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="favorites" element={<FavoritesPage />} />
      <Route 
        path="profile" 
        element={
          <CustomerProtectedRoute>
            <ProfilePage />
          </CustomerProtectedRoute>
        } 
      />
    </Route>

    {/* Customer Authentication Routes */}
    <Route path="/foodease/login" element={<CustomerLogin />} />
    <Route path="/foodease/register" element={<CustomerRegister />} />
  </>
);

// Customer Navigation Configuration
export const customerNavItems = [
  {
    path: "/foodease",
    label: "Home",
    public: true,
  },
  {
    path: "/foodease/restaurants",
    label: "Restaurants",
    public: true,
  },
  {
    path: "/foodease/menu",
    label: "Menu",
    public: true,
  },
  {
    path: "/foodease/offers",
    label: "Offers",
    public: true,
  },
  {
    path: "/foodease/cart",
    label: "Cart",
    public: true,
  },
  {
    path: "/foodease/favorites",
    label: "Favorites",
    public: false, // Requires authentication
  },
  {
    path: "/foodease/profile",
    label: "Profile",
    public: false, // Requires authentication
  },
];

// Customer Route Groups for easier management
export const customerRouteGroups = {
  public: [
    "/foodease",
    "/foodease/restaurants",
    "/foodease/menu",
    "/foodease/offers",
    "/foodease/cart",
  ],
  protected: [
    "/foodease/favorites",
    "/foodease/profile",
  ],
  auth: [
    "/foodease/login",
    "/foodease/register",
  ],
};

export const CUSTOMER_ROUTES = [
  { path: "/foodease/profile", component: "ProfilePage", layout: "CustomerLayout" },
  { path: "/foodease/offers", component: "OffersPage", layout: "CustomerLayout" },
  { path: "/foodease/favorites", component: "FavoritesPage", layout: "CustomerLayout" },
]; 