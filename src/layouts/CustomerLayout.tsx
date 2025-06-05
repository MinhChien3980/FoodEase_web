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
  Fade,
  Slide,
  Grow,
  Paper,
  alpha,
} from "@mui/material";
import { Link, Outlet, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Home as HomeIcon,
  Restaurant as RestaurantIcon,
  LocalOffer as LocalOfferIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Language as LanguageIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LoginIcon from "@mui/icons-material/Login";
import TranslateIcon from "@mui/icons-material/Translate";
import { 
  isCustomerAuthenticated, 
  getCustomerUser, 
  clearCustomerSession,
  validateStoredToken 
} from "../utils/sessionManager";
import { useCart } from "../contexts/CartContext";
import { useCustomerNavigation } from "../hooks/useCustomerNavigation";

const CustomerLayout: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const { navigateToCart, navigateToHome } = useCustomerNavigation();
  const { t, i18n } = useTranslation();
  const { cart } = useCart();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [languageAnchorEl, setLanguageAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isScrolled, setIsScrolled] = React.useState(false);
  
  // Check if customer is logged in
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [customerUser, setCustomerUser] = React.useState<any>(null);

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
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
    navigateToHome();
    // Force re-render by updating the effect dependency
    // This will trigger the cart context to reset for guest user
  };

  const handleCartClick = () => {
    navigateToCart();
  };

  const navigation = [
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
      {/* Enhanced Navigation Header */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          background: isScrolled 
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.95)}, ${alpha(theme.palette.secondary.main, 0.95)})`
            : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha('#fff', 0.1)}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isScrolled 
            ? '0 8px 32px rgba(0, 0, 0, 0.12)' 
            : '0 4px 20px rgba(0, 0, 0, 0.08)',
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between", py: 0.5, minHeight: { xs: 48, md: 56 } }}>
            {/* Enhanced Logo */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h5"
                component={Link}
                to="/foodease"
                sx={{
                  fontWeight: 800,
                  textDecoration: "none",
                  color: "white",
                  mr: { xs: 1.5, md: 4 },
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    filter: 'brightness(1.1)'
                  }
                }}
              >
                🍕 FoodEase
              </Typography>

              {/* Enhanced Navigation Links - Desktop */}
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5 }}>
                {navigation.map((item, index) => (
                  <Grow in timeout={800 + index * 100} key={item.name}>
                    <Button
                      component={Link}
                      to={item.href}
                      startIcon={item.icon}
                      sx={{
                        color: "white",
                        fontWeight: isActivePath(item.href) ? 700 : 500,
                        fontSize: '0.875rem',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        position: 'relative',
                        background: isActivePath(item.href) 
                          ? 'rgba(255, 255, 255, 0.2)' 
                          : 'transparent',
                        backdropFilter: isActivePath(item.href) ? 'blur(10px)' : 'none',
                        border: isActivePath(item.href) 
                          ? '1px solid rgba(255, 255, 255, 0.3)' 
                          : '1px solid transparent',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        "&:hover": {
                          background: 'rgba(255, 255, 255, 0.25)',
                          backdropFilter: 'blur(15px)',
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                        },
                        "&::before": {
                          content: '""',
                          position: 'absolute',
                          bottom: -2,
                          left: '50%',
                          width: isActivePath(item.href) ? '100%' : '0%',
                          height: 3,
                          background: 'linear-gradient(90deg, #ffffff, #f0f0f0)',
                          borderRadius: '2px 2px 0 0',
                          transform: 'translateX(-50%)',
                          transition: 'width 0.3s ease'
                        },
                        "&:hover::before": {
                          width: '100%'
                        }
                      }}
                    >
                      {item.name}
                    </Button>
                  </Grow>
                ))}
              </Box>
            </Box>

            {/* Enhanced Right Side Actions */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Enhanced Language Switcher */}
              <Fade in timeout={1000}>
                <Chip
                  icon={<LanguageIcon />}
                  label={currentLanguage.flag + " " + currentLanguage.code.toUpperCase()}
                  size="small"
                  variant="filled"
                  onClick={handleLanguageMenuOpen}
                  sx={{ 
                    display: { xs: "none", sm: "flex" },
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: 'all 0.3s ease',
                    "&:hover": {
                      background: 'rgba(255, 255, 255, 0.3)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    },
                    "& .MuiChip-icon": {
                      color: "white"
                    }
                  }}
                />
              </Fade>

              <Menu
                anchorEl={languageAnchorEl}
                open={Boolean(languageAnchorEl)}
                onClose={handleLanguageMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                PaperProps={{
                  sx: {
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 3,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    mt: 1
                  }
                }}
              >
                {languages.map((language) => (
                  <MenuItem 
                    key={language.code} 
                    onClick={() => handleLanguageChange(language.code)}
                    selected={language.code === i18n.language}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      '&:hover': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`
                      },
                      '&.Mui-selected': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}25, ${theme.palette.secondary.main}25)`
                      }
                    }}
                  >
                    <ListItemIcon>
                      <span style={{ fontSize: "1.2em" }}>{language.flag}</span>
                    </ListItemIcon>
                    <ListItemText primary={language.name} />
                  </MenuItem>
                ))}
              </Menu>

              {/* Enhanced Cart */}
              <Fade in timeout={1200}>
                <IconButton 
                  onClick={handleCartClick}
                  size="small"
                  sx={{
                    color: "white",
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.3s ease',
                    "&:hover": {
                      background: 'rgba(255, 255, 255, 0.3)',
                      transform: 'translateY(-2px) scale(1.05)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  <Badge 
                    badgeContent={isLoggedIn ? cart.totalItems : 0} 
                    color="error" 
                    max={99}
                    sx={{
                      '& .MuiBadge-badge': {
                        background: 'linear-gradient(45deg, #ff6b6b, #ff8e53)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        animation: cart.totalItems > 0 ? 'pulse 2s infinite' : 'none',
                        '@keyframes pulse': {
                          '0%': { transform: 'scale(1)' },
                          '50%': { transform: 'scale(1.1)' },
                          '100%': { transform: 'scale(1)' }
                        }
                      }
                    }}
                  >
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Fade>

              {/* Enhanced User Menu */}
              {isLoggedIn ? (
                <Fade in timeout={1400}>
                  <Box>
                    <IconButton 
                      onClick={handleMenuOpen}
                      size="small"
                      sx={{
                        p: 0.25,
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.3s ease',
                        "&:hover": {
                          background: 'rgba(255, 255, 255, 0.3)',
                          transform: 'translateY(-2px) scale(1.05)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                        }
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
                          color: theme.palette.primary.main,
                          fontWeight: 700,
                          fontSize: '1rem'
                        }}
                      >
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
                      PaperProps={{
                        sx: {
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: 3,
                          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                          mt: 1,
                          minWidth: 200
                        }
                      }}
                    >
                      <MenuItem 
                        component={Link} 
                        to="/foodease/profile" 
                        onClick={handleMenuClose}
                        sx={{
                          borderRadius: 2,
                          mx: 1,
                          my: 0.5,
                          '&:hover': {
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`
                          }
                        }}
                      >
                        <ListItemIcon>
                          <PersonIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Profile" 
                          secondary={customerUser?.fullName}
                        />
                      </MenuItem>
                      <MenuItem 
                        onClick={handleLogout}
                        sx={{
                          borderRadius: 2,
                          mx: 1,
                          my: 0.5,
                          '&:hover': {
                            background: `linear-gradient(45deg, ${theme.palette.error.main}15, ${theme.palette.warning.main}15)`
                          }
                        }}
                      >
                        <ListItemIcon>
                          <LogoutIcon color="error" />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                      </MenuItem>
                    </Menu>
                  </Box>
                </Fade>
              ) : (
                <Fade in timeout={1400}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      component={Link}
                      to="/foodease/login"
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: "white",
                        color: "white",
                        fontWeight: 600,
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        "&:hover": {
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderColor: "white",
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      LOGIN
                    </Button>
                    <Button
                      component={Link}
                      to="/foodease/register"
                      variant="contained"
                      size="small"
                      sx={{
                        background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
                        color: theme.palette.primary.main,
                        fontWeight: 700,
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        transition: 'all 0.3s ease',
                        "&:hover": {
                          background: 'linear-gradient(45deg, #f0f0f0, #e0e0e0)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
                        },
                      }}
                    >
                      SIGN UP
                    </Button>
                  </Box>
                </Fade>
              )}

              {/* Enhanced Mobile Menu */}
              <IconButton 
                size="small"
                sx={{ 
                  display: { xs: "flex", md: "none" },
                  color: "white",
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  "&:hover": {
                    background: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  }
                }}
                onClick={handleMobileMenuOpen}
              >
                <MenuIcon />
              </IconButton>

              <Menu
                anchorEl={mobileMenuAnchorEl}
                open={Boolean(mobileMenuAnchorEl)}
                onClose={handleMobileMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                PaperProps={{
                  sx: {
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 3,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    mt: 1,
                    minWidth: 250
                  }
                }}
              >
                {navigation.map((item) => (
                  <MenuItem 
                    key={item.name}
                    component={Link}
                    to={item.href}
                    onClick={handleMobileMenuClose}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      background: isActivePath(item.href) 
                        ? `linear-gradient(45deg, ${theme.palette.primary.main}25, ${theme.palette.secondary.main}25)`
                        : 'transparent',
                      '&:hover': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`
                      }
                    }}
                  >
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>

      {/* Enhanced Footer */}
      <Box 
        sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.grey[900]}, ${theme.palette.grey[800]})`,
          color: "white",
          py: 6,
          mt: 8,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${alpha('#fff', 0.2)}, transparent)`
          }
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 6, mb: 4 }}>
            <Box sx={{ flex: 1, minWidth: 250 }}>
              <Typography variant="h5" fontWeight="800" gutterBottom sx={{ 
                background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                🍕 FoodEase
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8, lineHeight: 1.6, mb: 3 }}>
                {t("footer.tagline", { defaultValue: "Your favorite food delivery app - bringing delicious meals to your doorstep with just a few clicks." })}
              </Typography>
            </Box>
            
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="h6" fontWeight="700" gutterBottom sx={{ color: 'white', mb: 3 }}>
                {t("footer.quickLinks", { defaultValue: "Quick Links" })}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {navigation.map((item) => (
                  <Typography 
                    key={item.name}
                    variant="body1" 
                    component={Link} 
                    to={item.href} 
                    sx={{ 
                      color: "inherit", 
                      textDecoration: "none", 
                      opacity: 0.8,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        opacity: 1,
                        transform: 'translateX(8px)',
                        color: theme.palette.primary.light
                      }
                    }}
                  >
                    {item.name}
                  </Typography>
                ))}
              </Box>
            </Box>

            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="h6" fontWeight="700" gutterBottom sx={{ color: 'white', mb: 3 }}>
                {t("footer.support", { defaultValue: "Support" })}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {[
                  { label: t("footer.helpCenter", { defaultValue: "Help Center" }) },
                  { label: t("footer.contactUs", { defaultValue: "Contact Us" }) },
                  { label: t("footer.privacyPolicy", { defaultValue: "Privacy Policy" }) }
                ].map((link) => (
                  <Typography 
                    key={link.label}
                    variant="body1" 
                    sx={{ 
                      opacity: 0.8, 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        opacity: 1,
                        transform: 'translateX(8px)',
                        color: theme.palette.primary.light
                      }
                    }}
                  >
                    {link.label}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.2)" }} />
          
          <Typography variant="body1" textAlign="center" sx={{ opacity: 0.7, fontWeight: 500 }}>
            {t("footer.copyright", { defaultValue: "© 2024 FoodEase. All rights reserved. Made with ❤️ for food lovers." })}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default CustomerLayout; 