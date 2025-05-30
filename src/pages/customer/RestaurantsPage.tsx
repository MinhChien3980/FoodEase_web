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
  Slider,
  Switch,
  FormControlLabel,
  Pagination,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RestaurantCard from "../../components/restaurant/RestaurantCard";
import GoogleMapComponent from "../../components/maps/GoogleMapComponent";
import { formatPrice } from "../../utils/foodHelpers";

// Extended mock data
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
    longitude: -74.0060,
    deliveryRadius: 5
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
    longitude: -73.9851,
    deliveryRadius: 3
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
    longitude: -73.9712,
    deliveryRadius: 4
  },
  {
    id: "4",
    name: "Taco Fiesta",
    slug: "taco-fiesta",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    rating: 4.3,
    reviewCount: 156,
    cuisineType: ["Mexican", "Tacos"],
    address: "321 Elm St, Downtown",
    preparationTime: 20,
    deliveryFee: 2.49,
    minimumOrder: 12.00,
    openTime: "10:30",
    closeTime: "23:30",
    isActive: true,
    isVerified: false,
    totalOrders: 678,
    latitude: 40.7506,
    longitude: -73.9756,
    deliveryRadius: 3
  },
  {
    id: "5",
    name: "Dragon Chinese",
    slug: "dragon-chinese",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400",
    rating: 4.6,
    reviewCount: 203,
    cuisineType: ["Chinese", "Asian"],
    address: "654 Maple Ave, Chinatown",
    preparationTime: 30,
    deliveryFee: 3.49,
    minimumOrder: 18.00,
    openTime: "11:30",
    closeTime: "22:00",
    isActive: true,
    isVerified: true,
    totalOrders: 1456,
    latitude: 40.7150,
    longitude: -74.0020,
    deliveryRadius: 6
  },
  {
    id: "6",
    name: "Healthy Bowls",
    slug: "healthy-bowls",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    rating: 4.4,
    reviewCount: 92,
    cuisineType: ["Healthy", "Salads"],
    address: "987 Health St, Wellness District",
    preparationTime: 18,
    deliveryFee: 2.99,
    minimumOrder: 14.00,
    openTime: "08:00",
    closeTime: "21:00",
    isActive: true,
    isVerified: true,
    totalOrders: 534,
    latitude: 40.7282,
    longitude: -73.9942,
    deliveryRadius: 4
  }
];

const cuisineTypes = ["All", "Italian", "American", "Japanese", "Mexican", "Chinese", "Healthy"];
const sortOptions = [
  { value: "rating", label: "Rating" },
  { value: "deliveryTime", label: "Delivery Time" },
  { value: "deliveryFee", label: "Delivery Fee" },
  { value: "minimumOrder", label: "Minimum Order" },
];

