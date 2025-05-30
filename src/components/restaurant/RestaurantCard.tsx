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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import RatingBox from "../common/RatingBox";
import { formatPrice, isRestaurantOpen } from "../../utils/foodHelpers";

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    slug: string;
    image: string;
    rating: number;
    reviewCount: number;
    cuisineType: string[];
    address: string;
    preparationTime: number;
    deliveryFee: number;
    minimumOrder: number;
    openTime: string;
    closeTime: string;
    isActive: boolean;
    isVerified: boolean;
    totalOrders: number;
    latitude?: number;
    longitude?: number;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onToggleStatus?: (id: string, status: boolean) => void;
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

  const isOpen = isRestaurantOpen(restaurant.openTime, restaurant.closeTime);

  const handleStatusToggle = async () => {
    if (onToggleStatus) {
      setIsLoading(true);
      try {
        await onToggleStatus(restaurant.id, !restaurant.isActive);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleMapClick = () => {
    if (restaurant.latitude && restaurant.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`;
      window.open(url, "_blank");
    }
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
      {/* Status Indicator */}
      <Box
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          zIndex: 1,
        }}
      >
        <Chip
          label={restaurant.isActive ? "Active" : "Inactive"}
          color={restaurant.isActive ? "success" : "error"}
          size="small"
          variant="filled"
        />
      </Box>

      {/* Verification Badge */}
      {restaurant.isVerified && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        >
          <Chip
            label="Verified"
            color="primary"
            size="small"
            variant="filled"
            icon={<RestaurantIcon />}
          />
        </Box>
      )}

      {/* Restaurant Image */}
      <CardMedia
        component="img"
        height="200"
        image={restaurant.image || "/placeholder-restaurant.jpg"}
        alt={restaurant.name}
        sx={{
          objectFit: "cover",
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

        {/* Rating */}
        <Box sx={{ mb: 1 }}>
          <RatingBox
            rating={restaurant.rating}
            reviewCount={restaurant.reviewCount}
            size="small"
          />
        </Box>

        {/* Cuisine Types */}
        <Box sx={{ mb: 2 }}>
          {restaurant.cuisineType.slice(0, 3).map((cuisine, index) => (
            <Chip
              key={index}
              label={cuisine}
              size="small"
              variant="outlined"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
          {restaurant.cuisineType.length > 3 && (
            <Chip
              label={`+${restaurant.cuisineType.length - 3} more`}
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
            {restaurant.latitude && restaurant.longitude && (
              <Tooltip title="Open in Google Maps">
                <IconButton size="small" onClick={handleMapClick}>
                  <LocationOnIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* Timing and Status */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {restaurant.preparationTime} mins
            </Typography>
            <Chip
              label={isOpen ? "Open" : "Closed"}
              size="small"
              color={isOpen ? "success" : "error"}
              variant="outlined"
            />
          </Box>

          {/* Order Info */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Min: {formatPrice(restaurant.minimumOrder)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Delivery: {formatPrice(restaurant.deliveryFee)}
            </Typography>
          </Box>

          {/* Total Orders */}
          <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
            {restaurant.totalOrders} total orders
          </Typography>
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
              View
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

      {/* Toggle Status Button */}
      {onToggleStatus && (
        <Box sx={{ p: 2, pt: 0 }}>
          <Button
            variant={restaurant.isActive ? "outlined" : "contained"}
            color={restaurant.isActive ? "error" : "success"}
            fullWidth
            onClick={handleStatusToggle}
            disabled={isLoading}
            size="small"
          >
            {isLoading
              ? "Updating..."
              : restaurant.isActive
              ? "Deactivate"
              : "Activate"}
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default RestaurantCard; 