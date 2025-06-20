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
  Paper,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem as MuiMenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  CardActions,
  Fab,
  Badge,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import FilterListIcon from "@mui/icons-material/FilterList";
import TuneIcon from "@mui/icons-material/Tune";
import { restaurantService, categoryService } from "../../../services";
import type { Restaurant, MenuItem as RestaurantMenuItem } from "../../../services/restaurantService";
import type { Category } from "../../../services/categoryService";
import { useCart } from "../../../contexts/CartContext";
import { isCustomerAuthenticated } from "../../../utils/sessionManager";

interface MenuItemWithRestaurant extends RestaurantMenuItem {
  restaurantName: string;
}

const MenuPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cart, addToCart, getItemQuantity } = useCart();

  // State management
  const [allMenuItems, setAllMenuItems] = useState<MenuItemWithRestaurant[]>([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItemWithRestaurant[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRestaurant, setSelectedRestaurant] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication
  useEffect(() => {
    setIsAuthenticated(isCustomerAuthenticated());
  }, []);

  // Fetch all data
  useEffect(() => {
    fetchAllMenuData();
  }, []);

  const fetchAllMenuData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [restaurantsData, categoriesData] = await Promise.all([
        restaurantService.getAllRestaurants(),
        categoryService.getAllCategories()
      ]);
      
      setRestaurants(restaurantsData);
      setCategories(categoriesData);

      // Fetch menu items for all restaurants
      const allMenuItemsPromises = restaurantsData.map(restaurant =>
        restaurantService.getMenuItemsByRestaurantId(restaurant.id)
          .then(items => items.map(item => ({
            ...item,
            restaurantName: restaurant.name
          })))
          .catch(() => []) // Return empty array if restaurant menu fails
      );

      const menuItemsArrays = await Promise.all(allMenuItemsPromises);
      const combinedMenuItems = menuItemsArrays.flat();
      
      setAllMenuItems(combinedMenuItems);
      setFilteredMenuItems(combinedMenuItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu data');
      console.error('Error fetching menu data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort menu items
  useEffect(() => {
    let filtered = [...allMenuItems];

    // Category filter
    if (selectedCategory !== "all") {
      const categoryId = parseInt(selectedCategory);
      filtered = filtered.filter(item => item.categoryId === categoryId);
    }

    // Restaurant filter
    if (selectedRestaurant !== "all") {
      const restaurantId = parseInt(selectedRestaurant);
      filtered = filtered.filter(item => item.restaurantId === restaurantId);
    }

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.restaurantName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "restaurant":
          return a.restaurantName.localeCompare(b.restaurantName);
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredMenuItems(filtered);
  }, [allMenuItems, selectedCategory, selectedRestaurant, searchQuery, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (item: MenuItemWithRestaurant) => {
    if (!isAuthenticated) {
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
      restaurantName: item.restaurantName,
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

  const getDiscountPercentage = (item: MenuItemWithRestaurant) => {
    const discounts = [0, 6, 9, 16];
    const hash = item.id.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return discounts[hash % discounts.length];
  };

  const getRandomRating = (item: MenuItemWithRestaurant) => {
    const hash = item.id.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 3 + (hash % 20) / 10;
  };

  const isVegetarian = (item: MenuItemWithRestaurant) => {
    const vegKeywords = ['veg', 'paneer', 'mushroom', 'cheese', 'salad', 'pizza'];
    return vegKeywords.some(keyword => item.name.toLowerCase().includes(keyword));
  };

  const getCategoryNameById = (categoryId: number): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : `Category ${categoryId}`;
  };

  const getRestaurantNameById = (restaurantId: number): string => {
    const restaurant = restaurants.find(rest => rest.id === restaurantId);
    return restaurant ? restaurant.name : `Restaurant ${restaurantId}`;
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
        <Button variant="contained" onClick={fetchAllMenuData}>
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            All Dishes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {filteredMenuItems.length} dishes available
          </Typography>
        </Box>

        {/* Filters and Search */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            {/* Search */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search dishes, restaurants..."
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

            {/* Category Filter */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  <MuiMenuItem value="all">All Categories</MuiMenuItem>
                  {categories.map((category) => (
                    <MuiMenuItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </MuiMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Restaurant Filter */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Restaurant</InputLabel>
                <Select
                  value={selectedRestaurant}
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                  label="Restaurant"
                >
                  <MuiMenuItem value="all">All Restaurants</MuiMenuItem>
                  {restaurants.map((restaurant) => (
                    <MuiMenuItem key={restaurant.id} value={restaurant.id.toString()}>
                      {restaurant.name}
                    </MuiMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sort */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort by"
                >
                  <MuiMenuItem value="name">Name</MuiMenuItem>
                  <MuiMenuItem value="price-low">Price: Low to High</MuiMenuItem>
                  <MuiMenuItem value="price-high">Price: High to Low</MuiMenuItem>
                  <MuiMenuItem value="restaurant">Restaurant</MuiMenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* View Mode */}
            <Grid item xs={12} sm={6} md={2}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, newView) => newView && setViewMode(newView)}
                sx={{ width: "100%" }}
              >
                <ToggleButton value="grid" sx={{ flex: 1 }}>
                  <GridViewIcon />
                </ToggleButton>
                <ToggleButton value="list" sx={{ flex: 1 }}>
                  <ViewListIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>
        </Paper>

        {/* Menu Items Grid */}
        {filteredMenuItems.length > 0 ? (
          <Grid container spacing={3}>
            {filteredMenuItems.map((item) => {
              const discount = getDiscountPercentage(item);
              const rating = getRandomRating(item);
              const isVeg = isVegetarian(item);
              const quantity = getItemQuantity(item.id);

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={`${item.id}-${item.restaurantId}`}>
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
                      {/* Restaurant Name */}
                      <Chip
                        label={item.restaurantName}
                        size="small"
                        variant="outlined"
                        sx={{
                          mb: 1,
                          fontSize: "0.7rem",
                          height: 20,
                          borderColor: theme.palette.primary.main,
                          color: theme.palette.primary.main,
                        }}
                      />

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
              No dishes found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filter criteria
            </Typography>
          </Paper>
        )}

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
      </Container>
    </Box>
  );
};

export default MenuPage; 