const RestaurantsPage: React.FC = () => {
  const theme = useTheme();
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [filteredRestaurants, setFilteredRestaurants] = useState(mockRestaurants);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);
  const [deliveryFeeRange, setDeliveryFeeRange] = useState<number[]>([0, 5]);
  const [showMap, setShowMap] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter and sort restaurants
  useEffect(() => {
    let filtered = [...mockRestaurants];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisineType.some(cuisine => 
          cuisine.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        restaurant.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Cuisine filter
    if (selectedCuisine !== "All") {
      filtered = filtered.filter(restaurant =>
        restaurant.cuisineType.includes(selectedCuisine)
      );
    }

    // Verified filter
    if (showOnlyVerified) {
      filtered = filtered.filter(restaurant => restaurant.isVerified);
    }

    // Open now filter
    if (showOnlyOpen) {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      filtered = filtered.filter(restaurant => {
        const [openHour, openMin] = restaurant.openTime.split(':').map(Number);
        const [closeHour, closeMin] = restaurant.closeTime.split(':').map(Number);
        const open = openHour * 60 + openMin;
        const close = closeHour * 60 + closeMin;
        return currentTime >= open && currentTime <= close;
      });
    }

    // Delivery fee filter
    filtered = filtered.filter(restaurant =>
      restaurant.deliveryFee >= deliveryFeeRange[0] && 
      restaurant.deliveryFee <= deliveryFeeRange[1]
    );

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "deliveryTime":
          return a.preparationTime - b.preparationTime;
        case "deliveryFee":
          return a.deliveryFee - b.deliveryFee;
        case "minimumOrder":
          return a.minimumOrder - b.minimumOrder;
        default:
          return 0;
      }
    });

    setFilteredRestaurants(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedCuisine, sortBy, showOnlyVerified, showOnlyOpen, deliveryFeeRange]);

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRestaurants = filteredRestaurants.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);

  const handleRestaurantClick = (restaurant: any) => {
    console.log("Restaurant clicked:", restaurant);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: theme.palette.grey[50] }}>
      {/* Header */}
      <Box sx={{ backgroundColor: "white", borderBottom: 1, borderColor: "divider", py: 2 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Restaurants Near You
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover amazing food from local restaurants
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Filters Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Filters
              </Typography>

              {/* Search */}
              <TextField
                fullWidth
                placeholder="Search restaurants..."
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

              {/* Cuisine Type */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Cuisine Type</InputLabel>
                <Select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  label="Cuisine Type"
                >
                  {cuisineTypes.map((cuisine) => (
                    <MenuItem key={cuisine} value={cuisine}>
                      {cuisine}
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
                      checked={showOnlyVerified}
                      onChange={(e) => setShowOnlyVerified(e.target.checked)}
                    />
                  }
                  label="Verified Only"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={showOnlyOpen}
                      onChange={(e) => setShowOnlyOpen(e.target.checked)}
                    />
                  }
                  label="Open Now"
                />
              </Box>

              {/* Delivery Fee Range */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Delivery Fee: {formatPrice(deliveryFeeRange[0])} - {formatPrice(deliveryFeeRange[1])}
                </Typography>
                <Slider
                  value={deliveryFeeRange}
                  onChange={(_, newValue) => setDeliveryFeeRange(newValue as number[])}
                  valueLabelDisplay="auto"
                  min={0}
                  max={5}
                  step={0.5}
                  marks={[
                    { value: 0, label: '$0' },
                    { value: 2.5, label: '$2.5' },
                    { value: 5, label: '$5' },
                  ]}
                />
              </Box>

              {/* Map Toggle */}
              <Button
                fullWidth
                variant={showMap ? "contained" : "outlined"}
                onClick={() => setShowMap(!showMap)}
                startIcon={<FilterListIcon />}
              >
                {showMap ? "Hide Map" : "Show Map"}
              </Button>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            {/* Results Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6">
                {filteredRestaurants.length} restaurants found
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {selectedCuisine !== "All" && (
                  <Chip
                    label={selectedCuisine}
                    onDelete={() => setSelectedCuisine("All")}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {showOnlyVerified && (
                  <Chip
                    label="Verified Only"
                    onDelete={() => setShowOnlyVerified(false)}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {showOnlyOpen && (
                  <Chip
                    label="Open Now"
                    onDelete={() => setShowOnlyOpen(false)}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>

            {/* Map View */}
            {showMap && (
              <Paper sx={{ mb: 3, overflow: "hidden" }}>
                <GoogleMapComponent
                  restaurants={filteredRestaurants}
                  height="400px"
                  showDeliveryRadius={true}
                  onRestaurantClick={handleRestaurantClick}
                />
              </Paper>
            )}

            {/* Restaurants Grid */}
            {paginatedRestaurants.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  {paginatedRestaurants.map((restaurant) => (
                    <Grid item xs={12} sm={6} lg={4} key={restaurant.id}>
                      <RestaurantCard
                        restaurant={restaurant}
                        onView={(id) => console.log("View restaurant:", id)}
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
                    setSelectedCuisine("All");
                    setShowOnlyVerified(false);
                    setShowOnlyOpen(false);
                    setDeliveryFeeRange([0, 5]);
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