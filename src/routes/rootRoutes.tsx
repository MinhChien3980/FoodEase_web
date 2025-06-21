import { Route, Navigate, Outlet } from "react-router";
import { Authenticated } from "@refinedev/core";
import { ThemedLayoutV2, ErrorComponent } from "@refinedev/mui";

// Root Components
import { Header, Title } from "../components";

// Root and Miscellaneous Routes Configuration
export const rootRoutes = (
  <>
    {/* Redirect root to the customer home page */}
    <Route path="/" element={<Navigate to="/foodease" replace />} />

    {/* Legacy redirects for backward compatibility */}
    <Route path="/welcome" element={<Navigate to="/foodease" replace />} />

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
    component: "Navigate",
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
      to: "/foodease",
      replace: true,
    },
  ],
}; 