import { AuthProvider } from "@refinedev/core";
import { setCustomerSession, clearCustomerSession } from "./utils/sessionManager";
import { authService } from "./services";
import { userService } from "./services/userService";

const TOKEN_KEY = "refine-auth";
const ADMIN_TOKEN_KEY = "admin_token";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      // Call login API
      const loginResponse = await authService.login({ email, password });
      console.log('Login response:', loginResponse);

      // Check if login was successful
      if (loginResponse.code === 200 && loginResponse.data?.authenticated) {
        try {
          // Get user profile to check role
          const profileData = await userService.getProfile();
          console.log('Profile data:', profileData);
            
          if (profileData.code === 200 || profileData.code === 201) {
            // Check if user has admin role
            if (profileData.data.login !== 'admin') {
              console.log('Access denied: Not an admin user');
              return {
                success: false,
                error: {
                  message: "Access denied. Admin privileges required.",
                  name: "Unauthorized",
                },
              };
            }

            // Set admin token in sessionStorage
            sessionStorage.setItem(ADMIN_TOKEN_KEY, loginResponse.data.token);
            console.log('Admin token set successfully in session');

            // Set session with token and user data
            await setCustomerSession(loginResponse.data.token, profileData.data);
            console.log('Session set successfully');

            return {
              success: true,
              redirectTo: "/admin",
            };
          } else {
            const fallbackUser = {
              email: email,
              fullName: email.split('@')[0],
              id: 'admin',
              role: 'ADMIN'
            };
            await setCustomerSession(loginResponse.data.token, fallbackUser);
            sessionStorage.setItem(ADMIN_TOKEN_KEY, loginResponse.data.token);
            return {
              success: true,
              redirectTo: "/admin",
            };
          }
        } catch (profileError) {
          console.error('Failed to fetch profile:', profileError);
          const fallbackUser = {
            email: email,
            fullName: email.split('@')[0],
            id: 'admin',
            role: 'ADMIN'
          };
          await setCustomerSession(loginResponse.data.token, fallbackUser);
          sessionStorage.setItem(ADMIN_TOKEN_KEY, loginResponse.data.token);
          return {
            success: true,
            redirectTo: "/admin",
          };
        }
      }

      // Return error if login failed
      console.log('Login failed:', loginResponse.message);
      return {
        success: false,
        error: {
          message: loginResponse.message || "Login failed",
          name: "Invalid credentials",
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: {
          message: "Login failed",
          name: "Network error",
        },
      };
    }
  },
  register: async ({ email, password }) => {
    try {
      await authProvider.login({ email, password });
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Register failed",
          name: "Invalid email or password",
        },
      };
    }
  },
  updatePassword: async (params) => {
    return {
      success: true,
    };
  },
  forgotPassword: async () => {
    return {
      success: true,
    };
  },
  logout: async () => {
    // Clear admin token from sessionStorage
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    clearCustomerSession();
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
  check: async () => {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) {
      return {
        authenticated: false,
        error: {
          message: "No token found",
          name: "Not authenticated",
        },
        logout: true,
        redirectTo: "/login",
      };
    }

    return {
      authenticated: true,
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    try {
      const profileData = await userService.getProfile();
      if (profileData.code === 200) {
        return {
          id: profileData.data.id,
          name: profileData.data.fullName,
          avatar: "https://i.pravatar.cc/150",
        };
      }
    } catch (error) {
      console.error('Get identity error:', error);
    }
    return null;
  },
};
