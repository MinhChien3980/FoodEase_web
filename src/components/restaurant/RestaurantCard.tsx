import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Rating,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Restaurant } from "../../services/restaurantService";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
  onToggleStatus?: (id: number, status: boolean) => void;
  onToggleFavorite?: (id: number) => void;
  isFavorite?: boolean;
  deliveryTime?: number; // in minutes
  rating?: number;
  className?: string;
}

// Default images for different restaurant types
const getDefaultImage = (restaurant: Restaurant) => {
  const defaultImages = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1552566874-6ca15c0f7e8d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1466978913421-dad2ebd01117?w=400&h=300&fit=crop'
  ];
  return defaultImages[restaurant.id % defaultImages.length];
};

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onView,
  onToggleFavorite,
  isFavorite = false,
  deliveryTime = Math.floor(Math.random() * 50) + 10, // Random delivery time 10-60 min
  rating = Math.random() * 2 + 3, // Random rating 3-5
  className,
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  // Calculate price range
  const menuItems = restaurant.menuItems || [];
  const prices = menuItems.map(item => item.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get main category
  const getMainCategory = () => {
    if (menuItems.length === 0) return "Restaurant";
    
    // Count category occurrences
    const categoryCount: { [key: string]: number } = {};
    menuItems.forEach(item => {
      const categoryName = `Category ${item.categoryId || 1}`;
      categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
    });
    
    // Return most common category or fallback
    const mostCommon = Object.entries(categoryCount).reduce((a, b) => 
      categoryCount[a[0]] > categoryCount[b[0]] ? a : b
    );
    return mostCommon ? mostCommon[0] : "Restaurant";
  };

  const handleCardClick = () => {
    if (onView) {
      onView(restaurant.id);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(restaurant.id);
    }
  };

  return (
    <Card
      className={className}
      sx={{
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
        },
        height: "auto",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Restaurant Image */}
      <Box sx={{ position: "relative", height: 200 }}>
        <CardMedia
          component="img"
          height="200"
          image={getDefaultImage(restaurant)}
          alt={restaurant.name}
          sx={{
            objectFit: "cover",
            transition: "transform 0.3s ease-in-out",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />
        
        {/* Location Pin - Top Left */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <LocationOnIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
        </Box>

        {/* Favorite Heart - Top Right */}
        <IconButton
          onClick={handleFavoriteClick}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 1)",
            },
            width: 36,
            height: 36,
          }}
        >
          {isFavorite ? (
            <FavoriteIcon sx={{ color: "#ff4757", fontSize: 20 }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
          )}
        </IconButton>

        {/* Delivery Time Badge - Bottom Left */}
        <Chip
          icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
          label={`${deliveryTime} min`}
          size="small"
          sx={{
            position: "absolute",
            bottom: 12,
            left: 12,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            "& .MuiChip-icon": {
              color: "white",
            },
            fontSize: "0.75rem",
            height: 24,
          }}
        />

        {/* Online Status Indicator - Bottom Right */}
        <Box
          sx={{
            position: "absolute",
            bottom: 12,
            right: 12,
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "#2ed573",
            border: "2px solid white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        />
      </Box>

      {/* Card Content */}
      <CardContent sx={{ p: 2 }}>
        {/* Restaurant Name */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 700,
            fontSize: "1.1rem",
            lineHeight: 1.3,
            mb: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {restaurant.name}
        </Typography>

        {/* Category */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: "0.875rem",
            mb: 1,
            fontWeight: 500,
          }}
        >
          {getMainCategory()}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <Rating
            value={rating}
            precision={0.1}
            readOnly
            size="small"
            sx={{
              "& .MuiRating-iconFilled": {
                color: "#ffa726",
              },
              mr: 1,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              fontSize: "0.875rem",
            }}
          >
            {rating.toFixed(1)}
          </Typography>
        </Box>

        {/* Price Range */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.875rem",
            }}
          >
            {minPrice > 0 ? formatPrice(minPrice) : "Pricing varies"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              fontSize: "0.875rem",
            }}
          >
            For one
          </Typography>
          {minPrice > 0 && (
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#2ed573",
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard; 