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
import { setCustomerSession, setCustomerToken, getAuthHeaders, autoLoginIfTokenExists } from "../../../utils/sessionManager";
import { authService } from "../../../services";
import { userService } from "../../../services/userService";

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
    const checkExistingSession = async () => {
      setCheckingSession(true);
      try {
        const result = await autoLoginIfTokenExists();
        if (result.success) {
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

    if (location.state?.message) {
      setSuccessMessage(location.state.message);
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
      const response = await authService.login({ email: formData.email, password: formData.password });

      if (response.code === 200 && response.data && response.data.authenticated) {
        
        try {
          setCustomerToken(response.data.token);
          
          const profileData = await userService.getProfile();
          
          if (profileData.code === 200) {
            setCustomerSession(response.data.token, profileData.data);
          } else {
            const fallbackUser = {
              email: formData.email,
              fullName: formData.email.split('@')[0],
              id: 'customer'
            };
            setCustomerSession(response.data.token, fallbackUser);
          }
        } catch (profileError) {
          console.error('Failed to fetch profile:', profileError);
          const fallbackUser = {
            email: formData.email,
            fullName: formData.email.split('@')[0],
            id: 'customer'
          };
          setCustomerSession(response.data.token, fallbackUser);
        }
        
        const returnPath = location.state?.from || '/foodease/profile';
        navigate(returnPath);
      } else {
        setError(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
  };

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