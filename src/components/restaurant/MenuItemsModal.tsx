import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  CardActions,
  Snackbar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LoginIcon from "@mui/icons-material/Login";
import { restaurantService, MenuItem } from "../../services";
import { ICartItem } from "../../interfaces";
import { useCart } from "../../contexts/CartContext";
import { isCustomerAuthenticated } from "../../utils/sessionManager";
import { useCustomerNavigation } from "../../hooks/useCustomerNavigation";

interface MenuItemsModalProps {
  open: boolean;
  onClose: () => void;
  restaurantId: number;
  restaurantName: string;
}

const MenuItemsModal: React.FC<MenuItemsModalProps> = ({
  open,
  onClose,
  restaurantId,
  restaurantName,
}) => {
  const theme = useTheme();
  const { navigateToLogin } = useCustomerNavigation();
  const { addToCart, getItemQuantity } = useCart();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Check authentication status
  useEffect(() => {
    setIsAuthenticated(isCustomerAuthenticated());
  }, [open]);

  // Fetch menu items when modal opens
  useEffect(() => {
    if (open && restaurantId) {
      fetchMenuItems();
    }
  }, [open, restaurantId]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await restaurantService.getMenuItemsByRestaurantId(restaurantId);
      setMenuItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu items');
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = '/placeholder-food.jpg';
  };

  const showSnackbar = (message: string, severity: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleAddToCart = (item: MenuItem) => {
    if (!isAuthenticated) {
      // Show a more friendly message and redirect to login
      setTimeout(() => {
        navigateToLogin();
      }, 1500);
      return;
    }

    const cartItem: Omit<ICartItem, 'quantity'> = {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      categoryId: item.categoryId,
      restaurantId: restaurantId,
      restaurantName: restaurantName,
    };

    addToCart(cartItem, () => {
      // This callback shouldn't be called since we already checked auth above
      navigateToLogin();
    });
    
    // Show success message
    const currentQuantity = getItemQuantity(item.id);
    showSnackbar(`Đã thêm "${item.name}" vào giỏ hàng! (Số lượng: ${currentQuantity + 1})`, 'success');
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `1px solid ${theme.palette.divider}`,
            pb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <RestaurantMenuIcon color="primary" />
            <Typography variant="h5" component="h2" fontWeight={600}>
              Menu - {restaurantName}
            </Typography>
          </Box>
          <IconButton onClick={onClose} edge="end">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={50} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
              <Button onClick={fetchMenuItems} sx={{ ml: 2 }}>
                Retry
              </Button>
            </Alert>
          ) : menuItems.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <RestaurantMenuIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No menu items available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This restaurant hasn't added any menu items yet.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {menuItems.map((item) => {
                const currentQuantity = isAuthenticated ? getItemQuantity(item.id) : 0;
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        "&:hover": {
                          boxShadow: theme.shadows[4],
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease-in-out",
                        position: 'relative',
                      }}
                    >
                      {/* Quantity Badge - Only show if authenticated and has items */}
                      {isAuthenticated && currentQuantity > 0 && (
                        <Chip
                          label={`${currentQuantity} trong giỏ`}
                          color="primary"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 1,
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                          }}
                        />
                      )}

                      <CardMedia
                        component="img"
                        height="200"
                        image={item.imageUrl || '/placeholder-food.jpg'}
                        alt={item.name}
                        onError={handleImageError}
                        sx={{
                          objectFit: "cover",
                          backgroundColor: theme.palette.grey[200],
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Typography
                          variant="h6"
                          component="h3"
                          gutterBottom
                          sx={{
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: 60,
                          }}
                        >
                          {item.description}
                        </Typography>

                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
                          <Typography
                            variant="h6"
                            color="primary"
                            fontWeight={600}
                          >
                            {formatPrice(item.price)}
                          </Typography>
                        </Box>
                      </CardContent>

                      {/* Action Buttons */}
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                           startIcon={isAuthenticated ? <ShoppingCartIcon /> : <LoginIcon />}
                           onClick={() => handleAddToCart(item)}
                           variant="contained"
                           size="small"
                           sx={{ flex: 1 }}
                        >
                          {isAuthenticated ? 'Thêm giỏ hàng' : 'Đăng nhập để mua'}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          iconMapping={{
            success: <CheckCircleIcon fontSize="inherit" />,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MenuItemsModal; 