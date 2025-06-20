import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  IconButton,
  Rating,
  Tab,
  Tabs,
  Paper,
  TextField,
  InputAdornment,
  Fab,
  Badge,
  CircularProgress,
  Alert,
  CardActions,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import { restaurantService, categoryService } from "../../../services";
import type { Restaurant, MenuItem } from "../../../services/restaurantService";
import type { Category } from "../../../services/categoryService";
import { useCart } from "../../../contexts/CartContext";
import { isCustomerAuthenticated } from "../../../utils/sessionManager";

const RestaurantDetailPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { cart, addToCart, getItemQuantity } = useCart();

  // State management
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication
  useEffect(() => {
    setIsAuthenticated(isCustomerAuthenticated());
  }, []);

  // Fetch data
  useEffect(() => {
    if (id) {
      fetchRestaurantData();
    }
  }, [id]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [restaurantData, menuItemsData, categoriesData] = await Promise.all([
        restaurantService.getRestaurantById(Number(id)),
        restaurantService.getMenuItemsByRestaurantId(Number(id)),
        categoryService.getAllCategories()
      ]);
      
      setRestaurant(restaurantData);
      setMenuItems(menuItemsData);
      setFilteredMenuItems(menuItemsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch restaurant data');
      console.error('Error fetching restaurant data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter menu items
  useEffect(() => {
    let filtered = [...menuItems];

    // Category filter
    if (selectedCategory !== "all") {
      const categoryId = parseInt(selectedCategory);
      filtered = filtered.filter(item => item.categoryId === categoryId);
    }

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMenuItems(filtered);
  }, [menuItems, selectedCategory, searchQuery]);

  // Get category name by ID
  const getCategoryNameById = (categoryId: number): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : `Category ${categoryId}`;
  };

  // Get unique categories from menu items
  const getMenuCategories = () => {
    const categoryIds = [...new Set(menuItems.map(item => item.categoryId))];
    return categoryIds.map(id => ({
      id,
      name: getCategoryNameById(id)
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (item: MenuItem) => {
    if (!isAuthenticated) {
      // Navigate to login if not authenticated
      navigate('/foodease/login');
      return;
    }

    const cartItem = {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      categoryId: item.categoryId,
      restaurantId: item.restaurantId,
      restaurantName: restaurant?.name || 'Unknown Restaurant',
    };

    addToCart(cartItem);
  };

  const handleToggleFavorite = (itemId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });
  };

  const getDiscountPercentage = (item: MenuItem) => {
    // Generate random discount for demo purposes
    const discounts = [0, 10, 25, 60];
    const hash = item.id.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return discounts[hash % discounts.length];
  };

  const getRandomRating = (item: MenuItem) => {
    // Generate consistent rating based on item ID
    const hash = item.id.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 3 + (hash % 20) / 10; // Rating between 3.0 and 5.0
  };

  const isVegetarian = (item: MenuItem) => {
    // Simple logic to determine if item is vegetarian based on name
    const vegKeywords = ['veg', 'paneer', 'mushroom', 'cheese', 'salad', 'pizza'];
    return vegKeywords.some(keyword => item.name.toLowerCase().includes(keyword));
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/foodease/restaurants')}>
          Back to Restaurants
        </Button>
      </Container>
    );
  }

  if (!restaurant) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="warning">Restaurant not found</Alert>
      </Container>
    );
  }

  const menuCategories = getMenuCategories();

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: 300,
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=300&fit=crop')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "flex-end",
          color: "white",
        }}
      >
        <Container maxWidth="xl" sx={{ pb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton
              onClick={() => navigate('/foodease/restaurants')}
              sx={{ color: "white", mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Chip
              label="Open Now"
              sx={{
                backgroundColor: "#2ed573",
                color: "white",
                fontWeight: 600,
              }}
            />
          </Box>
          
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            {restaurant.name}
          </Typography>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 18 }} />
              <Typography variant="body1">10 min</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <StarIcon sx={{ fontSize: 18, color: "#ffa726" }} />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>4.00</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 18 }} />
              <Typography variant="body1">{restaurant.address}</Typography>
            </Box>
          </Box>
        </Container>

        {/* Restaurant Image */}
        <Box
          sx={{
            position: "absolute",
            bottom: -50,
            right: 40,
            width: 200,
            height: 120,
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: theme.shadows[8],
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=120&fit=crop"
            alt={restaurant.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4, mt: 6 }}>
        {/* Search and Filters */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button
                  variant={viewMode === "grid" ? "contained" : "outlined"}
                  onClick={() => setViewMode("grid")}
                  startIcon={<GridViewIcon />}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "contained" : "outlined"}
                  onClick={() => setViewMode("list")}
                  startIcon={<ViewListIcon />}
                >
                  List
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Category Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={selectedCategory}
            onChange={(_, newValue) => setSelectedCategory(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                minWidth: "auto",
                px: 3,
              },
            }}
          >
            <Tab label="All" value="all" />
            {menuCategories.map((category) => (
              <Tab
                key={category.id}
                label={category.name}
                value={category.id.toString()}
              />
            ))}
          </Tabs>
        </Box>

        {/* Menu Items Grid */}
        {filteredMenuItems.length > 0 ? (
          <Grid container spacing={3}>
            {filteredMenuItems.map((item) => {
              const discount = getDiscountPercentage(item);
              const rating = getRandomRating(item);
              const isVeg = isVegetarian(item);
              const quantity = getItemQuantity(item.id);

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <Card
                    sx={{
                      height: "100%",
                      position: "relative",
                      borderRadius: 2,
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    {/* Image */}
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop'}
                        alt={item.name}
                        sx={{ objectFit: "cover" }}
                      />

                      {/* Veg/Non-veg Indicator */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          width: 24,
                          height: 24,
                          borderRadius: "4px",
                          backgroundColor: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: isVeg ? "#2ed573" : "#ff4757",
                          }}
                        />
                      </Box>

                      {/* Favorite Button */}
                      <IconButton
                        onClick={() => handleToggleFavorite(item.id)}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          "&:hover": {
                            backgroundColor: "white",
                          },
                          width: 36,
                          height: 36,
                        }}
                      >
                        {favorites.has(item.id) ? (
                          <FavoriteIcon sx={{ color: "#ff4757", fontSize: 20 }} />
                        ) : (
                          <FavoriteBorderIcon sx={{ fontSize: 20 }} />
                        )}
                      </IconButton>

                      {/* Discount Badge */}
                      {discount > 0 && (
                        <Chip
                          label={`${discount}% OFF`}
                          size="small"
                          sx={{
                            position: "absolute",
                            bottom: 12,
                            left: 12,
                            backgroundColor: "#ff4757",
                            color: "white",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}
                        />
                      )}
                    </Box>

                    {/* Content */}
                    <CardContent sx={{ p: 2, pb: 1 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 600,
                          fontSize: "1rem",
                          lineHeight: 1.3,
                          mb: 0.5,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          fontSize: "0.875rem",
                          lineHeight: 1.3,
                        }}
                      >
                        {item.description}
                      </Typography>

                      {/* Rating */}
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Rating
                          value={rating}
                          precision={0.1}
                          readOnly
                          size="small"
                          sx={{
                            "& .MuiRating-iconFilled": {
                              color: "#ffa726",
                            },
                            mr: 0.5,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary", fontSize: "0.75rem" }}
                        >
                          ({rating.toFixed(1)})
                        </Typography>
                      </Box>

                      {/* Price */}
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                          {discount > 0 && (
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: "line-through",
                                color: "text.secondary",
                                fontSize: "0.75rem",
                              }}
                            >
                              {formatPrice(item.price)}
                            </Typography>
                          )}
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              color: theme.palette.text.primary,
                            }}
                          >
                            {formatPrice(discount > 0 ? item.price * (1 - discount / 100) : item.price)}
                          </Typography>
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary", fontSize: "0.75rem" }}
                        >
                          For one
                        </Typography>
                      </Box>
                    </CardContent>

                    {/* Add Button */}
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleAddToCart(item)}
                        sx={{
                          backgroundColor: "#ff4757",
                          "&:hover": {
                            backgroundColor: "#ff3838",
                          },
                          textTransform: "none",
                          fontWeight: 600,
                          py: 1,
                        }}
                      >
                        {quantity > 0 ? `Add More (${quantity})` : "Add"}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Paper sx={{ p: 6, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No menu items found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filter criteria
            </Typography>
          </Paper>
        )}
      </Container>

      {/* Floating Cart Button */}
      {cart.totalItems > 0 && (
        <Fab
          color="primary"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            backgroundColor: "#ff4757",
            "&:hover": {
              backgroundColor: "#ff3838",
            },
          }}
          onClick={() => navigate('/foodease/cart')}
        >
          <Badge badgeContent={cart.totalItems} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </Fab>
      )}
    </Box>
  );
};

export default RestaurantDetailPage; 