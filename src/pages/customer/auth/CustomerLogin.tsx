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
  useTheme,
} from "@mui/material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { setCustomerSession, getAuthHeaders, autoLoginIfTokenExists } from "../../../utils/sessionManager";

interface LoginFormData {
  email: string;
  password: string;
}

const CustomerLogin: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    // Check for existing valid session on component mount
    const checkExistingSession = async () => {
      setCheckingSession(true);
      try {
        const result = await autoLoginIfTokenExists();
        if (result.success) {
          // User has valid token, redirect to profile
          navigate('/foodease/profile');
          return;
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setCheckingSession(false);
      }
    };

    checkExistingSession();

    // Check for success message from registration
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Pre-fill email if provided
      if (location.state?.email) {
        setFormData(prev => ({ ...prev, email: location.state.email }));
      }
    }
  }, [location.state, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      console.log('Attempting login with:', { email: formData.email });
      
      // Call your actual login API
      const response = await fetch('http://localhost:8080/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      let data;
      try {
        // Check if response has content and is JSON
        const contentType = response.headers.get('content-type');
        console.log('Content-Type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
          const responseText = await response.text();
          console.log('Response text:', responseText);
          
          if (responseText.trim()) {
            data = JSON.parse(responseText);
          } else {
            data = { authenticated: false, message: 'Empty response from server' };
          }
        } else {
          // Non-JSON response
          const responseText = await response.text();
          console.log('Non-JSON response:', responseText);
          data = { authenticated: false, message: 'Invalid response format from server' };
        }
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        data = { authenticated: false, message: 'Failed to parse server response' };
      }

      console.log('Parsed login data:', data);

      // Check for the correct response structure based on your API
      if (response.ok && data.code === 200 && data.data && data.data.authenticated) {
        console.log('Login successful, fetching profile...');
        
        // Fetch user profile data after successful login
        try {
          const profileResponse = await fetch('http://localhost:8080/api/users/profile', {
            method: 'GET',
            headers: {
              'accept': '*/*',
              'Authorization': `Bearer ${data.data.token}`
            }
          });

          console.log('Profile response status:', profileResponse.status);

          let profileData;
          try {
            const profileText = await profileResponse.text();
            console.log('Profile response text:', profileText);
            
            if (profileText.trim()) {
              profileData = JSON.parse(profileText);
            } else {
              profileData = { code: 404, message: 'Empty profile response' };
            }
          } catch (profileParseError) {
            console.error('Profile JSON parsing error:', profileParseError);
            profileData = { code: 404, message: 'Failed to parse profile response' };
          }
          
          console.log('Parsed profile data:', profileData);
          
          if (profileResponse.ok && profileData.code === 200) {
            // Store complete user profile in session
            setCustomerSession(data.data.token, profileData.data);
            console.log('Stored user session successfully');
          } else {
            // Fallback user data if profile fetch fails
            const fallbackUser = {
              email: formData.email,
              fullName: formData.email.split('@')[0],
              id: 'customer'
            };
            setCustomerSession(data.data.token, fallbackUser);
            console.log('Stored fallback user session');
          }
        } catch (profileError) {
          console.error('Failed to fetch profile:', profileError);
          // Fallback user data
          const fallbackUser = {
            email: formData.email,
            fullName: formData.email.split('@')[0],
            id: 'customer'
          };
          setCustomerSession(data.data.token, fallbackUser);
          console.log('Stored fallback user session after error');
        }
        
        // Redirect to customer profile or previous page
        const returnPath = location.state?.from || '/foodease/profile';
        console.log('Redirecting to:', returnPath);
        navigate(returnPath);
      } else {
        console.log('Login failed:', { status: response.status, data });
        setError(data.message || `Login failed. Status: ${response.status}`);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Implement social login here
    console.log(`Login with ${provider}`);
  };

  // Show loading while checking existing session
  if (checkingSession) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            minWidth: 300,
          }}
        >
          <RestaurantMenuIcon 
            sx={{ 
              fontSize: 48, 
              color: theme.palette.primary.main, 
              mb: 2 
            }} 
          />
          <Typography variant="h6" gutterBottom>
            {t('checkingSession')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              border: '2px solid #f3f3f3',
              borderTop: '2px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          </Box>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </Paper>
      </Box>
    );
  }

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
              {t('welcomeBack')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('signInToYourFoodEaseAccount')}
            </Typography>
          </Box>

          {/* Success Alert */}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('email')}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
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
              label={t('password')}
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              required
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mb: 3, 
                py: 1.5,
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1.1rem"
              }}
            >
              {loading ? t('signingIn') : t('signIn')}
            </Button>
          </Box>

          {/* Forgot Password */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Link 
              component={RouterLink} 
              to="/foodease/forgot-password"
              sx={{ 
                color: theme.palette.primary.main,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" }
              }}
            >
              {t('forgotYourPassword')}
            </Link>
          </Box>

          {/* Divider */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {t('orContinueWith')}
            </Typography>
          </Divider>

          {/* Social Login */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={() => handleSocialLogin('google')}
              sx={{ py: 1.5 }}
            >
              Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FacebookIcon />}
              onClick={() => handleSocialLogin('facebook')}
              sx={{ py: 1.5 }}
            >
              Facebook
            </Button>
          </Box>

          {/* Sign Up Link */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {t('dontHaveAnAccount')}
              {" "}
              <Link
                component={RouterLink}
                to="/foodease/register"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: "bold",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" }
                }}
              >
                {t('signUpHere')}
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
              {t('continueBrowsingWithoutSigningIn')}
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CustomerLogin; 