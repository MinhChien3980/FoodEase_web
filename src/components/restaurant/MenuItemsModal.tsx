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
  useMediaQuery,
  Badge,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LoginIcon from "@mui/icons-material/Login";
import StarIcon from "@mui/icons-material/Star";
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { navigateToLogin, navigateToCart } = useCustomerNavigation();
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
      showSnackbar('Vui lòng đăng nhập để thêm vào giỏ hàng', 'warning');
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
      navigateToLogin();
    });
    
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
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2,
            maxHeight: isMobile ? '100vh' : '90vh',
          },
        }}
      >
        {/* Simple Header */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2,
            px: 3,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <RestaurantMenuIcon color="primary" />
            <Box>
              <Typography variant="h6" component="h2" fontWeight={600}>
                Menu - {restaurantName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {menuItems.length} món ăn
              </Typography>
            </Box>
          </Box>
          
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={40} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
              <Button onClick={fetchMenuItems} sx={{ ml: 2 }}>
                Thử lại
              </Button>
            </Alert>
          ) : menuItems.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <RestaurantMenuIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Chưa có món ăn nào
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nhà hàng này chưa thêm món ăn nào vào thực đơn.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {menuItems.map((item, index) => {
                const currentQuantity = isAuthenticated ? getItemQuantity(item.id) : 0;
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        position: 'relative',
                        "&:hover": {
                          boxShadow: 2,
                        },
                        transition: "box-shadow 0.2s ease",
                      }}
                    >
                      {/* Quantity Badge */}
                      {isAuthenticated && currentQuantity > 0 && (
                        <Badge
                          badgeContent={currentQuantity}
                          color="primary"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 1,
                          }}
                        >
                          <Chip
                            label="Đã chọn"
                            size="small"
                            color="primary"
                            variant="filled"
                          />
                        </Badge>
                      )}

                      {/* Popular Badge */}
                      {index < 3 && (
                        <Chip
                          label="Phổ biến"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            zIndex: 1,
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                          }}
                        />
                      )}

                      <CardMedia
                        component="img"
                        height="180"
                        image={item.imageUrl || '/placeholder-food.jpg'}
                        alt={item.name}
                        onError={handleImageError}
                        sx={{ objectFit: "cover" }}
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
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: 40,
                          }}
                        >
                          {item.description}
                        </Typography>

                        <Box sx={{ 
                          display: "flex", 
                          justifyContent: "space-between", 
                          alignItems: "center",
                          mb: 1
                        }}>
                          <Typography
                            variant="h6"
                            color="primary"
                            fontWeight={600}
                          >
                            {formatPrice(item.price)}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {[...Array(5)].map((_, i) => (
                              <StarIcon 
                                key={i}
                                sx={{ 
                                  fontSize: 16, 
                                  color: i < 4 ? '#FFD700' : theme.palette.grey[300] 
                                }} 
                              />
                            ))}
                          </Box>
                        </Box>
                      </CardContent>

                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          startIcon={isAuthenticated ? <AddShoppingCartIcon /> : <LoginIcon />}
                          onClick={() => handleAddToCart(item)}
                          variant="contained"
                          size="medium"
                          fullWidth
                          sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                        >
                          {isAuthenticated ? 'Thêm vào giỏ hàng' : 'Đăng nhập để mua'}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </DialogContent>

        {/* Simple Footer */}
        <DialogActions 
          sx={{ 
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            gap: 1,
          }}
        >
          <Button 
            onClick={onClose} 
            variant="outlined"
            startIcon={<CloseIcon />}
          >
            Đóng
          </Button>
          
          {isAuthenticated && (
            <Button 
              onClick={() => {
                onClose();
                navigateToCart();
              }}
              variant="contained"
              startIcon={<ShoppingCartIcon />}
            >
              Xem giỏ hàng
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Simple Toast Notification */}
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