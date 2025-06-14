import { Route, Outlet } from "react-router";
import { Authenticated } from "@refinedev/core";
import { ThemedLayoutV2 } from "@refinedev/mui";
import { CatchAllNavigate } from "@refinedev/react-router";
import Box from "@mui/material/Box";

// Admin Components
import { Header, Title } from "../components";
import { DashboardPage } from "../pages/admin/dashboard";
import { OrderList, OrderShow } from "../pages/admin/orders";
import { CustomerShow, CustomerList } from "../pages/admin/customers";
import { CourierList, CourierCreate, CourierEdit } from "../pages/admin/couriers";
import { StoreList, StoreEdit, StoreCreate } from "../pages/admin/stores";
import { ProductEdit, ProductList, ProductCreate } from "../pages/admin/products";
import { CategoryList } from "../pages/admin/categories";

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
    
    {/* Orders Routes */}
    <Route path="orders">
      <Route index element={<OrderList />} />
      <Route path=":id" element={<OrderShow />} />
    </Route>
    
    {/* Customers Routes */}
    <Route
      path="customers"
      element={
        <CustomerList>
          <Outlet />
        </CustomerList>
      }
    >
      <Route path=":id" element={<CustomerShow />} />
    </Route>

    {/* Products Routes */}
    <Route
      path="products"
      element={
        <ProductList>
          <Outlet />
        </ProductList>
      }
    >
      <Route path=":id/edit" element={<ProductEdit />} />
      <Route path="new" element={<ProductCreate />} />
    </Route>

    {/* Stores Routes */}
    <Route path="stores">
      <Route index element={<StoreList />} />
      <Route path="new" element={<StoreCreate />} />
      <Route path=":id/edit" element={<StoreEdit />} />
    </Route>

    {/* Categories Routes */}
    <Route path="categories" element={<CategoryList />} />

    {/* Couriers Routes */}
    <Route path="couriers">
      <Route
        path=""
        element={
          <CourierList>
            <Outlet />
          </CourierList>
        }
      >
        <Route path="new" element={<CourierCreate />} />
      </Route>
      <Route path=":id/edit" element={<CourierEdit />} />
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
    name: "orders",
    list: "/admin/orders",
    show: "/admin/orders/:id",
  },
  {
    name: "users",
    list: "/admin/customers",
    show: "/admin/customers/:id",
  },
  {
    name: "products",
    list: "/admin/products",
    create: "/admin/products/new",
    edit: "/admin/products/:id/edit",
    show: "/admin/products/:id",
  },
  {
    name: "categories",
    list: "/admin/categories",
  },
  {
    name: "stores",
    list: "/admin/stores",
    create: "/admin/stores/new",
    edit: "/admin/stores/:id/edit",
  },
  {
    name: "couriers",
    list: "/admin/couriers",
    create: "/admin/couriers/new",
    edit: "/admin/couriers/:id/edit",
  },
]; 