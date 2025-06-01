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
  IconButton,
  Divider,
  Paper,
  Alert,
  Chip,
  TextField,
  InputAdornment,
  Fab,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  Restaurant as RestaurantIcon,
  LocalOffer as LocalOfferIcon,
  Payment as PaymentIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../../contexts/CartContext';
import { isCustomerAuthenticated, getCustomerUser } from '../../../utils/sessionManager';
import { useCustomerNavigation } from '../../../hooks/useCustomerNavigation';

const CartPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { navigateToRestaurants, navigateToLogin } = useCustomerNavigation();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [customerUser, setCustomerUser] = useState<any>(null);

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

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: number) => {
    removeFromCart(itemId);
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = '/placeholder-food.jpg';
  };

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    alert('Chức năng thanh toán sẽ được triển khai sau!');
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
                {items.map((item, index) => (
                  <Box key={item.id}>
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
                        image={item.imageUrl || '/placeholder-food.jpg'}
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
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            {formatPrice(item.price)}
                          </Typography>
                        </CardContent>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                          {/* Quantity Controls */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
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
                                  handleQuantityChange(item.id, newQuantity);
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
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
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
                            onClick={() => handleRemoveItem(item.id)}
                            sx={{
                              '&:hover': {
                                backgroundColor: theme.palette.error.light + '20',
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </Card>

                    {index < items.length - 1 && <Divider sx={{ my: 2 }} />}
                  </Box>
                ))}
              </Box>
            </Paper>
          ))}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<RestaurantIcon />}
              onClick={handleContinueShopping}
              sx={{ flex: 1 }}
            >
              Tiếp tục mua sắm
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={clearCart}
              sx={{ flex: 1 }}
            >
              Xóa tất cả
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

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<PaymentIcon />}
              onClick={handleCheckout}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                textTransform: 'none',
              }}
            >
              Thanh toán
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