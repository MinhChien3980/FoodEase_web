import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Divider,
  Paper,
  Alert,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  IconButton,
  Snackbar,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Restaurant as RestaurantIcon,
  LocalOffer as LocalOfferIcon,
  Payment as PaymentIcon,
  Login as LoginIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../../contexts/CartContext';
import { isCustomerAuthenticated, getCustomerUser } from '../../../utils/sessionManager';
import { useCustomerNavigation } from '../../../hooks/useCustomerNavigation';
import { orderService } from '../../../services/orderService';
import { ORDER_STATUS } from '../../../constants';

const CartPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { navigateToRestaurants, navigateToLogin } = useCustomerNavigation();
  const { cart, updateQuantity, removeItem, clearCart } = useCart(); 
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [customerUser, setCustomerUser] = useState<any>(null);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isCustomerAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const user = getCustomerUser();
        setCustomerUser(user);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
  };

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      
      // Prepare order items from cart
      const orderItems = cart.items.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity
      }));

      // Create order request
      const orderRequest = {
        userId: customerUser.id,
        totalPrice: cart.totalAmount,
        items: orderItems,
        createdAt: new Date().toISOString(),
        activeStatus: ORDER_STATUS.PENDING,
      };

      // Call order service to create order
      const response = await orderService.createOrder(orderRequest);

      if (response.code === 200 || response.code === 201) {
        setSnackbar({
          open: true,
          message: 'Đặt hàng thành công!',
          severity: 'success',
        });
        // Clear cart after successful order
        await clearCart();
      } else {
        throw new Error(response.message || 'Đặt hàng thất bại');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Đặt hàng thất bại',
        severity: 'error'
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleContinueShopping = () => {
    navigateToRestaurants();
  };

  const handleLogin = () => {
    navigateToLogin();
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={50} />
        </Box>
      </Container>
    );
  }

  // Show login required message if not authenticated
  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
          }}
        >
          <LoginIcon
            sx={{
              fontSize: 80,
              color: theme.palette.primary.main,
              mb: 2,
            }}
          />
          <Typography variant="h4" gutterBottom color="primary">
            Đăng nhập để xem giỏ hàng
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Bạn cần đăng nhập để xem và quản lý giỏ hàng của mình. Giỏ hàng sẽ được lưu riêng cho từng tài khoản.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<LoginIcon />}
              onClick={handleLogin}
              sx={{ borderRadius: 2 }}
            >
              Đăng nhập
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<RestaurantIcon />}
              onClick={handleContinueShopping}
              sx={{ borderRadius: 2 }}
            >
              Xem nhà hàng
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Group items by restaurant
  const itemsByRestaurant = cart.items.reduce((acc, item) => {
    const restaurantId = item.restaurantId;
    if (!acc[restaurantId]) {
      acc[restaurantId] = {
        restaurantName: item.restaurantName,
        items: [],
      };
    }
    acc[restaurantId].items.push(item);
    return acc;
  }, {} as Record<number, { restaurantName: string; items: typeof cart.items }>);

  // Show empty cart message if no items
  if (cart.totalItems === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
          }}
        >
          <ShoppingCartIcon
            sx={{
              fontSize: 80,
              color: theme.palette.text.secondary,
              mb: 2,
            }}
          />
          <Typography variant="h4" gutterBottom color="text.secondary">
            Giỏ hàng trống
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Xin chào <strong>{customerUser?.fullName}</strong>! Bạn chưa có món ăn nào trong giỏ hàng.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Hãy khám phá các nhà hàng và thêm món yêu thích vào giỏ!
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<RestaurantIcon />}
            onClick={handleContinueShopping}
            sx={{ borderRadius: 2 }}
          >
            Khám phá nhà hàng
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with user greeting */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <ShoppingCartIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            Giỏ hàng của {customerUser?.fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {customerUser?.email}
          </Typography>
        </Box>
        <Chip
          label={`${cart.totalItems} món`}
          color="primary"
          sx={{ ml: 2 }}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          {Object.entries(itemsByRestaurant).map(([restaurantId, { restaurantName, items }]) => (
            <Paper key={restaurantId} elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
              <Box sx={{ p: 2, backgroundColor: theme.palette.primary.light + '20', borderRadius: '8px 8px 0 0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <RestaurantIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {restaurantName}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ p: 2 }}>
                {items.map((item, index) => {
                  // Create a truly unique key for each cart item
                  const uniqueKey = `cart-item-${restaurantId}-${item.id}-${item.quantity}-${index}`;

                  return (
                    <Box key={uniqueKey}>
                      <Card elevation={0} sx={{ display: 'flex', p: 2, backgroundColor: 'transparent' }}>
                        <CardMedia
                          component="img"
                          sx={{
                            width: 100,
                            height: 100,
                            borderRadius: 2,
                            objectFit: 'cover',
                            mr: 2,
                          }}
                          image={item.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='}
                          alt={item.name}
                          onError={handleImageError}
                        />

                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <CardContent sx={{ flex: 1, p: 0 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                              {item.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                mb: 2,
                              }}
                            >
                              {item.description}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="h6" color="primary" fontWeight="bold">
                                {formatPrice(item.price)}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                                {/* Quantity Controls */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <IconButton
                                    size="small"
                                    onClick={() => updateQuantity(item.id, item.restaurantId, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    sx={{
                                      backgroundColor: theme.palette.action.hover,
                                      '&:hover': {
                                        backgroundColor: theme.palette.action.selected,
                                      },
                                    }}
                                  >
                                    <RemoveIcon fontSize="small" />
                                  </IconButton>

                                  <TextField
                                    size="small"
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const newQuantity = parseInt(e.target.value);
                                      if (!isNaN(newQuantity) && newQuantity > 0) {
                                        updateQuantity(item.id, item.restaurantId, newQuantity);
                                      }
                                    }}
                                    sx={{
                                      width: 60,
                                      '& .MuiOutlinedInput-root': {
                                        textAlign: 'center',
                                      },
                                    }}
                                    inputProps={{
                                      style: { textAlign: 'center' },
                                      min: 1,
                                    }}
                                  />

                                  <IconButton
                                    size="small"
                                    onClick={() => updateQuantity(item.id, item.restaurantId, item.quantity + 1)}
                                    sx={{
                                      backgroundColor: theme.palette.action.hover,
                                      '&:hover': {
                                        backgroundColor: theme.palette.action.selected,
                                      },
                                    }}
                                  >
                                    <AddIcon fontSize="small" />
                                  </IconButton>
                                </Box>

                                {/* Remove Button */}
                                <IconButton
                                  color="error"
                                  onClick={() => removeItem(item.id, item.restaurantId)}
                                  sx={{
                                    '&:hover': {
                                      backgroundColor: theme.palette.error.light + '20',
                                    },
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                              <Chip
                                label={`Số lượng: ${item.quantity}`}
                                color="primary"
                                variant="outlined"
                                size="small"
                              />
                            </Box>
                          </CardContent>
                        </Box>
                      </Card>

                      {index < items.length - 1 && <Divider sx={{ my: 2 }} />}
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          ))}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<RestaurantIcon />}
              onClick={handleContinueShopping}
              fullWidth
              sx={{ py: 1.5 }}
            >
              Tiếp tục mua sắm
            </Button>
          </Box>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 20 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Tổng đơn hàng
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Tạm tính:</Typography>
              <Typography variant="body2" fontWeight="bold">
                {formatPrice(cart.totalAmount)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Phí vận chuyển:</Typography>
              <Typography variant="body2" fontWeight="bold">
                {formatPrice(0)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Giảm giá:</Typography>
              <Typography variant="body2" fontWeight="bold" color="success.main">
                -{formatPrice(0)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Tổng cộng:
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {formatPrice(cart.totalAmount)}
              </Typography>
            </Box>

            {/* Promo Code */}
            <TextField
              fullWidth
              placeholder="Mã giảm giá"
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button size="small" variant="text">
                      Áp dụng
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Add Snackbar for notifications */}
            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                severity={snackbar.severity}
                sx={{ width: '100%' }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>

            {/* Update the checkout button to show loading state */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={isCheckingOut ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
              onClick={handleCheckout}
              disabled={isCheckingOut}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                textTransform: 'none',
              }}
            >
              {isCheckingOut ? 'Đang xử lý...' : 'Thanh toán'}
            </Button>

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="caption">
                Miễn phí vận chuyển cho đơn hàng từ 200.000đ
              </Typography>
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage; 