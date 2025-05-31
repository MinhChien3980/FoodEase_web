import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar,
  Tooltip,
  CardActions,
  Button,
  Badge,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { Restaurant } from "../../services/restaurantService";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
  onToggleStatus?: (id: number, status: boolean) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onEdit,
  onDelete,
  onView,
  onToggleStatus,
}) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusToggle = async () => {
    if (onToggleStatus) {
      setIsLoading(true);
      try {
        await onToggleStatus(restaurant.id, true); // Assuming active by default
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleMapClick = () => {
    // Search for restaurant address on Google Maps
    const searchQuery = encodeURIComponent(restaurant.address);
    const url = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
    window.open(url, "_blank");
  };

  // Get unique categories from menu items
  const categories = [...new Set(restaurant.menuItems.map(item => item.categoryName))];
  const menuItemCount = restaurant.menuItems.length;

  // Calculate price range
  const prices = restaurant.menuItems.map(item => item.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        "&:hover": {
          boxShadow: theme.shadows[8],
          transform: "translateY(-2px)",
        },
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* Menu Items Badge */}
      <Box
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          zIndex: 1,
        }}
      >
        <Badge badgeContent={menuItemCount} color="primary">
          <Chip
            label="Food"
            color="primary"
            size="small"
            variant="filled"
            icon={<RestaurantMenuIcon />}
          />
        </Badge>
      </Box>

      {/* Restaurant Image - Using placeholder since no image URL in API */}
      <CardMedia
        component="img"
        height="200"
        image="/placeholder-restaurant.jpg"
        alt={restaurant.name}
        sx={{
          objectFit: "cover",
          backgroundColor: theme.palette.grey[200],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* Restaurant Name */}
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {restaurant.name}
        </Typography>

        {/* Categories */}
        <Box sx={{ mb: 2 }}>
          {categories.slice(0, 3).map((category, index) => (
            <Chip
              key={index}
              label={category}
              size="small"
              variant="outlined"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
          {categories.length > 3 && (
            <Chip
              label={`+${categories.length - 3} more`}
              size="small"
              variant="outlined"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          )}
        </Box>

        {/* Restaurant Info */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {/* Address */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <LocationOnIcon fontSize="small" color="action" />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}
            >
              {restaurant.address}
            </Typography>
            <Tooltip title="Open in Google Maps">
              <IconButton size="small" onClick={handleMapClick}>
                <LocationOnIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Menu Items Count */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <RestaurantMenuIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {menuItemCount} Food
            </Typography>
          </Box>

          {/* Price Range */}
          {menuItemCount > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                From: {formatPrice(minPrice)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                To: {formatPrice(maxPrice)}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      {/* Action Buttons */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
          {onView && (
            <Button
              startIcon={<VisibilityIcon />}
              onClick={() => onView(restaurant.id)}
              variant="outlined"
              size="small"
              sx={{ flex: 1 }}
            >
              View Menu
            </Button>
          )}
          {onEdit && (
            <Tooltip title="Edit Restaurant">
              <IconButton
                onClick={() => onEdit(restaurant.id)}
                color="primary"
                size="small"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Delete Restaurant">
              <IconButton
                onClick={() => onDelete(restaurant.id)}
                color="error"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardActions>

      {/* Toggle Status Button - Optional since API doesn't have status field */}
      {onToggleStatus && (
        <Box sx={{ p: 2, pt: 0 }}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleStatusToggle}
            disabled={isLoading}
            size="small"
          >
            {isLoading ? "Updating..." : "Active"}
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default RestaurantCard; 