import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Paper,
  useTheme,
} from "@mui/material";
import { Link } from "react-router";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const LandingPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 4,
            boxShadow: theme.shadows[20],
          }}
        >
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            🍕 FoodEase
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            Complete Food Delivery Solution
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
            Choose your experience: Manage your food delivery business with our powerful admin panel, 
            or explore and order from restaurants as a customer.
          </Typography>

          <Grid container spacing={4}>
            {/* Admin Panel */}
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  height: "100%",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: theme.shadows[12],
                  }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: "center" }}>
                  <AdminPanelSettingsIcon 
                    sx={{ 
                      fontSize: 64, 
                      color: theme.palette.primary.main, 
                      mb: 2 
                    }} 
                  />
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Admin Panel
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Manage restaurants, orders, customers, and analytics with our comprehensive admin dashboard.
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Features:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Order Management & Analytics
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Restaurant & Product Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Customer Support & Reports
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Courier & Delivery Tracking
                    </Typography>
                  </Box>

                  <Button
                    component={Link}
                    to="/admin"
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<DashboardIcon />}
                    sx={{ fontWeight: "bold" }}
                  >
                    Access Admin Panel
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Customer App */}
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  height: "100%",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: theme.shadows[12],
                  }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: "center" }}>
                  <RestaurantMenuIcon 
                    sx={{ 
                      fontSize: 64, 
                      color: theme.palette.secondary.main, 
                      mb: 2 
                    }} 
                  />
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Customer App
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Browse restaurants, discover deals, and order delicious food delivered to your doorstep.
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Features:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Browse Local Restaurants
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Exclusive Deals & Offers
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Real-time Order Tracking
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Multiple Payment Options
                    </Typography>
                  </Box>

                  <Button
                    component={Link}
                    to="/foodease"
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<ShoppingCartIcon />}
                    color="secondary"
                    sx={{ fontWeight: "bold" }}
                  >
                    Start Ordering Food
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, pt: 4, borderTop: 1, borderColor: "divider" }}>
            <Typography variant="body2" color="text.secondary">
              Demo application showcasing both admin and customer interfaces
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LandingPage; 