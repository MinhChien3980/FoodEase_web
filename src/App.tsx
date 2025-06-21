import { Refine } from "@refinedev/core";
import { KBarProvider } from "@refinedev/kbar";
import {
  useNotificationProvider,
  RefineSnackbarProvider,
  ThemedLayoutV2,
  ThemedHeaderV2,
  ThemedSiderV2,
  ThemedTitleV2,
} from "@refinedev/mui";
import GlobalStyles from "@mui/material/GlobalStyles";
import CssBaseline from "@mui/material/CssBaseline";
import dataProvider from "@refinedev/simple-rest";
import routerProvider, {
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { BrowserRouter, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authProvider } from "./authProvider";
import { ColorModeContextProvider } from "./contexts";
import { CartProvider } from "./contexts/CartContext";
import { adminRoutes, adminResources, customerRoutes, authRoutes, rootRoutes } from "./routes";
import { enhanceResourcesWithIcons } from "./routes/routeUtils";
import { SnackbarProvider } from "notistack";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:80800/api";

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  const enhancedAdminResources = enhanceResourcesWithIcons(adminResources);

  return (
    <BrowserRouter>
      <KBarProvider>
        <ColorModeContextProvider>
          <CartProvider>
            <CssBaseline />
            <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
            <RefineSnackbarProvider>
              <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
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
                    {rootRoutes}
                    {customerRoutes}
                    {adminRoutes}
                    {authRoutes}
                  </Routes>
                  <UnsavedChangesNotifier />
                  <DocumentTitleHandler />
                </Refine>
              </SnackbarProvider>
            </RefineSnackbarProvider>
          </CartProvider>
        </ColorModeContextProvider>
      </KBarProvider>
    </BrowserRouter>
  );
};

export default App;
