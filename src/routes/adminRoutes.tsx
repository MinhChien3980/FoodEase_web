import { Route, Outlet } from "react-router";
import { Authenticated } from "@refinedev/core";
import { ThemedLayoutV2 } from "@refinedev/mui";
import { CatchAllNavigate } from "@refinedev/react-router";
import Box from "@mui/material/Box";

// Admin Components
import { Header, Title } from "../components";
import { DashboardPage } from "../pages/admin/dashboard";
import { RestaurantList, RestaurantCreate, RestaurantEdit } from "../pages/admin/restaurants";

// Admin Layout Wrapper Component
const AdminLayoutWrapper = () => (
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

// Admin Routes Configuration
export const adminRoutes = (
  <Route path="/admin" element={<AdminLayoutWrapper />}>
    <Route index element={<DashboardPage />} />

    {/* Restaurants Routes */}
    <Route path="restaurants">
      <Route index element={<RestaurantList />} />
      <Route path="new" element={<RestaurantCreate />} />
      <Route path=":id/edit" element={<RestaurantEdit />} />
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
]; 