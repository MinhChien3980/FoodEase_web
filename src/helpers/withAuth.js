// lib/withAuth.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isLogged } from "@/events/getters";
import { Box, CircularProgress } from "@mui/joy";

const withAuth = (WrappedComponent) => {
  const AuthHOC = (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
      const checkAuth = async () => {
        const authStatus = await isLogged();
        setIsAuthenticated(authStatus);
        if (!authStatus) {
          router.replace("/home");
        }
      };
      checkAuth();
    }, [router]);

    // Show loader while checking auth status
    if (isAuthenticated === null) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    // Render the wrapped component if authenticated
    return <WrappedComponent {...props} />;
  };

  return AuthHOC;
};

export default withAuth;
