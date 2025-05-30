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
import OrderStatusChip from "../../components/order/OrderStatusChip";
import { formatPrice } from "../../utils/foodHelpers";

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

interface Order {
  id: string;
  date: string;
  status: string;
  restaurant: string;
  items: number;
  total: number;
}

const mockOrders: Order[] = [
  {
    id: "ORD-2024-001",
    date: "2024-01-30",
    status: "delivered",
    restaurant: "Pizza Palace",
    items: 3,
    total: 28.99
  },
  {
    id: "ORD-2024-002", 
    date: "2024-01-28",
    status: "delivered",
    restaurant: "Sushi Express",
    items: 2,
    total: 45.50
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-25",
    status: "cancelled",
    restaurant: "Burger King",
    items: 1,
    total: 12.99
  }
];

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

  const fetchCities = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/cities/all', {
        method: 'GET',
        headers: {
          'accept': '*/*'
        }
      });

      const data = await response.json();

      if (response.ok && data.code === 200) {
        setCities(data.data || []);
      } else {
        console.error('Failed to fetch cities:', data);
        // Fallback cities
        setCities([
          { id: 1, name: 'Hà Nội' },
          { id: 2, name: 'Hồ Chí Minh' },
          { id: 3, name: 'Đà Nẵng' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      // Fallback cities
      setCities([
        { id: 1, name: 'Hà Nội' },
        { id: 2, name: 'Hồ Chí Minh' },
        { id: 3, name: 'Đà Nẵng' }
      ]);
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

      const response = await fetch('http://localhost:8080/api/users/profile', {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.code === 200) {
        setUser(data.data);
        setEditedUser(data.data);
        // Update sessionStorage with fresh data
        sessionStorage.setItem('customer_user', JSON.stringify(data.data));
      } else {
        setError('Failed to load profile data');
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
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Network error. Unable to load profile.');
      
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

  const handleLogout = () => {
    sessionStorage.removeItem('customer_token');
    sessionStorage.removeItem('customer_user');
    navigate('/foodease');
  };

  const handleEditToggle = async () => {
    if (editMode) {
      // Save changes
      const token = sessionStorage.getItem('customer_token');
      if (!token) return;

      try {
        // Here you would call your update profile API
        // For now, we'll just update sessionStorage
        const updatedUser = { ...user, ...editedUser } as CustomerUser;
        setUser(updatedUser);
        sessionStorage.setItem('customer_user', JSON.stringify(updatedUser));
        setUpdateMessage(t('profileUpdatedSuccessfully'));
        setTimeout(() => setUpdateMessage(null), 3000);
      } catch (error) {
        console.error('Error updating profile:', error);
        setError(t('failedToUpdateProfile'));
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

  const formatJoinDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    } catch {
      return 'Recently';
    }
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
                  
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', my: 2 }}>
                    <Chip
                      label={`${t('memberSince')} ${formatJoinDate(user.createdAt)}`}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      label={user.activated ? t('verified') : t('unverified')}
                      color={user.activated ? "success" : "warning"}
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      icon={<LanguageIcon />}
                      label={user.langKey?.toUpperCase() || 'EN'}
                      variant="outlined"
                      size="small"
                    />
                  </Box>

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
                  <ListItemButton>
                    <ListItemIcon>
                      <FavoriteIcon color="error" />
                    </ListItemIcon>
                    <ListItemText primary={t('myFavorites')} />
                  </ListItemButton>
                  <ListItemButton>
                    <ListItemIcon>
                      <PaymentIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={t('paymentMethods')} />
                  </ListItemButton>
                  <ListItemButton>
                    <ListItemIcon>
                      <LocationOnIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={t('deliveryAddresses')} />
                  </ListItemButton>
                  <ListItemButton>
                    <ListItemIcon>
                      <NotificationsIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText primary={t('notifications')} />
                  </ListItemButton>
                  <ListItemButton>
                    <ListItemIcon>
                      <SecurityIcon color="info" />
                    </ListItemIcon>
                    <ListItemText primary={t('privacySecurity')} />
                  </ListItemButton>
                  <Divider sx={{ my: 1 }} />
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
                  <Button variant="outlined" size="small">
                    {t('viewAll')}
                  </Button>
                </Box>

                {mockOrders.length > 0 ? (
                  <Grid container spacing={2}>
                    {mockOrders.map((order) => (
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
                              <Typography variant="subtitle1" fontWeight="600">
                                {order.restaurant}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {t('order')} #{order.id} • {order.items} {t('items')}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(order.date).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" fontWeight="bold">
                              {formatPrice(order.total)}
                            </Typography>
                            <OrderStatusChip 
                              status={order.status as any}
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

            {/* Account Stats */}
            <Grid container spacing={3}>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {mockOrders.filter(o => o.status === 'delivered').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('ordersCompleted')}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {formatPrice(mockOrders.reduce((sum, order) => 
                      order.status === 'delivered' ? sum + order.total : sum, 0
                    ))}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('totalSpent')}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('favoriteRestaurants')}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {user.activated ? '✓' : '✗'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('accountStatus')}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage; 