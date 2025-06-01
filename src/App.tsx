import { Refine } from "@refinedev/core";
import { KBarProvider } from "@refinedev/kbar";
import {
  useNotificationProvider,
  RefineSnackbarProvider,
} from "@refinedev/mui";
import GlobalStyles from "@mui/material/GlobalStyles";
import CssBaseline from "@mui/material/CssBaseline";
import dataProvider from "@refinedev/simple-rest";
import routerProvider, {
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { BrowserRouter, Routes } from "react-router";
import { useTranslation } from "react-i18next";
import MopedOutlined from "@mui/icons-material/MopedOutlined";
import Dashboard from "@mui/icons-material/Dashboard";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";

import { authProvider } from "./authProvider";
import { ColorModeContextProvider } from "./contexts";
import { CartProvider } from "./contexts/CartContext";
import { useAutoLoginForDemo } from "./hooks";

// Import grouped routes and utilities
import { 
  adminRoutes, 
  adminResources, 
  customerRoutes, 
  authRoutes, 
  rootRoutes 
} from "./routes";
import { enhanceResourcesWithIcons } from "./routes/routeUtils";

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

  // Enhanced admin resources with icons using utility function
  const enhancedAdminResources = enhanceResourcesWithIcons(adminResources);

  return (
    <BrowserRouter>
      <KBarProvider>
        <ColorModeContextProvider>
          <CartProvider>
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
                resources={enhancedAdminResources}
              >
                <Routes>
                  {/* Root Routes */}
                  {rootRoutes}
                  
                  {/* Customer Routes */}
                  {customerRoutes}

                  {/* Admin Routes */}
                  {adminRoutes}

                  {/* Auth Routes */}
                  {authRoutes}
                </Routes>
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
            </RefineSnackbarProvider>
          </CartProvider>
        </ColorModeContextProvider>
      </KBarProvider>
    </BrowserRouter>
  );
};

// Helper function to get resource icons
function getResourceIcon(resourceName: string) {
  const iconMap: Record<string, JSX.Element> = {
    dashboard: <Dashboard />,
    orders: <ShoppingBagOutlinedIcon />,
    users: <AccountCircleOutlinedIcon />,
    products: <FastfoodOutlinedIcon />,
    categories: <LabelOutlinedIcon />,
    stores: <StoreOutlinedIcon />,
    couriers: <MopedOutlined />,
  };
  
  return iconMap[resourceName] || <Dashboard />;
}

export default App;
