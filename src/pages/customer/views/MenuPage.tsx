import React, { useState, useEffect, useMemo } from "react";
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
import { restaurantService, categoryService, favoriteService } from "../../../services";
import type { Restaurant, MenuItem as RestaurantMenuItem } from "../../../services/restaurantService";
import { MenuItemWithRestaurant } from "../../../interfaces/menuItem";
import type { Category } from "../../../services/categoryService";
import { useCart } from "../../../contexts/CartContext";
import { isCustomerAuthenticated } from "../../../utils/sessionManager";
import MenuItemCard from "../../../components/menu-item/MenuItemCard";
import { useSnackbar } from "notistack";
import { FloatingCartButton } from "../../../components/common/FloatingCartButton";

const MenuPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const {
    cart,
    addToCart,
    getItemQuantity,
    updateQuantity,
    removeItem,
  } = useCart();

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

  useEffect(() => {
    const fetchFavorites = async () => {
      if (isAuthenticated) {
        try {
          const favs = await favoriteService.getFavorites();
          setFavorites(new Set(favs.menu_items.map((item) => item.id)));
        } catch (error) {
          console.error("Failed to fetch favorites:", error);
        }
      }
    };
    fetchFavorites();
  }, [isAuthenticated]);

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
    enqueueSnackbar(`${item.name} has been added to your cart!`, {
      variant: "success",
    });
  };

  const handleToggleFavorite = async (itemId: number) => {
    if (!isAuthenticated) {
      navigate("/foodease/login");
      return;
    }

    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);

    try {
      await favoriteService.toggleFavorite({
        favoritableId: itemId,
        favoritableType: "menu_item",
      });
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      // Revert if API call fails
      setFavorites(favorites);
    }
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

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    // Assuming all items on this page are from the same restaurant for simplicity
    // A more robust solution would involve knowing the restaurantId for each item
    if (allMenuItems.length > 0) {
      const item = allMenuItems.find(mi => mi.id === itemId);
      if(item) {
        if (newQuantity === 0) {
            removeItem(itemId, item.restaurantId);
        } else {
            updateQuantity(itemId, item.restaurantId, newQuantity);
        }
      }
    }
  };

  const handleRemoveFromCart = (itemId: number) => {
    if (allMenuItems.length > 0) {
        const item = allMenuItems.find(mi => mi.id === itemId);
        if(item) {
            removeItem(itemId, item.restaurantId);
        }
    }
  }

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
            {filteredMenuItems.map((item) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={`${item.id}-${item.restaurantId}`}
              >
                <MenuItemCard
                  item={item}
                  isFavorite={favorites.has(item.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveFromCart={handleRemoveFromCart}
                  quantityInCart={getItemQuantity(item.id)}
                />
              </Grid>
            ))}
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
      </Container>
      <FloatingCartButton />
    </Box>
  );
};

export default MenuPage; 