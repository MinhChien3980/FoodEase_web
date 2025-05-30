import { Authenticated, GitHubBanner, Refine } from "@refinedev/core";
import { KBarProvider } from "@refinedev/kbar";
import {
  ErrorComponent,
  useNotificationProvider,
  ThemedLayoutV2,
  RefineSnackbarProvider,
} from "@refinedev/mui";
import GlobalStyles from "@mui/material/GlobalStyles";
import CssBaseline from "@mui/material/CssBaseline";
import dataProvider from "@refinedev/simple-rest";
import routerProvider, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import { useTranslation } from "react-i18next";
import MopedOutlined from "@mui/icons-material/MopedOutlined";
import Dashboard from "@mui/icons-material/Dashboard";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import Box from "@mui/material/Box";
import { authProvider } from "./authProvider";
import { DashboardPage } from "./pages/dashboard";
import { OrderList, OrderShow } from "./pages/orders";
import { CustomerShow, CustomerList } from "./pages/customers";
import { CourierList, CourierCreate, CourierEdit } from "./pages/couriers";
import { AuthPage } from "./pages/auth";
import { StoreList, StoreEdit, StoreCreate } from "./pages/stores";
import { ProductEdit, ProductList, ProductCreate } from "./pages/products";
import { CategoryList } from "./pages/categories";
import { ColorModeContextProvider } from "./contexts";
import { Header, Title } from "./components";
import { useAutoLoginForDemo } from "./hooks";

// Customer Layout and Pages
import CustomerLayout from "./layouts/CustomerLayout";
import HomePage from "./pages/customer/HomePage";
import RestaurantsPage from "./pages/customer/RestaurantsPage";
import OffersPage from "./pages/customer/OffersPage";
import LandingPage from "./pages/LandingPage";

// Customer Auth Pages
import CustomerLogin from "./pages/customer/auth/CustomerLogin";
import CustomerRegister from "./pages/customer/auth/CustomerRegister";
import ProfilePage from "./pages/customer/ProfilePage";
import CustomerProtectedRoute from "./components/auth/CustomerProtectedRoute";

const API_URL = "https://api.finefoods.refine.dev";

const App: React.FC = () => {
  // This hook is used to automatically login the user.
  // We use this hook to skip the login page and demonstrate the application more quickly.
  const { loading } = useAutoLoginForDemo();

  const { t, i18n } = useTranslation();
  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  if (loading) {
    return null;
  }

  return (
    <BrowserRouter>
      <GitHubBanner />
      <KBarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <Refine
              routerProvider={routerProvider}
              dataProvider={dataProvider(API_URL)}
              authProvider={authProvider}
              i18nProvider={i18nProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                breadcrumb: false,
                useNewQueryKeys: true,
              }}
              notificationProvider={useNotificationProvider}
              resources={[
                {
                  name: "dashboard",
                  list: "/admin",
                  meta: {
                    label: "Dashboard",
                    icon: <Dashboard />,
                  },
                },
                {
                  name: "orders",
                  list: "/admin/orders",
                  show: "/admin/orders/:id",
                  meta: {
                    icon: <ShoppingBagOutlinedIcon />,
                  },
                },
                {
                  name: "users",
                  list: "/admin/customers",
                  show: "/admin/customers/:id",
                  meta: {
                    icon: <AccountCircleOutlinedIcon />,
                  },
                },
                {
                  name: "products",
                  list: "/admin/products",
                  create: "/admin/products/new",
                  edit: "/admin/products/:id/edit",
                  show: "/admin/products/:id",
                  meta: {
                    icon: <FastfoodOutlinedIcon />,
                  },
                },
                {
                  name: "categories",
                  list: "/admin/categories",
                  meta: {
                    icon: <LabelOutlinedIcon />,
                  },
                },
                {
                  name: "stores",
                  list: "/admin/stores",
                  create: "/admin/stores/new",
                  edit: "/admin/stores/:id/edit",
                  meta: {
                    icon: <StoreOutlinedIcon />,
                  },
                },
                {
                  name: "couriers",
                  list: "/admin/couriers",
                  create: "/admin/couriers/new",
                  edit: "/admin/couriers/:id/edit",
                  meta: {
                    icon: <MopedOutlined />,
                  },
                },
              ]}
            >
              <Routes>
                {/* Root Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* Customer-facing FoodEase Routes */}
                <Route path="/foodease" element={<CustomerLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="restaurants" element={<RestaurantsPage />} />
                  <Route path="offers" element={<OffersPage />} />
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

                {/* Admin Routes with Authentication */}
                <Route
                  path="/admin"
                  element={
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
                  }
                >
                  <Route index element={<DashboardPage />} />

                  <Route path="orders">
                    <Route index element={<OrderList />} />
                    <Route path=":id" element={<OrderShow />} />
                  </Route>
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

                  <Route path="stores">
                    <Route index element={<StoreList />} />
                    <Route path="new" element={<StoreCreate />} />
                    <Route path=":id/edit" element={<StoreEdit />} />
                  </Route>

                  <Route path="categories" element={<CategoryList />} />

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

                {/* Auth Routes */}
                <Route
                  element={
                    <Authenticated key="auth-pages" fallback={<Outlet />}>
                      <NavigateToResource resource="dashboard" />
                    </Authenticated>
                  }
                >
                  <Route
                    path="/login"
                    element={
                      <AuthPage
                        type="login"
                        formProps={{
                          defaultValues: {
                            email: "demo@refine.dev",
                            password: "demodemo",
                          },
                        }}
                      />
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <AuthPage
                        type="register"
                        formProps={{
                          defaultValues: {
                            email: "demo@refine.dev",
                            password: "demodemo",
                          },
                        }}
                      />
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <AuthPage
                        type="forgotPassword"
                        formProps={{
                          defaultValues: {
                            email: "demo@refine.dev",
                          },
                        }}
                      />
                    }
                  />
                  <Route
                    path="/update-password"
                    element={<AuthPage type="updatePassword" />}
                  />
                </Route>

                {/* Legacy redirects for backward compatibility */}
                <Route path="/welcome" element={<Navigate to="/" replace />} />

                {/* Catch-all Routes */}
                <Route
                  element={
                    <Authenticated key="catch-all">
                      <ThemedLayoutV2 Header={Header} Title={Title}>
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
              </Routes>
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </KBarProvider>
    </BrowserRouter>
  );
};

export default App;
