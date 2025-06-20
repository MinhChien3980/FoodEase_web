import { Route, Outlet } from "react-router";
import { Authenticated } from "@refinedev/core";
import { ThemedLayoutV2 } from "@refinedev/mui";
import { CatchAllNavigate } from "@refinedev/react-router";
import Box from "@mui/material/Box";
import { Navigate } from "react-router-dom";

// Admin Components
import { Header, Title } from "../components";
import { DashboardPage } from "../pages/admin/dashboard";
import { RestaurantList, RestaurantCreate, RestaurantEdit, RestaurantMenuItems } from "../pages/admin/restaurants";
import { MenuItemCreate } from "../pages/admin/restaurants/menu-items/create";
import { MenuItemEdit } from "../pages/admin/restaurants/menu-items/edit";
import { list as List } from "../pages/admin/customer";
import UserOrders from "../pages/admin/customer/orders";
import { DeliveryList, DeliveryEdit } from "../pages/admin/delivery";
import { TransactionList, TransactionEdit } from "../pages/admin/transaction";
import { isAdmin } from "../utils/sessionManager";

// Admin Layout Wrapper Component
const AdminLayoutWrapper = () => {
  if (!isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Authenticated
      key="authenticated-routes"
      fallback={<CatchAllNavigate to="/login" />}
    >
      <ThemedLayoutV2 Header={Header} Title={Title}>
        <Box
          sx={{
            maxWidth: "1200px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Outlet />
        </Box>
      </ThemedLayoutV2>
    </Authenticated>
  );
};

// Admin Routes Configuration
export const adminRoutes = (
  <Route path="/admin" element={<AdminLayoutWrapper />}>
    <Route index element={<DashboardPage />} />

    {/* Restaurants Routes */}
    <Route path="restaurants">
      <Route index element={<RestaurantList />} />
      <Route path="new" element={<RestaurantCreate />} />
      <Route path=":id/edit" element={<RestaurantEdit />} />
      <Route path=":id/menu-items">
        <Route index element={<RestaurantMenuItems />} />
        <Route path="create" element={<MenuItemCreate />} />
        <Route path=":menuItemId/edit" element={<MenuItemEdit />} />
      </Route>
    </Route>

    {/* Customer Management Routes */}
    <Route path="customers">
      <Route index element={<List />} />
      <Route path=":userId/orders" element={<UserOrders />} />
    </Route>

    {/* Delivery Management Routes */}
    <Route path="delivery">
      <Route index element={<DeliveryList />} />
      <Route path=":id/edit" element={<DeliveryEdit />} />
    </Route>

    {/* Transaction Management Routes */}
    <Route path="transactions">
      <Route index element={<TransactionList />} />
      <Route path=":id/edit" element={<TransactionEdit />} />
    </Route>
  </Route>
);

// Admin Resource Configuration for Refine
export const adminResources = [
  {
    name: "dashboard",
    list: "/admin",
    meta: {
      label: "Dashboard",
    },
  },
  {
    name: "restaurants",
    list: "/admin/restaurants",
    create: "/admin/restaurants/new",
    edit: "/admin/restaurants/:id/edit",
  },
  {
    name: "customers",
    list: "/admin/customers",
    meta: {
      label: "Customer Management",
    },
  },
  {
    name: "delivery",
    list: "/admin/delivery",
    edit: "/admin/delivery/:id/edit",
    meta: {
      label: "Delivery Management",
    },
  },
  {
    name: "transactions",
    list: "/admin/transactions",
    meta: {
      label: "Transaction Management",
    },
  },
]; 