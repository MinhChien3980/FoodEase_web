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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
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
import { addressService, Address } from '../../../services/addressService';
import { deliveryService } from '../../../services/deliveryService';
import { ORDER_STATUS, ORDER_PAYMENT_METHOD } from '../../../constants';

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
  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState<boolean>(false);
  const [checkoutForm, setCheckoutForm] = useState({
    paymentMethod: ORDER_PAYMENT_METHOD.CASH,
    addressId: '',
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

  // Fetch addresses when component mounts
  useEffect(() => {
    const fetchAddresses = async () => {
      if (isAuthenticated && customerUser) {
        try {
          setLoadingAddresses(true);
          const response = await addressService.getAddressesByUser(customerUser.id);
          if (response.code === 200) {
            setAddresses(response.data);
            // Set default address if available
            if (response.data.length > 0) {
              setCheckoutForm(prev => ({
                ...prev,
                addressId: response.data[0].id.toString()
              }));
            }
          }
        } catch (error) {
          console.error('Error fetching addresses:', error);
        } finally {
          setLoadingAddresses(false);
        }
      }
    };

    fetchAddresses();
  }, [isAuthenticated, customerUser]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
  };

  const handleOpenCheckoutModal = () => {
    setOpenCheckoutModal(true);
  };

  const handleCloseCheckoutModal = () => {
    setOpenCheckoutModal(false);
  };

  const handleCheckoutFormChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckoutForm({
      ...checkoutForm,
      [field]: event.target.value,
    });
  };

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      
      if (!checkoutForm.addressId) {
        throw new Error('Vui lòng chọn địa chỉ giao hàng');
      }

      // Prepare order items from cart
      const orderItems = cart.items.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity
      }));

      // Create order request
      const orderRequest = {
        userId: customerUser.id,
        totalPrice: cart.totalAmount + (cart.totalAmount * 0.1), 
        items: orderItems,
        createdAt: new Date().toISOString(),
        activeStatus: ORDER_STATUS.PENDING,
        paymentMethod: checkoutForm.paymentMethod,
        addressId: parseInt(checkoutForm.addressId),
      };

      // Call order service to create order
      const response = await orderService.createOrder(orderRequest);

      if (response.code === 200 || response.code === 201) {
        const deliveryTime = new Date(Date.now() + 30 * 60000).toISOString();

        // Create delivery request
        const deliveryRequest = {
          orderId: response.data.id,
          status: ORDER_STATUS.PENDING,
          deliveryTime: deliveryTime
        };

        // Create delivery
        await deliveryService.createDelivery(deliveryRequest);

        // Show success message first
        setSnackbar({
          open: true,
          message: 'Đặt hàng thành công!',
          severity: 'success',
        });

        // Wait for 1 second to show the success message
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Then clear cart and close modal
        await clearCart();
        handleCloseCheckoutModal();
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
                {formatPrice(cart.totalAmount * 0.1)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Tổng cộng:
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {formatPrice(cart.totalAmount + (cart.totalAmount * 0.1))}
              </Typography>
            </Box>

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
              onClick={handleOpenCheckoutModal}
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
          </Paper>
        </Grid>
      </Grid>

      {/* Checkout Modal */}
      <Dialog 
        open={openCheckoutModal} 
        onClose={handleCloseCheckoutModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography 
            component="div"
            sx={{ 
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: 'text.primary'
            }}
          >
            Thông tin thanh toán
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Address Selection */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <FormLabel component="legend">Địa chỉ giao hàng</FormLabel>
              {loadingAddresses ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : addresses.length > 0 ? (
                <Select
                  value={checkoutForm.addressId}
                  onChange={(e) => setCheckoutForm(prev => ({ ...prev, addressId: e.target.value }))}
                  displayEmpty
                  fullWidth
                >
                  {addresses.map((address) => (
                    <MenuItem key={address.id} value={address.id.toString()}>
                      {address.addressLine}, {address.area}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  Bạn chưa có địa chỉ giao hàng. Vui lòng thêm địa chỉ trong trang cá nhân.
                </Alert>
              )}
            </FormControl>

            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Phương thức thanh toán</FormLabel>
              <RadioGroup
                value={checkoutForm.paymentMethod}
                onChange={handleCheckoutFormChange('paymentMethod')}
              >
                <FormControlLabel 
                  value={ORDER_PAYMENT_METHOD.CASH} 
                  control={<Radio />} 
                  label="Tiền mặt khi nhận hàng" 
                />
                <FormControlLabel 
                  value={ORDER_PAYMENT_METHOD.CREDIT_CARD} 
                  control={<Radio />} 
                  label="Thẻ Credit" 
                />
              </RadioGroup>
            </FormControl>

            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Tổng thanh toán:
              </Typography>
              <Typography variant="h6" color="primary" fontWeight="bold">
                {formatPrice(cart.totalAmount + (cart.totalAmount * 0.1))}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleCloseCheckoutModal}
            sx={{ mr: 1 }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleCheckout}
            disabled={isCheckingOut || !checkoutForm.addressId}
            startIcon={isCheckingOut ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isCheckingOut ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CartPage;