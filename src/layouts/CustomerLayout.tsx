import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useTheme,
  Chip,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link, useLocation, Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LoginIcon from "@mui/icons-material/Login";
import LanguageIcon from "@mui/icons-material/Language";
import TranslateIcon from "@mui/icons-material/Translate";
import { 
  isCustomerAuthenticated, 
  getCustomerUser, 
  clearCustomerSession,
  validateStoredToken 
} from "../utils/sessionManager";

const CustomerLayout: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [languageAnchorEl, setLanguageAnchorEl] = React.useState<null | HTMLElement>(null);
  const [cartItems] = React.useState(3); // Mock cart items count
  
  // Check if customer is logged in
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [customerUser, setCustomerUser] = React.useState<any>(null);

  React.useEffect(() => {
    const checkAuthState = async () => {
      if (isCustomerAuthenticated()) {
        setIsLoggedIn(true);
        const userData = getCustomerUser();
        setCustomerUser(userData);
        
        // Validate token silently in background
        try {
          await validateStoredToken();
          // Refresh user data after validation
          const updatedUserData = getCustomerUser();
          setCustomerUser(updatedUserData);
        } catch (error) {
          console.error('Token validation failed:', error);
          // If validation fails, user will be logged out by validateStoredToken
          setIsLoggedIn(false);
          setCustomerUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setCustomerUser(null);
      }
    };

    checkAuthState();
  }, [location]); // Re-check when location changes

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageAnchorEl(null);
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    handleLanguageMenuClose();
  };

  const handleLogout = () => {
    clearCustomerSession();
    setIsLoggedIn(false);
    setCustomerUser(null);
    handleMenuClose();
    window.location.href = '/foodease'; // Refresh to update state
  };

  const navigation = [
    { name: t("customer.navigation.home", { defaultValue: "Home" }), href: "/foodease", icon: <HomeIcon /> },
    { name: t("customer.navigation.restaurants", { defaultValue: "Restaurants" }), href: "/foodease/restaurants", icon: <RestaurantIcon /> },
    { name: t("customer.navigation.offers", { defaultValue: "Offers" }), href: "/foodease/offers", icon: <LocalOfferIcon /> },
    { name: t("customer.navigation.favorites", { defaultValue: "Favorites" }), href: "/foodease/favorites", icon: <FavoriteIcon /> },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const isActivePath = (path: string) => {
    if (path === "/foodease") {
      return location.pathname === "/foodease";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navigation Header */}
      <AppBar 
        position="sticky" 
        sx={{ 
          backgroundColor: "white",
          color: theme.palette.text.primary,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h5"
                component={Link}
                to="/foodease"
                sx={{
                  fontWeight: "bold",
                  textDecoration: "none",
                  color: theme.palette.primary.main,
                  mr: 4,
                }}
              >
                🍕 FoodEase
              </Typography>

              {/* Navigation Links - Desktop */}
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                {navigation.map((item) => (
                  <Button
                    key={item.name}
                    component={Link}
                    to={item.href}
                    startIcon={item.icon}
                    sx={{
                      color: isActivePath(item.href) 
                        ? theme.palette.primary.main 
                        : theme.palette.text.primary,
                      fontWeight: isActivePath(item.href) ? 600 : 400,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.light + "20",
                      },
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Right Side Actions */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Language Switcher */}
              <Chip
                icon={<LanguageIcon />}
                label={currentLanguage.flag + " " + currentLanguage.code.toUpperCase()}
                size="small"
                variant="outlined"
                onClick={handleLanguageMenuOpen}
                sx={{ 
                  display: { xs: "none", sm: "flex" },
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.light + "20",
                  }
                }}
              />

              <Menu
                anchorEl={languageAnchorEl}
                open={Boolean(languageAnchorEl)}
                onClose={handleLanguageMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {languages.map((language) => (
                  <MenuItem 
                    key={language.code} 
                    onClick={() => handleLanguageChange(language.code)}
                    selected={language.code === i18n.language}
                  >
                    <ListItemIcon>
                      <span style={{ fontSize: "1.2em" }}>{language.flag}</span>
                    </ListItemIcon>
                    <ListItemText primary={language.name} />
                  </MenuItem>
                ))}
              </Menu>

              {/* Cart */}
              <IconButton color="inherit">
                <Badge badgeContent={cartItems} color="primary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              {/* User Menu */}
              {isLoggedIn ? (
                <>
                  <IconButton onClick={handleMenuOpen} color="inherit">
                    <Avatar sx={{ width: 32, height: 32, backgroundColor: theme.palette.primary.main }}>
                      {customerUser?.imageUrl ? (
                        <img src={customerUser.imageUrl} alt={customerUser.fullName} style={{ width: "100%", height: "100%" }} />
                      ) : (
                        customerUser?.fullName?.charAt(0).toUpperCase() || <PersonIcon />
                      )}
                    </Avatar>
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
                      <Typography variant="subtitle2" fontWeight="600">
                        {customerUser?.fullName || 'Customer'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {customerUser?.email}
                      </Typography>
                    </Box>
                    <MenuItem component={Link} to="/foodease/profile" onClick={handleMenuClose}>
                      <AccountCircleIcon sx={{ mr: 1 }} />
                      My Profile
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                      <FavoriteIcon sx={{ mr: 1 }} />
                      My Favorites
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                      <RestaurantIcon sx={{ mr: 1 }} />
                      Order History
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                      <LogoutIcon sx={{ mr: 1 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/foodease/login"
                    variant="outlined"
                    size="small"
                    startIcon={<LoginIcon />}
                    sx={{ display: { xs: "none", sm: "flex" } }}
                  >
                    Sign In
                  </Button>
                  <IconButton 
                    component={Link}
                    to="/foodease/login"
                    color="inherit"
                    sx={{ display: { xs: "flex", sm: "none" } }}
                  >
                    <PersonIcon />
                  </IconButton>
                </>
              )}

              {/* Mobile Menu */}
              <IconButton 
                sx={{ display: { xs: "flex", md: "none" } }}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>

          {/* Mobile Navigation */}
          <Box 
            sx={{ 
              display: { xs: "flex", md: "none" }, 
              pb: 1, 
              gap: 1,
              overflowX: "auto",
            }}
          >
            {navigation.map((item) => (
              <Button
                key={item.name}
                component={Link}
                to={item.href}
                startIcon={item.icon}
                size="small"
                sx={{
                  color: isActivePath(item.href) 
                    ? theme.palette.primary.main 
                    : theme.palette.text.primary,
                  fontWeight: isActivePath(item.href) ? 600 : 400,
                  minWidth: "auto",
                  whiteSpace: "nowrap",
                }}
              >
                {item.name}
              </Button>
            ))}
          </Box>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Box 
        sx={{ 
          backgroundColor: theme.palette.grey[900],
          color: "white",
          py: 4,
          mt: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                🍕 FoodEase
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {t("footer.tagline", { defaultValue: "Your favorite food delivery app" })}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                {t("footer.quickLinks", { defaultValue: "Quick Links" })}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography 
                  variant="body2" 
                  component={Link} 
                  to="/foodease" 
                  sx={{ color: "inherit", textDecoration: "none", opacity: 0.8 }}
                >
                  {t("customer.navigation.home", { defaultValue: "Home" })}
                </Typography>
                <Typography 
                  variant="body2" 
                  component={Link} 
                  to="/foodease/restaurants" 
                  sx={{ color: "inherit", textDecoration: "none", opacity: 0.8 }}
                >
                  {t("customer.navigation.restaurants", { defaultValue: "Restaurants" })}
                </Typography>
                <Typography 
                  variant="body2" 
                  component={Link} 
                  to="/foodease/offers" 
                  sx={{ color: "inherit", textDecoration: "none", opacity: 0.8 }}
                >
                  {t("customer.navigation.offers", { defaultValue: "Offers" })}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                {t("footer.support", { defaultValue: "Support" })}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {t("footer.helpCenter", { defaultValue: "Help Center" })}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {t("footer.contactUs", { defaultValue: "Contact Us" })}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {t("footer.privacyPolicy", { defaultValue: "Privacy Policy" })}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.2)" }} />
          
          <Typography variant="body2" textAlign="center" sx={{ opacity: 0.6 }}>
            {t("footer.copyright", { defaultValue: "© 2024 FoodEase. All rights reserved." })}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default CustomerLayout; 