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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router";
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

// Mock data - replace with real API calls
const mockRestaurants = [
  {
    id: "1",
    name: "Pizza Palace",
    slug: "pizza-palace",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    rating: 4.5,
    reviewCount: 128,
    cuisineType: ["Italian", "Pizza"],
    address: "123 Main St, Downtown",
    preparationTime: 25,
    deliveryFee: 2.99,
    minimumOrder: 15.00,
    openTime: "10:00",
    closeTime: "23:00",
    isActive: true,
    isVerified: true,
    totalOrders: 1250,
    latitude: 40.7128,
    longitude: -74.0060
  },
  {
    id: "2",
    name: "Burger King",
    slug: "burger-king",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
    rating: 4.2,
    reviewCount: 89,
    cuisineType: ["American", "Fast Food"],
    address: "456 Oak Ave, Midtown",
    preparationTime: 15,
    deliveryFee: 1.99,
    minimumOrder: 10.00,
    openTime: "09:00",
    closeTime: "22:00",
    isActive: true,
    isVerified: true,
    totalOrders: 890,
    latitude: 40.7589,
    longitude: -73.9851
  },
  {
    id: "3",
    name: "Sushi Express",
    slug: "sushi-express",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    rating: 4.8,
    reviewCount: 267,
    cuisineType: ["Japanese", "Sushi"],
    address: "789 Pine St, Uptown",
    preparationTime: 35,
    deliveryFee: 3.99,
    minimumOrder: 20.00,
    openTime: "11:00",
    closeTime: "22:30",
    isActive: true,
    isVerified: true,
    totalOrders: 2100,
    latitude: 40.7831,
    longitude: -73.9712
  }
];

const mockFoodCategories = [
  { id: "1", name: "Pizza", icon: "🍕", count: 24 },
  { id: "2", name: "Burgers", icon: "🍔", count: 18 },
  { id: "3", name: "Sushi", icon: "🍣", count: 12 },
  { id: "4", name: "Chinese", icon: "🥡", count: 15 },
  { id: "5", name: "Indian", icon: "🍛", count: 20 },
  { id: "6", name: "Mexican", icon: "🌮", count: 16 }
];

const HomePage: React.FC = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("New York, NY");
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const { t } = useTranslation();

  const handleSearch = (query: string) => {
    // Filter restaurants based on search query
    const filtered = mockRestaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.cuisineType.some(cuisine => 
        cuisine.toLowerCase().includes(query.toLowerCase())
      )
    );
    setRestaurants(filtered);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setRestaurants(mockRestaurants);
    } else {
      handleSearch(searchQuery);
    }
  }, [searchQuery]);

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
                      500+
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
        
        <Grid container spacing={3}>
          {mockFoodCategories.map((category) => (
            <Grid item xs={6} sm={4} md={2} key={category.id}>
              <Card
                sx={{
                  p: 2,
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Typography variant="h3" sx={{ mb: 1 }}>
                  {category.icon}
                </Typography>
                <Typography variant="h6" fontWeight="600">
                  {category.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.count} places
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
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
          <Button variant="outlined" endIcon={<RestaurantMenuIcon />}>
            {t("homePage.popularRestaurants.viewAll")}
          </Button>
        </Box>

        <Grid container spacing={3}>
          {restaurants.map((restaurant) => (
            <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
              <RestaurantCard
                restaurant={restaurant}
                onView={(id) => console.log("View restaurant:", id)}
                onEdit={(id) => console.log("Edit restaurant:", id)}
              />
            </Grid>
          ))}
        </Grid>

        {restaurants.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              {t("homePage.popularRestaurants.noResults")}
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