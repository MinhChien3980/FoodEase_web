import { Route, Navigate, Outlet } from "react-router";
import { Authenticated } from "@refinedev/core";
import { ThemedLayoutV2, ErrorComponent } from "@refinedev/mui";

// Root Components
import LandingPage from "../pages/LandingPage";
import { Header, Title } from "../components";

// Root and Miscellaneous Routes Configuration
export const rootRoutes = (
  <>
    {/* Root Landing Page */}
    <Route path="/" element={<LandingPage />} />

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
  </>
);

// Root Route Configuration
export const rootConfig = {
  landing: {
    path: "/",
    component: "LandingPage",
    public: true,
  },
  error: {
    path: "*",
    component: "ErrorComponent",
    requiresAuth: true,
  },
  redirects: [
    {
      from: "/welcome",
      to: "/",
      replace: true,
    },
  ],
}; 