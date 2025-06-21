import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Paper,
  Switch,
  FormControlLabel,
  Pagination,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RestaurantCard from "../../../components/restaurant/RestaurantCard";
import GoogleMapComponent from "../../../components/maps/GoogleMapComponent";
import { restaurantService, Restaurant, categoryService, Category, favoriteService } from "../../../services";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import TuneIcon from "@mui/icons-material/Tune";
import { useCart } from "../../../contexts/CartContext";
import { ICategory } from "../../../interfaces";

const RestaurantsPage: React.FC = () => {
  const theme = useTheme();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [showOnlyWithMenu, setShowOnlyWithMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const itemsPerPage = 9;
  const location = useLocation();
  const navigate = useNavigate();

  // Get initial category from navigation state (from HomePage)
  useEffect(() => {
    const navigationState = location.state as { selectedCategory?: string } | null;
    if (navigationState?.selectedCategory) {
      setSelectedCategory(navigationState.selectedCategory);
    }
  }, [location.state]);

  // Get category name by ID
  const getCategoryNameById = (categoryId: number): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : `Category ${categoryId}`;
  };

  // Get all unique categories from restaurants + API categories
  const getAllCategories = () => {
    const categoryNames = new Set<string>();
    restaurants.forEach(restaurant => {
      (restaurant.menuItems || []).forEach(item => {
        if (item.categoryId) {
          const categoryName = getCategoryNameById(item.categoryId);
          categoryNames.add(categoryName);
        }
      });
    });
    return ["All", ...Array.from(categoryNames)];
  };

  const categoryTypes = getAllCategories();
  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "menuCount", label: "Menu Items Count" },
  ];

  const fetchFavorites = async () => {
    try {
      const favs = await favoriteService.getFavorites();
      setFavorites(new Set(favs.restaurants.map(r => r.id)));
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }
  };

  const handleToggleFavorite = async (restaurantId: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(restaurantId)) {
      newFavorites.delete(restaurantId);
    } else {
      newFavorites.add(restaurantId);
    }
    setFavorites(newFavorites);

    try {
      await favoriteService.toggleFavorite({
        favoritableId: restaurantId,
        favoritableType: "restaurant",
      });
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      // Revert if API call fails
      setFavorites(favorites);
    }
  };

  // Fetch restaurants and categories from API
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both restaurants and categories in parallel
        const [restaurantsData, categoriesData] = await Promise.all([
          restaurantService.getAllRestaurants(),
          categoryService.getAllCategories()
        ]);
        
        setRestaurants(restaurantsData);
        setCategories(categoriesData);
        setFilteredRestaurants(restaurantsData);

        await fetchFavorites();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Filter and sort restaurants
  useEffect(() => {
    let filtered = [...restaurants];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (restaurant.menuItems || []).some(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.categoryId && getCategoryNameById(item.categoryId).toLowerCase().includes(searchQuery.toLowerCase()))
        )
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(restaurant =>
        (restaurant.menuItems || []).some(item => getCategoryNameById(item.categoryId) === selectedCategory)
      );
    }

    // Show only restaurants with menu items
    if (showOnlyWithMenu) {
      filtered = filtered.filter(restaurant => restaurant.menuItems.length > 0);
    }

    // Sort restaurants
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "menuCount":
          return b.menuItems.length - a.menuItems.length;
        default:
          return 0;
      }
    });

    setFilteredRestaurants(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [restaurants, categories, searchQuery, selectedCategory, sortBy, showOnlyWithMenu]);

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRestaurants = filteredRestaurants.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);

  const handleRestaurantClick = (restaurant: Restaurant) => {
    console.log("Restaurant clicked:", restaurant);
    // Navigate to restaurant detail page if needed
  };

  const handleViewRestaurant = (id: number) => {
    console.log("View restaurant:", id);
    // Navigate to restaurant detail page
    window.location.href = `/foodease/restaurants/${id}`;
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
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <LocationOnIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
            <Typography variant="h6" color="text.secondary">
              Bhuj, Gujarat, India
            </Typography>
          </Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 1,
            }}
          >
            Restaurants
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            {filteredRestaurants.length} restaurants found
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Filters Sidebar */}
          <Grid item xs={12} lg={3}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 3, 
                position: "sticky", 
                top: 20, 
                borderRadius: 2,
                border: "1px solid",
                borderColor: theme.palette.divider,
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1,
                  fontWeight: 600,
                }}
              >
                <FilterListIcon />
                Filters
              </Typography>

              {/* Search */}
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search restaurants, food, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              {/* Category Type */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  {categoryTypes.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Sort By */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Quick Filters */}
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showOnlyWithMenu}
                      onChange={(e) => setShowOnlyWithMenu(e.target.checked)}
                    />
                  }
                  label="Has Menu Items"
                />
              </Box>

              {/* Clear Filters */}
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setShowOnlyWithMenu(false);
                  setSortBy("name");
                }}
              >
                Clear All Filters
              </Button>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} lg={9}>
            {/* Active Filters */}
            {(selectedCategory !== "All" || showOnlyWithMenu) && (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
                {selectedCategory !== "All" && (
                  <Chip
                    label={selectedCategory}
                    onDelete={() => setSelectedCategory("All")}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                )}
                {showOnlyWithMenu && (
                  <Chip
                    label="Has Menu Items"
                    onDelete={() => setShowOnlyWithMenu(false)}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                )}
              </Box>
            )}

            {/* Restaurants Grid */}
            {paginatedRestaurants.length > 0 ? (
              <>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {paginatedRestaurants.map((restaurant) => (
                    <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                      <RestaurantCard
                        restaurant={restaurant}
                        onView={() => handleViewRestaurant(restaurant.id)}
                        isFavorite={favorites.has(restaurant.id)}
                        onToggleFavorite={handleToggleFavorite}
                        categories={categories}
                      />
                    </Grid>
                  ))}
                </Grid>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(_, page) => setCurrentPage(page)}
                      color="primary"
                      size="large"
                    />
                  </Box>
                )}
              </>
            ) : (
              <Paper sx={{ p: 6, textAlign: "center" }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No restaurants found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Try adjusting your filters or search criteria
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setShowOnlyWithMenu(false);
                  }}
                >
                  Clear All Filters
                </Button>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RestaurantsPage; 