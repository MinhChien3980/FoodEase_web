import { Route } from "react-router";

// Customer Layout and Components
import CustomerLayout from "../layouts/CustomerLayout";
import HomePage from "../pages/customer/HomePage";
import RestaurantsPage from "../pages/customer/RestaurantsPage";
import OffersPage from "../pages/customer/OffersPage";
import CartPage from "../pages/customer/cart/CartPage";
import ProfilePage from "../pages/customer/ProfilePage";
import CustomerLogin from "../pages/customer/auth/CustomerLogin";
import CustomerRegister from "../pages/customer/auth/CustomerRegister";
import CustomerProtectedRoute from "../components/auth/CustomerProtectedRoute";

// Customer Routes Configuration
export const customerRoutes = (
  <>
    {/* Customer-facing FoodEase Routes */}
    <Route path="/foodease" element={<CustomerLayout />}>
      <Route index element={<HomePage />} />
      <Route path="restaurants" element={<RestaurantsPage />} />
      <Route path="offers" element={<OffersPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="favorites" element={<div>Favorites Page - Coming Soon</div>} />
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