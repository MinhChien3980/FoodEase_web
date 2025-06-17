import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  FormControlLabel,
  Checkbox,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { cityService } from "../../../services/cityService";
import { authService } from "../../../services/authService";
import { handleApiError } from "../../../services/apiClient";

interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  cityId: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  subscribeNewsletter: boolean;
}

interface City {
  id: number;
  name: string;
}

const CustomerRegister: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    phone: "",
    cityId: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: true,
  });
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const cities = await cityService.getAllCities();
        setCities(cities);
      } catch (error) {
        console.error('Failed to fetch cities:', error);
        setError(t('auth.failedToLoadCities') || 'Failed to load cities. Please refresh the page.');
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [t]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user selects
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(\+84|84|0)?[1-9][0-9]{8,9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = t('auth.validation.fullNameRequired') || 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = t('auth.validation.fullNameTooShort') || 'Full name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      errors.email = t('auth.validation.emailRequired') || 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = t('auth.validation.emailInvalid') || 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = t('auth.validation.phoneRequired') || 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      errors.phone = t('auth.validation.phoneInvalid') || 'Please enter a valid Vietnamese phone number';
    }
    
    if (!formData.cityId) {
      errors.cityId = t('auth.validation.cityRequired') || 'Please select a city';
    }
    
    if (!formData.password) {
      errors.password = t('auth.validation.passwordRequired') || 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = t('auth.validation.passwordTooShort') || 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = t('auth.validation.confirmPasswordRequired') || 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('auth.validation.passwordsDoNotMatch') || 'Passwords do not match';
    }
    
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = t('auth.validation.agreeToTermsRequired') || 'You must agree to the Terms and Conditions';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        cityId: parseInt(formData.cityId),
        langKey: "vi"
      });

      // Handle successful registration
      if (response && (response.code === 201 || response.code === 200)) {
        // Registration successful - redirect to login with success message
        navigate('/foodease/login', { 
          state: { 
            message: t('auth.accountCreatedSuccessfully') || 'Account created successfully! Please sign in.',
            email: formData.email
          }
        });
      } else {
        // Handle unexpected response format
        setError(t('auth.registrationFailed') || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      
      if (err.response?.data?.code === 1004) {
        setError(t('auth.emailAlreadyExists') || 'An account with this email already exists.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 400) {
        setError(t('auth.invalidRegistrationData') || 'Invalid registration data. Please check your information.');
      } else {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Register with ${provider}`);
  };

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
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: theme.shadows[20],
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <RestaurantMenuIcon 
              sx={{ 
                fontSize: 48, 
                color: theme.palette.primary.main, 
                mb: 2 
              }} 
            />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {t('auth.joinFoodEase') || t('joinFoodEase')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('auth.createYourAccountToStartOrdering') || t('createYourAccountToStartOrdering')}
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Registration Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('auth.fullName') || t('fullName')}
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              error={!!fieldErrors.fullName}
              helperText={fieldErrors.fullName}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label={t('auth.email') || t('email')}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label={t('auth.phoneNumber') || t('phoneNumber')}
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
              error={!!fieldErrors.phone}
              helperText={fieldErrors.phone}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* City Selection */}
            <FormControl fullWidth sx={{ mb: 3 }} error={!!fieldErrors.cityId}>
              <InputLabel>{t('auth.city') || t('city')}</InputLabel>
              <Select
                name="cityId"
                value={formData.cityId}
                onChange={handleSelectChange}
                label={t('auth.city') || t('city')}
                required
                startAdornment={
                  <InputAdornment position="start">
                    <LocationCityIcon color="action" sx={{ ml: 1 }} />
                  </InputAdornment>
                }
              >
                {loadingCities ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    {t('auth.loadingCities') || t('loadingCities')}
                  </MenuItem>
                ) : (
                  cities.map((city) => (
                    <MenuItem key={city.id} value={city.id.toString()}>
                      {city.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              {fieldErrors.cityId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {fieldErrors.cityId}
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              label={t('auth.password') || t('password')}
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              required
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label={t('auth.confirmPassword') || t('confirmPassword')}
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              error={!!fieldErrors.confirmPassword}
              helperText={fieldErrors.confirmPassword}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Terms and Newsletter */}
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    required
                  />
                }
                label={
                  <Typography variant="body2">
                    {t('auth.agreeToTerms') || t('agreeToTerms')}
                  </Typography>
                }
              />
              {fieldErrors.agreeToTerms && (
                <Typography variant="caption" color="error" sx={{ display: 'block', ml: 4 }}>
                  {fieldErrors.agreeToTerms}
                </Typography>
              )}
              
              <FormControlLabel
                control={
                  <Checkbox
                    name="subscribeNewsletter"
                    checked={formData.subscribeNewsletter}
                    onChange={handleInputChange}
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.subscribeNewsletter') || t('subscribeNewsletter')}
                  </Typography>
                }
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || loadingCities}
              sx={{ 
                mb: 3, 
                py: 1.5,
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1.1rem"
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                  {t('auth.creatingAccount') || t('creatingAccount')}
                </>
              ) : (
                t('auth.createAccount') || t('createAccount')
              )}
            </Button>
          </Box>

          {/* Divider */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {t('auth.orSignUpWith') || t('orSignUpWith')}
            </Typography>
          </Divider>

          {/* Social Registration */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={() => handleSocialLogin('google')}
              sx={{ py: 1.5 }}
              disabled={loading}
            >
              Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FacebookIcon />}
              onClick={() => handleSocialLogin('facebook')}
              sx={{ py: 1.5 }}
              disabled={loading}
            >
              Facebook
            </Button>
          </Box>

          {/* Sign In Link */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {t('auth.alreadyHaveAnAccount') || t('alreadyHaveAnAccount')}{' '}
              <Link
                component={RouterLink}
                to="/foodease/login"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: "bold",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" }
                }}
              >
                {t('auth.signInHere') || t('signInHere')}
              </Link>
            </Typography>
          </Box>

          {/* Back to Browse */}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Link
              component={RouterLink}
              to="/foodease"
              sx={{
                color: theme.palette.text.secondary,
                textDecoration: "none",
                fontSize: "0.9rem",
                "&:hover": { textDecoration: "underline" }
              }}
            >
              {t('auth.continueBrowsingWithoutSigningUp') || t('continueBrowsingWithoutSigningUp')}
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CustomerRegister; 