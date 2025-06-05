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
  Drawer,
  IconButton,
  Collapse,
  useMediaQuery,
  useTheme,
  Stack,
  Fab,
} from "@mui/material";
import { useLocation } from "react-router";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import TuneIcon from "@mui/icons-material/Tune";
import RestaurantCard from "../../../components/restaurant/RestaurantCard";
import GoogleMapComponent from "../../../components/maps/GoogleMapComponent";
import { restaurantService, Restaurant, categoryService, Category } from "../../../services";

const RestaurantsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [showOnlyWithMenu, setShowOnlyWithMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mobile filter state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(!isMobile);
  
  const itemsPerPage = isMobile ? 4 : isTablet ? 6 : 9;
  const location = useLocation();

  // Get initial category from navigation state (from HomePage)
  useEffect(() => {
    const navigationState = location.state as { selectedCategory?: string } | null;
    if (navigationState?.selectedCategory) {
      setSelectedCategory(navigationState.selectedCategory);
    }
  }, [location.state]);

  // Auto-expand filters on desktop, collapse on mobile
  useEffect(() => {
    setFiltersExpanded(!isMobile);
  }, [isMobile]);

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

  // Fetch restaurants and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both restaurants and categories in parallel
        const [restaurantData, categoryData] = await Promise.all([
          restaurantService.getAllRestaurants(),
          categoryService.getAllCategories()
        ]);
        
        setRestaurants(restaurantData);
        setCategories(categoryData);
        setFilteredRestaurants(restaurantData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
  };

  const handleClearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setShowOnlyWithMenu(false);
    setSortBy("name");
    if (isMobile) {
      setMobileFilterOpen(false);
    }
  };

  // Filter Component
  const FilterContent = () => (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FilterListIcon />
          <Typography variant="h6" fontWeight="bold">
            Filters
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={() => setMobileFilterOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

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
        onClick={handleClearAllFilters}
        sx={{ borderRadius: 2 }}
      >
        Clear All Filters
      </Button>
    </Box>
  );

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
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ backgroundColor: "white", borderBottom: 1, borderColor: "divider", py: { xs: 2, md: 4 } }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant={isMobile ? "h4" : "h3"}
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
            <Typography variant={isMobile ? "body1" : "h6"} color="text.secondary">
              Discover amazing restaurants and delicious food
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
        {/* Mobile Filter Button */}
        {isMobile && (
          <Box sx={{ mb: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<TuneIcon />}
              onClick={() => setMobileFilterOpen(true)}
              sx={{ 
                py: 1.5,
                borderRadius: 2,
                justifyContent: "flex-start"
              }}
            >
              Filters & Search
            </Button>
          </Box>
        )}

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {/* Desktop Filters Sidebar */}
          {!isMobile && (
            <Grid item xs={12} md={3}>
              <Paper sx={{ position: "sticky", top: 20, borderRadius: 2 }}>
                <FilterContent />
              </Paper>
            </Grid>
          )}

          {/* Main Content */}
          <Grid item xs={12} md={isMobile ? 12 : 9}>
            {/* Results Header */}
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: { xs: "flex-start", sm: "center" }, 
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 3 
            }}>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {selectedCategory !== "All" && (
                  <Chip
                    label={selectedCategory}
                    onDelete={() => setSelectedCategory("All")}
                    color="primary"
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                  />
                )}
                {showOnlyWithMenu && (
                  <Chip
                    label="Has Menu Items"
                    onDelete={() => setShowOnlyWithMenu(false)}
                    color="primary"
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                  />
                )}
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                {filteredRestaurants.length} restaurants found
              </Typography>
            </Box>

            {/* Restaurants Grid */}
            {paginatedRestaurants.length > 0 ? (
              <>
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  {paginatedRestaurants.map((restaurant) => (
                    <Grid 
                      item 
                      xs={12} 
                      sm={6} 
                      lg={isMobile ? 12 : 4} 
                      key={restaurant.id}
                    >
                      <RestaurantCard
                        restaurant={restaurant}
                        categories={categories}
                        onView={handleViewRestaurant}
                      />
                    </Grid>
                  ))}
                </Grid>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    mt: 4,
                    px: { xs: 2, sm: 0 }
                  }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(_, page) => setCurrentPage(page)}
                      color="primary"
                      size={isMobile ? "medium" : "large"}
                      siblingCount={isMobile ? 0 : 1}
                      boundaryCount={isMobile ? 1 : 2}
                    />
                  </Box>
                )}
              </>
            ) : (
              <Paper sx={{ p: { xs: 4, md: 6 }, textAlign: "center", borderRadius: 2 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No restaurants found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Try adjusting your filters or search criteria
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleClearAllFilters}
                  sx={{ borderRadius: 2 }}
                >
                  Clear All Filters
                </Button>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="bottom"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px 16px 0 0",
            maxHeight: "80vh",
          }
        }}
      >
        <FilterContent />
      </Drawer>
    </Box>
  );
};

export default RestaurantsPage; 