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
import RestaurantCard from "../../../components/restaurant/RestaurantCard";
import RatingBox from "../../../components/common/RatingBox";
import { formatPrice } from "../../../utils/foodHelpers";
import { Restaurant, restaurantService } from "../../../services/restaurantService";
import { categoryService } from "../../../services/categoryService";
import { ICategory } from "../../../interfaces";
import { favoriteService } from "../../../services/favoriteService";

const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("New York, NY");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState<Set<number>>(new Set());
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

  const fetchFavorites = async () => {
    try {
      const favorites = await favoriteService.getFavorites();
      const favoriteIds = new Set(favorites.restaurants.map(r => r.id));
      setFavoriteRestaurantIds(favoriteIds);
    } catch (error) {
      console.error("Failed to fetch favorites", error);
      // Handle error gracefully, maybe show a toast
    }
  };

  const handleToggleFavorite = async (restaurantId: number) => {
    const isCurrentlyFavorite = favoriteRestaurantIds.has(restaurantId);

    // Optimistically update UI
    const newFavoriteIds = new Set(favoriteRestaurantIds);
    if (isCurrentlyFavorite) {
      newFavoriteIds.delete(restaurantId);
    } else {
      newFavoriteIds.add(restaurantId);
    }
    setFavoriteRestaurantIds(newFavoriteIds);

    try {
      await favoriteService.toggleFavorite({
        favoritableId: restaurantId,
        favoritableType: 'restaurant',
      });
    } catch (error) {
      console.error("Failed to toggle favorite", error);
      // Revert UI change on error
      setFavoriteRestaurantIds(favoriteRestaurantIds);
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
    fetchFavorites();
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
        gap: 2
      }}>
        <CircularProgress size={60} />
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
        p: 4
      }}>
        <Typography variant="h6" color="error">
          {t('common.error')}: {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={fetchRestaurants}
          startIcon={<RestaurantMenuIcon />}
        >
          {t('common.retry')}
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: theme.palette.grey[50] }}>
      {/* Header Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: "white",
          py: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" fontWeight="bold" gutterBottom>
                {t("homePage.header.title")}
              </Typography>
              <Typography variant="h4" fontWeight="300" gutterBottom>
                {t("homePage.header.subtitle")}
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                {t("homePage.header.description")}
              </Typography>

              {/* Search Section */}
              <Card sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <LocationOnIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {selectedLocation}
                    </Typography>
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
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ flex: 2 }}
                  />
                </Box>
              </Card>

              {/* Stats */}
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold">
                      {allRestaurants.length}+
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {t("homePage.stats.restaurants")}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold">
                      25min
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {t("homePage.stats.avgDelivery")}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold">
                      4.8★
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {t("homePage.stats.rating")}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600"
                alt="Delicious Food"
                sx={{
                  width: "100%",
                  height: "400px",
                  objectFit: "cover",
                  borderRadius: 4,
                  boxShadow: theme.shadows[10],
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Food Categories */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {t("homePage.browseByCategory.title")}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {t("homePage.browseByCategory.description")}
        </Typography>
        
        {categoriesError && (
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {t('common.error')}: {categoriesError}
            </Typography>
            <Button 
              variant="outlined" 
              size="small"
              onClick={fetchCategories}
            >
              {t('common.retry')}
            </Button>
          </Box>
        )}
        
        <Grid container spacing={3}>
          {categoriesLoading 
            ? Array.from({ length: 6 }).map((_, index) => (
                <Grid item xs={6} sm={4} md={2} key={index}>
                  <Card sx={{ p: 2, textAlign: "center" }}>
                    <Skeleton variant="text" height={60} sx={{ mb: 1 }} />
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
                    <Card
                      sx={{
                        p: 2,
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: theme.shadows[8],
                        },
                      }}
                      onClick={() => {
                        // Navigate to restaurants page with category filter
                        navigate("/foodease/restaurants", { 
                          state: { selectedCategory: category.name } 
                        });
                      }}
                    >
                      <Typography variant="h3" sx={{ mb: 1 }}>
                        {getCategoryIcon(category.name)}
                      </Typography>
                      <Typography variant="h6" fontWeight="600"  sx={{ minHeight: '2.5em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {category.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {categoryRestaurantCount} places
                      </Typography>
                    </Card>
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

      {/* Featured Restaurants */}
      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {t("homePage.popularRestaurants.title")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {restaurants.length} restaurants found
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            endIcon={<RestaurantMenuIcon />}
            onClick={() => navigate("/foodease/restaurants")}
          >
            {t("homePage.popularRestaurants.viewAll")}
          </Button>
        </Box>

        <Grid container spacing={3}>
          {restaurants.map((restaurant) => (
            <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
              <RestaurantCard
                restaurant={restaurant}
                onView={(id) => navigate(`/foodease/restaurants/${id}`)}
                isFavorite={favoriteRestaurantIds.has(restaurant.id)}
                onToggleFavorite={handleToggleFavorite}
                categories={categories}
              />
            </Grid>
          ))}
        </Grid>

        {restaurants.length === 0 && !loading && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              {searchQuery ? t("homePage.popularRestaurants.noResults") : "No restaurants available"}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setSearchQuery("")}
              sx={{ mt: 2 }}
            >
              {t("homePage.popularRestaurants.clearSearch")}
            </Button>
          </Box>
        )}
      </Container>

      {/* Features Section */}
      <Box sx={{ backgroundColor: theme.palette.grey[100], py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
            {t("homePage.whyChooseFoodEase.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
            {t("homePage.whyChooseFoodEase.description")}
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 4, textAlign: "center", height: "100%" }}>
                <DeliveryDiningIcon 
                  sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} 
                />
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  {t("homePage.whyChooseFoodEase.fastDelivery.title")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("homePage.whyChooseFoodEase.fastDelivery.description")}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 4, textAlign: "center", height: "100%" }}>
                <LocalOfferIcon 
                  sx={{ fontSize: 60, color: theme.palette.secondary.main, mb: 2 }} 
                />
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  {t("homePage.whyChooseFoodEase.bestOffers.title")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("homePage.whyChooseFoodEase.bestOffers.description")}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 4, textAlign: "center", height: "100%" }}>
                <StarIcon 
                  sx={{ fontSize: 60, color: theme.palette.warning.main, mb: 2 }} 
                />
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  {t("homePage.whyChooseFoodEase.qualityFood.title")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("homePage.whyChooseFoodEase.qualityFood.description")}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Download App Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Card
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            color: "white",
            p: 6,
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {t("homePage.getTheFoodEaseApp.title")}
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                {t("homePage.getTheFoodEaseApp.description")}
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  sx={{ 
                    backgroundColor: "white", 
                    color: theme.palette.primary.main,
                    "&:hover": { backgroundColor: theme.palette.grey[100] }
                  }}
                >
                  {t("homePage.getTheFoodEaseApp.downloadForiOS")}
                </Button>
                <Button
                  variant="outlined"
                  sx={{ 
                    borderColor: "white", 
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" }
                  }}
                >
                  {t("homePage.getTheFoodEaseApp.downloadForAndroid")}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300"
                alt="Mobile App"
                sx={{
                  width: "100%",
                  maxWidth: 250,
                  height: "auto",
                  borderRadius: 2,
                }}
              />
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Box>
  );
};

export default HomePage; 