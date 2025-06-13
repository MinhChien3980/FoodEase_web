import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Paper,
  TextField,
  IconButton,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PaymentIcon from "@mui/icons-material/Payment";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import LanguageIcon from "@mui/icons-material/Language";
import OrderStatusChip from "../../../components/order/OrderStatusChip";
import { formatPrice } from "../../../utils/foodHelpers";
import apiClient, { handleApiError } from "../../../services/apiClient";
import { API_ENDPOINTS } from "../../../config/api";
import { orderService, Order } from "../../../services/orderService";
import { userService } from "../../../services/userService";

interface CustomerUser {
  id: number;
  login: string;
  email: string;
  activated: boolean;
  langKey: string;
  createdBy: string;
  createdAt: string;
  roles: string[];
  fullName: string;
  phone: string;
  imageUrl?: string;
  referralCode?: string;
  cityId: number;
  latitude?: number;
  longitude?: number;
}

interface City {
  id: number;
  name: string;
}

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<CustomerUser>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = sessionStorage.getItem('customer_token');
    
    if (!token) {
      navigate('/foodease/login');
      return;
    }

    fetchUserProfile(token);
    fetchCities();
  }, [navigate]);

  useEffect(() => {
    if (user?.id) {
      fetchUserOrders(user.id);
    }
  }, [user?.id]);

  const fetchCities = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CITIES.GET_ALL);
      
      if (response.data.code === 200) {
        setCities(response.data.data);
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const getCityName = (cityId: number): string => {
    const city = cities.find(c => c.id === cityId);
    return city ? city.name : `City ID: ${cityId}`;
  };

  const fetchUserProfile = async (token: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get(API_ENDPOINTS.USERS.PROFILE);
      
      if (response.data.code === 200) {
        setUser(response.data.data);
        setEditedUser(response.data.data);
        // Update sessionStorage with fresh data
        sessionStorage.setItem('customer_user', JSON.stringify(response.data.data));
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      setError(handleApiError(error));
      
      // Try to get user from sessionStorage as fallback
      const cachedUser = sessionStorage.getItem('customer_user');
      if (cachedUser) {
        try {
          const parsedUser = JSON.parse(cachedUser);
          setUser(parsedUser as CustomerUser);
          setEditedUser(parsedUser);
        } catch (parseError) {
          navigate('/foodease/login');
        }
      } else {
        navigate('/foodease/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async (userId: number) => {
    try {
      setLoadingOrders(true);
      const userOrders = await orderService.getOrdersByUserId(userId);
      console.log("userOrders: ", userOrders);
      setOrders(userOrders);
    } catch (error) {
      setError(t('failedToLoadOrders'));
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('customer_token');
    sessionStorage.removeItem('customer_user');
    navigate('/foodease');
  };

  const handleEditToggle = async () => {
    if (editMode) {
      // Save changes
      const token = sessionStorage.getItem('customer_token');
      if (!token || !user) return;

      try {
        const updateData = {
          fullName: editedUser.fullName || '',
          phone: editedUser.phone || '',
          cityId: editedUser.cityId || 0,
          langKey: editedUser.langKey || 'en'
        };

        const response = await userService.updateProfile(user.id, updateData);
        
        if (response.code === 200) {
          const updatedUser = { ...user, ...response.data } as CustomerUser;
          setUser(updatedUser);
          sessionStorage.setItem('customer_user', JSON.stringify(updatedUser));
          setUpdateMessage(t('profileUpdatedSuccessfully'));
          setTimeout(() => setUpdateMessage(null), 3000);
        } else {
          throw new Error(response.message || t('failedToUpdateProfile'));
        }
      } catch (error) {
        setError(handleApiError(error));
      }
    }
    setEditMode(!editMode);
  };

  const handleCancelEdit = () => {
    setEditedUser(user || {});
    setEditMode(false);
  };

  const handleInputChange = (field: keyof CustomerUser, value: string) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={40} />
        <Typography sx={{ ml: 2 }}>{t('loadingProfile')}</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>{t('noUserDataAvailable')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: theme.palette.grey[50], py: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {t('myProfile')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('manageAccountSettingsPreferences')}
          </Typography>
        </Box>

        {/* Update Message */}
        {updateMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {updateMessage}
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Profile Info */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, textAlign: "center" }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: "auto",
                  mb: 2,
                  backgroundColor: theme.palette.primary.main,
                  fontSize: "2rem",
                }}
                src={user.imageUrl}
              >
                {!user.imageUrl && user.fullName.charAt(0).toUpperCase()}
              </Avatar>

              {editMode ? (
                <>
                  <TextField
                    fullWidth
                    label={t('fullName')}
                    value={editedUser.fullName || ''}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label={t('phone')}
                    value={editedUser.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton color="primary" onClick={handleEditToggle}>
                      <CheckIcon />
                    </IconButton>
                    <IconButton color="error" onClick={handleCancelEdit}>
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </>
              ) : (
                <>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {user.fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {user.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {user.phone}
                  </Typography>
                  
                  {user.referralCode && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {t('referralCode')}: <strong>{user.referralCode}</strong>
                    </Typography>
                  )}

                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEditToggle}
                    fullWidth
                  >
                    {t('editProfile')}
                  </Button>
                </>
              )}
            </Card>

            {/* Quick Actions */}
            <Card sx={{ mt: 3 }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t('quickActions')}
                </Typography>
                <List dense>
                  <ListItemButton onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                      <LogoutIcon color="error" />
                    </ListItemIcon>
                    <ListItemText primary={t('logout')} />
                  </ListItemButton>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* Account Details */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {t('accountInformation')}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {t('email')}: {user.email}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {t('username')}: {user.fullName || t('notSet')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {t('phone')}: {user.phone || t('notProvided')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {t('city')}: {getCityName(user.cityId)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Order History */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {t('recentOrders')}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => setShowAllOrders(!showAllOrders)}
                  >
                    {showAllOrders ? t('showLess') : t('viewAll')}
                  </Button>
                </Box>

                {loadingOrders ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : orders.length > 0 ? (
                  <Grid container spacing={2}>
                    {(showAllOrders ? orders : orders.slice(0, 3)).map((order) => (
                      <Grid item xs={12} key={order.id}>
                        <Paper
                          sx={{
                            p: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: theme.palette.grey[50] }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <ShoppingBagIcon color="primary" />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {t('order')} #{order.id} • {order.items?.length || 0} {t('items')}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" fontWeight="bold">
                              {formatPrice(order.totalPrice)}
                            </Typography>
                            <OrderStatusChip 
                              status={(() => {
                                const status = order.activeStatus?.toLowerCase();
                                switch(status) {
                                  case 'cancel':
                                    return 'cancelled';
                                  case 'complete':
                                    return 'delivered';
                                  case 'pending':
                                    return 'pending';
                                  case 'confirmed':
                                    return 'confirmed';
                                  case 'preparing':
                                    return 'preparing';
                                  default:
                                    return status;
                                }
                              })() as any}
                              size="small"
                            />
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <ShoppingBagIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {t('noOrdersYet')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {t('startOrderingFromFavoriteRestaurants')}
                    </Typography>
                    <Button variant="contained" onClick={() => navigate('/foodease/restaurants')}>
                      {t('browseRestaurants')}
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage; 