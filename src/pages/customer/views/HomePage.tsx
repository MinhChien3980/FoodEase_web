import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Avatar,
  Paper,
  InputBase,
  CircularProgress,
  Skeleton,
  Fade,
  Slide,
  Zoom,
  Grow,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import VerifiedIcon from "@mui/icons-material/Verified";
import RestaurantCard from "../../../components/restaurant/RestaurantCard";
import RatingBox from "../../../components/common/RatingBox";
import { formatPrice } from "../../../utils/foodHelpers";
import { Restaurant, restaurantService } from "../../../services/restaurantService";
import { Category, categoryService } from "../../../services/categoryService";

const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("New York, NY");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const { t } = useTranslation();

  // Fetch restaurants from API
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await restaurantService.getAllRestaurants();
      setAllRestaurants(data);
      setRestaurants(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch restaurants');
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(null);
      const data = await categoryService.getAllCategories();
      // Remove duplicates based on category name (since categories might be repeated across restaurants)
      const uniqueCategories = data.filter((category, index, self) => 
        index === self.findIndex(c => c.name === category.name)
      );
      setCategories(uniqueCategories);
    } catch (err) {
      setCategoriesError(err instanceof Error ? err.message : 'Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    // Filter restaurants based on search query
    const filtered = allRestaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.menuItems.some(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      )
    );
    setRestaurants(filtered);
  };

  useEffect(() => {
    fetchRestaurants();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setRestaurants(allRestaurants);
    } else {
      handleSearch(searchQuery);
    }
  }, [searchQuery, allRestaurants]);

  // Loading state
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        gap: 2,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`
      }}>
        <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
        <Typography variant="h6" color="text.secondary">
          {t('common.loading')}...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        gap: 2,
        textAlign: 'center',
        p: 4,
        background: `linear-gradient(135deg, ${theme.palette.error.main}10, ${theme.palette.warning.main}10)`
      }}>
        <Typography variant="h6" color="error">
          {t('common.error')}: {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={fetchRestaurants}
          startIcon={<RestaurantMenuIcon />}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          {t('common.retry')}
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: theme.palette.grey[50] }}>
      {/* Enhanced Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}ee, ${theme.palette.secondary.main}ee),
                     url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920') center/cover`,
          color: "white",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* Animated Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            animation: 'float 6s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-20px)' }
            }
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '60%',
            right: '15%',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            animation: 'float 8s ease-in-out infinite reverse',
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      fontWeight: 800,
                      fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                      mb: 2,
                      background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 4px 20px rgba(0,0,0,0.3)'
                    }}
                  >
                    {t("homePage.header.title")}
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 300, 
                      mb: 2,
                      opacity: 0.95,
                      fontSize: { xs: '1.5rem', md: '2rem' }
                    }}
                  >
                    {t("homePage.header.subtitle")}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 4, 
                      opacity: 0.9,
                      lineHeight: 1.6,
                      maxWidth: '90%'
                    }}
                  >
                    {t("homePage.header.description")}
                  </Typography>

                  {/* Enhanced Search Section */}
                  <Slide in direction="up" timeout={1200}>
                    <Card 
                      sx={{ 
                        p: 3, 
                        mb: 4,
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: 'wrap' }}>
                        <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 200 }}>
                          <LocationOnIcon 
                            sx={{ 
                              mr: 1,
                              color: theme.palette.primary.main,
                              fontSize: 28
                            }} 
                          />
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Delivering to
                            </Typography>
                            <Typography variant="body1" color="text.primary" sx={{ fontWeight: 600 }}>
                              {selectedLocation}
                            </Typography>
                          </Box>
                        </Box>
                        <TextField
                          placeholder={t("homePage.search.placeholder")}
                          variant="outlined"
                          fullWidth
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon sx={{ color: theme.palette.primary.main }} />
                              </InputAdornment>
                            ),
                            sx: {
                              borderRadius: 3,
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(0,0,0,0.1)',
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.primary.main,
                              }
                            }
                          }}
                          sx={{ flex: 2, minWidth: 250 }}
                        />
                      </Box>
                    </Card>
                  </Slide>

                  {/* Enhanced Stats */}
                  <Grow in timeout={1500}>
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Box textAlign="center">
                          <Box
                            sx={{
                              background: 'rgba(255,255,255,0.2)',
                              borderRadius: '50%',
                              width: 80,
                              height: 80,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mx: 'auto',
                              mb: 2,
                              backdropFilter: 'blur(10px)'
                            }}
                          >
                            <Typography variant="h4" fontWeight="bold">
                              {allRestaurants.length}+
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                            {t("homePage.stats.restaurants")}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box textAlign="center">
                          <Box
                            sx={{
                              background: 'rgba(255,255,255,0.2)',
                              borderRadius: '50%',
                              width: 80,
                              height: 80,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mx: 'auto',
                              mb: 2,
                              backdropFilter: 'blur(10px)'
                            }}
                          >
                            <Typography variant="h4" fontWeight="bold">
                              25min
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                            {t("homePage.stats.avgDelivery")}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box textAlign="center">
                          <Box
                            sx={{
                              background: 'rgba(255,255,255,0.2)',
                              borderRadius: '50%',
                              width: 80,
                              height: 80,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mx: 'auto',
                              mb: 2,
                              backdropFilter: 'blur(10px)'
                            }}
                          >
                            <Typography variant="h4" fontWeight="bold">
                              4.8★
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                            {t("homePage.stats.rating")}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grow>
                </Box>
              </Fade>
            </Grid>

            <Grid item xs={12} md={6}>
              <Zoom in timeout={1000}>
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600"
                    alt="Delicious Food"
                    sx={{
                      width: "100%",
                      maxWidth: 500,
                      height: "400px",
                      objectFit: "cover",
                      borderRadius: 6,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      transform: 'perspective(1000px) rotateY(-5deg)',
                      transition: 'transform 0.6s ease',
                      '&:hover': {
                        transform: 'perspective(1000px) rotateY(0deg) scale(1.02)'
                      }
                    }}
                  />
                  {/* Floating elements */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '10%',
                      right: '5%',
                      background: 'rgba(255,255,255,0.9)',
                      borderRadius: 3,
                      p: 2,
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      animation: 'bounce 2s infinite'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FlashOnIcon color="warning" />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        Fast Delivery
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: '15%',
                      left: '5%',
                      background: 'rgba(255,255,255,0.9)',
                      borderRadius: 3,
                      p: 2,
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      animation: 'bounce 2s infinite 1s'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VerifiedIcon color="success" />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        Quality Food
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Enhanced Food Categories */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Fade in timeout={800}>
          <Box textAlign="center" sx={{ mb: 6 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {t("homePage.browseByCategory.title")}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              {t("homePage.browseByCategory.description")}
            </Typography>
          </Box>
        </Fade>
        
        {categoriesError && (
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {t('common.error')}: {categoriesError}
            </Typography>
            <Button 
              variant="outlined" 
              size="small"
              onClick={fetchCategories}
              sx={{ borderRadius: 3 }}
            >
              {t('common.retry')}
            </Button>
          </Box>
        )}
        
        <Grid container spacing={3}>
          {categoriesLoading 
            ? Array.from({ length: 6 }).map((_, index) => (
                <Grid item xs={6} sm={4} md={2} key={index}>
                  <Card sx={{ p: 3, textAlign: "center", borderRadius: 4 }}>
                    <Skeleton variant="circular" width={60} height={60} sx={{ mx: 'auto', mb: 2 }} />
                    <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
                    <Skeleton variant="text" height={24} />
                  </Card>
                </Grid>
              ))
            : categories.map((category, index) => {
                // Get emoji based on category title or use a default one
                const getCategoryIcon = (name: string) => {
                  const lowerName = name.toLowerCase();
                  if (lowerName.includes('pizza')) return '🍕';
                  if (lowerName.includes('burger')) return '🍔';
                  if (lowerName.includes('sushi') || lowerName.includes('japanese')) return '🍣';
                  if (lowerName.includes('chinese')) return '🥡';
                  if (lowerName.includes('indian')) return '🍛';
                  if (lowerName.includes('mexican')) return '🌮';
                  if (lowerName.includes('italian')) return '🍝';
                  if (lowerName.includes('thai')) return '🍜';
                  if (lowerName.includes('korean')) return '🥘';
                  if (lowerName.includes('vietnamese')) return '🍲';
                  if (lowerName.includes('dessert') || lowerName.includes('sweet')) return '🍰';
                  if (lowerName.includes('drink') || lowerName.includes('beverage')) return '🥤';
                  if (lowerName.includes('khai vị') || lowerName.includes('appetizer')) return '🥗';
                  if (lowerName.includes('món chính') || lowerName.includes('main')) return '🍖';
                  if (lowerName.includes('tráng miệng') || lowerName.includes('dessert')) return '🍰';
                  // Default food icons rotation
                  const defaultIcons = ['🍴', '🥗', '🍖', '🍳', '🥙', '🌯'];
                  return defaultIcons[index % defaultIcons.length];
                };

                // Count restaurants that have items in this category
                const categoryRestaurantCount = allRestaurants.filter(restaurant =>
                  restaurant.menuItems.some(item => item.categoryId === category.id)
                ).length;

                return (
                  <Grid item xs={6} sm={4} md={2} key={category.id}>
                    <Grow in timeout={600 + index * 100}>
                      <Card
                        sx={{
                          p: 3,
                          textAlign: "center",
                          cursor: "pointer",
                          borderRadius: 4,
                          background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                          border: '1px solid',
                          borderColor: 'transparent',
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          position: 'relative',
                          overflow: 'hidden',
                          "&:hover": {
                            transform: "translateY(-8px) scale(1.02)",
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                            borderColor: theme.palette.primary.main,
                            '&::before': {
                              transform: 'translateX(0%)'
                            }
                          },
                          "&::before": {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}08, ${theme.palette.secondary.main}08)`,
                            transform: 'translateX(-100%)',
                            transition: 'transform 0.4s ease',
                            zIndex: 0
                          },
                          '& > *': {
                            position: 'relative',
                            zIndex: 1
                          }
                        }}
                        onClick={() => {
                          // Navigate to restaurants page with category filter
                          navigate("/foodease/restaurants", { 
                            state: { selectedCategory: category.name } 
                          });
                        }}
                      >
                        <Box
                          sx={{
                            width: 70,
                            height: 70,
                            borderRadius: '50%',
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2,
                            fontSize: '2rem',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {getCategoryIcon(category.name)}
                        </Box>
                        <Typography variant="h6" fontWeight="700" sx={{ mb: 1 }}>
                          {category.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {categoryRestaurantCount} places
                        </Typography>
                      </Card>
                    </Grow>
                  </Grid>
                );
              })
          }
        </Grid>

        {!categoriesLoading && !categoriesError && categories.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No categories available
            </Typography>
          </Box>
        )}
      </Container>

      {/* Enhanced Featured Restaurants */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Fade in timeout={1000}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {t("homePage.popularRestaurants.title")}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  {restaurants.length} restaurants found
                </Typography>
                <Chip 
                  icon={<TrendingUpIcon />} 
                  label="Popular" 
                  color="primary" 
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
            <Button 
              variant="contained"
              size="large"
              endIcon={<RestaurantMenuIcon />}
              onClick={() => navigate("/foodease/restaurants")}
              sx={{
                borderRadius: 4,
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
                }
              }}
            >
              {t("homePage.popularRestaurants.viewAll")}
            </Button>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          {restaurants.slice(0, 6).map((restaurant, index) => (
            <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
              <Grow in timeout={800 + index * 100}>
                <Box>
                  <RestaurantCard
                    restaurant={restaurant}
                    categories={categories}
                    onView={(id) => console.log("View restaurant:", id)}
                  />
                </Box>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {restaurants.length === 0 && !loading && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              {searchQuery ? t("homePage.popularRestaurants.noResults") : "No restaurants available"}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setSearchQuery("")}
              sx={{ 
                borderRadius: 3,
                px: 4,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              {t("homePage.popularRestaurants.clearSearch")}
            </Button>
          </Box>
        )}
      </Container>

      {/* Enhanced Features Section */}
      <Box sx={{ 
        background: `linear-gradient(135deg, ${theme.palette.grey[100]}, ${theme.palette.grey[50]})`,
        py: 8,
        position: 'relative'
      }}>
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box textAlign="center" sx={{ mb: 8 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {t("homePage.whyChooseFoodEase.title")}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                {t("homePage.whyChooseFoodEase.description")}
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={4}>
            {[
              {
                icon: <DeliveryDiningIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
                title: t("homePage.whyChooseFoodEase.fastDelivery.title"),
                description: t("homePage.whyChooseFoodEase.fastDelivery.description"),
                color: theme.palette.primary.main
              },
              {
                icon: <LocalOfferIcon sx={{ fontSize: 60, color: theme.palette.secondary.main }} />,
                title: t("homePage.whyChooseFoodEase.bestOffers.title"),
                description: t("homePage.whyChooseFoodEase.bestOffers.description"),
                color: theme.palette.secondary.main
              },
              {
                icon: <StarIcon sx={{ fontSize: 60, color: theme.palette.warning.main }} />,
                title: t("homePage.whyChooseFoodEase.qualityFood.title"),
                description: t("homePage.whyChooseFoodEase.qualityFood.description"),
                color: theme.palette.warning.main
              }
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Grow in timeout={1200 + index * 200}>
                  <Card 
                    sx={{ 
                      p: 4, 
                      textAlign: "center", 
                      height: "100%",
                      borderRadius: 4,
                      background: 'rgba(255,255,255,0.8)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transition: 'all 0.4s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        '&::before': {
                          transform: 'scale(1.2)'
                        }
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -50,
                        left: -50,
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: `${feature.color}10`,
                        transition: 'transform 0.4s ease',
                        transform: 'scale(0)'
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Box sx={{ mb: 3 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" fontWeight="700" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {feature.description}
                      </Typography>
                    </Box>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Enhanced Download App Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Fade in timeout={1200}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: "white",
              p: 6,
              borderRadius: 6,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
            }}
          >
            {/* Background pattern */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '50%',
                height: '100%',
                background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                opacity: 0.3
              }}
            />
            
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h3" fontWeight="800" gutterBottom>
                  {t("homePage.getTheFoodEaseApp.title")}
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}>
                  {t("homePage.getTheFoodEaseApp.description")}
                </Typography>
                <Box sx={{ display: "flex", gap: 3, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{ 
                      backgroundColor: "white", 
                      color: theme.palette.primary.main,
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 700,
                      "&:hover": { 
                        backgroundColor: theme.palette.grey[100],
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    {t("homePage.getTheFoodEaseApp.downloadForiOS")}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{ 
                      borderColor: "white", 
                      color: "white",
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 700,
                      borderWidth: 2,
                      "&:hover": { 
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderColor: "white",
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {t("homePage.getTheFoodEaseApp.downloadForAndroid")}
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300"
                    alt="Mobile App"
                    sx={{
                      width: "100%",
                      maxWidth: 280,
                      height: "auto",
                      borderRadius: 4,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      transform: 'perspective(800px) rotateY(-10deg)',
                      transition: 'transform 0.6s ease',
                      '&:hover': {
                        transform: 'perspective(800px) rotateY(0deg) scale(1.05)'
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default HomePage; 