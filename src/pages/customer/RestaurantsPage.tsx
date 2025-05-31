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
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RestaurantCard from "../../components/restaurant/RestaurantCard";
import GoogleMapComponent from "../../components/maps/GoogleMapComponent";
import { restaurantService, Restaurant } from "../../services";

const RestaurantsPage: React.FC = () => {
  const theme = useTheme();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [showOnlyWithMenu, setShowOnlyWithMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 6;

  // Get all unique categories from all restaurants
  const getAllCategories = () => {
    const categories = new Set<string>();
    restaurants.forEach(restaurant => {
      restaurant.menuItems.forEach(item => {
        categories.add(item.categoryName);
      });
    });
    return ["All", ...Array.from(categories)];
  };

  const categoryTypes = getAllCategories();
  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "menuCount", label: "Menu Items Count" },
    { value: "id", label: "Restaurant ID" },
  ];

  // Fetch restaurants from API
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await restaurantService.getAllRestaurants();
        setRestaurants(data);
        setFilteredRestaurants(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch restaurants');
        console.error('Error fetching restaurants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Filter and sort restaurants
  useEffect(() => {
    let filtered = [...restaurants];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.menuItems.some(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(restaurant =>
        restaurant.menuItems.some(item => item.categoryName === selectedCategory)
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
        case "id":
          return a.id - b.id;
        default:
          return 0;
      }
    });

    setFilteredRestaurants(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [restaurants, searchQuery, selectedCategory, sortBy, showOnlyWithMenu]);

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
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Restaurants 
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Filters Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, position: "sticky", top: 20 }}>
              <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
          <Grid item xs={12} md={9}>
            {/* Results Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {selectedCategory !== "All" && (
                  <Chip
                    label={selectedCategory}
                    onDelete={() => setSelectedCategory("All")}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {showOnlyWithMenu && (
                  <Chip
                    label="Has Menu Items"
                    onDelete={() => setShowOnlyWithMenu(false)}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>

            {/* Restaurants Grid */}
            {paginatedRestaurants.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  {paginatedRestaurants.map((restaurant) => (
                    <Grid item xs={12} sm={6} lg={4} key={restaurant.id}>
                      <RestaurantCard
                        restaurant={restaurant}
                        onView={handleViewRestaurant}
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