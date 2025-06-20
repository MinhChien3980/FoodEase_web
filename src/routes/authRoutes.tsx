import { Route, Outlet } from "react-router";
import { Authenticated } from "@refinedev/core";
import { NavigateToResource } from "@refinedev/react-router";

// Auth Components
import { AuthPage } from "../pages/auth";

// Authentication Routes Configuration
export const authRoutes = (
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
              email: "admin@gmail.com",
              password: "admin",
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
        />
      }
    />
    <Route
      path="/forgot-password"
      element={
        <AuthPage
          type="forgotPassword"
        />
      }
    />
    <Route
      path="/update-password"
      element={<AuthPage type="updatePassword" />}
    />
  </Route>
);

// Auth Configuration for easier management
export const authConfig = {
  login: {
    path: "/login",
    type: "login",
    defaultValues: {
      email: "admin@gmail.com",
      password: "admin",
    },
  },
  register: {
    path: "/register",
    type: "register",
  },
  forgotPassword: {
    path: "/forgot-password",
    type: "forgotPassword",
  },
  updatePassword: {
    path: "/update-password",
    type: "updatePassword",
  },
} as const;

// Auth Route Groups
export const authRouteGroups = {
  public: [
    "/login",
    "/register",
    "/forgot-password",
  ],
  protected: [
    "/update-password",
  ],
}; 