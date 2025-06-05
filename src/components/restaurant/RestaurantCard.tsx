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
  Rating,
  Divider,
  Fade,
  Grow,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Restaurant } from "../../services/restaurantService";
import { Category } from "../../services";
import MenuItemsModal from "./MenuItemsModal";

interface RestaurantCardProps {
  restaurant: Restaurant;
  categories?: Category[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
  onToggleStatus?: (id: number, status: boolean) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  categories = [],
  onEdit,
  onDelete,
  onView,
  onToggleStatus,
}) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Default images for different restaurant types
  const getDefaultImage = () => {
    const defaultImages = [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1552566874-6ca15c0f7e8d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=300&fit=crop'
    ];
    return defaultImages[restaurant.id % defaultImages.length];
  };

  // Get category name by ID
  const getCategoryNameById = (categoryId: number): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : `Category ${categoryId}`;
  };

  const handleStatusToggle = async () => {
    if (onToggleStatus) {
      setIsLoading(true);
      try {
        await onToggleStatus(restaurant.id, true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleMapClick = () => {
    const searchQuery = encodeURIComponent(restaurant.address);
    const url = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
    window.open(url, "_blank");
  };

  const handleViewMenu = () => {
    if (onView) {
      onView(restaurant.id);
    }
    setShowMenuModal(true);
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Get unique categories from menu items with real category names
  const menuItems = restaurant.menuItems || [];
  const uniqueCategoryNames = [...new Set(menuItems.map(item => getCategoryNameById(item.categoryId || 0)))];
  const menuItemCount = menuItems.length;

  // Calculate price range
  const prices = menuItems.map(item => item.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Generate fake rating for better visual appeal
  const fakeRating = 4.0 + (restaurant.id % 10) / 10;
  const reviewCount = 50 + (restaurant.id % 200);

  return (
    <>
      <Grow in timeout={600}>
        <Card
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            borderRadius: 4,
            overflow: "hidden",
            background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
            border: '1px solid',
            borderColor: isHovered ? theme.palette.primary.main : 'transparent',
            boxShadow: isHovered 
              ? '0 20px 40px rgba(0,0,0,0.12)' 
              : '0 4px 20px rgba(0,0,0,0.08)',
            transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            "&::before": {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}05, ${theme.palette.secondary.main}05)`,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
              zIndex: 0
            },
            '& > *': {
              position: 'relative',
              zIndex: 1
            }
          }}
        >
          {/* Enhanced Image Section with Overlays */}
          <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            <CardMedia
              component="img"
              height="220"
              image={imageError ? getDefaultImage() : (restaurant.imageUrl || getDefaultImage())}
              alt={restaurant.name}
              onError={handleImageError}
              sx={{
                objectFit: "cover",
                transition: 'transform 0.4s ease',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              }}
            />
            
            {/* Gradient Overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
                opacity: isHovered ? 1 : 0.7,
                transition: 'opacity 0.3s ease'
              }}
            />

            {/* Top Action Buttons */}
            <Box
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                right: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                zIndex: 2,
              }}
            >
              <Badge 
                badgeContent={menuItemCount} 
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }
                }}
              >
                <Chip
                  label="Restaurant"
                  color="primary"
                  size="small"
                  variant="filled"
                  icon={<RestaurantIcon />}
                  sx={{
                    background: 'rgba(255,255,255,0.9)',
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)',
                    '& .MuiChip-icon': {
                      color: theme.palette.primary.main
                    }
                  }}
                />
              </Badge>

              <IconButton
                onClick={handleFavoriteToggle}
                sx={{
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  color: isFavorite ? theme.palette.error.main : theme.palette.grey[600],
                  '&:hover': {
                    background: 'rgba(255,255,255,1)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Box>

            {/* Rating Badge */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                px: 1.5,
                py: 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <StarIcon sx={{ fontSize: 16, color: '#ffc107' }} />
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                {fakeRating.toFixed(1)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                ({reviewCount})
              </Typography>
            </Box>

            {/* Special Offer Badge */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                background: theme.palette.secondary.main,
                borderRadius: 2,
                px: 1.5,
                py: 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <LocalOfferIcon sx={{ fontSize: 14, color: 'white' }} />
              <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                20% OFF
              </Typography>
            </Box>
          </Box>

          <CardContent sx={{ flexGrow: 1, p: 3 }}>
            {/* Restaurant Name & Status */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: theme.palette.text.primary
                }}
              >
                {restaurant.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip
                  icon={<AccessTimeIcon />}
                  label="25-35 min"
                  size="small"
                  variant="outlined"
                  sx={{ 
                    borderColor: theme.palette.success.main,
                    color: theme.palette.success.main,
                    fontSize: '0.75rem'
                  }}
                />
                <Chip
                  label="Open Now"
                  size="small"
                  sx={{ 
                    background: theme.palette.success.main,
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                />
              </Box>
            </Box>

            {/* Categories */}
            <Box sx={{ mb: 2 }}>
              {uniqueCategoryNames.slice(0, 2).map((categoryName, index) => (
                <Chip
                  key={index}
                  label={categoryName}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    mr: 0.5, 
                    mb: 0.5,
                    borderRadius: 2,
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    '&:hover': {
                      background: theme.palette.primary.main,
                      color: 'white',
                      borderColor: theme.palette.primary.main
                    },
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
              {uniqueCategoryNames.length > 2 && (
                <Chip
                  label={`+${uniqueCategoryNames.length - 2}`}
                  size="small"
                  variant="filled"
                  color="primary"
                  sx={{ 
                    mr: 0.5, 
                    mb: 0.5,
                    borderRadius: 2,
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                />
              )}
            </Box>

            <Divider sx={{ my: 2, opacity: 0.6 }} />

            {/* Restaurant Info */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {/* Address */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOnIcon 
                  fontSize="small" 
                  sx={{ color: theme.palette.primary.main }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                    fontWeight: 500
                  }}
                >
                  {restaurant.address}
                </Typography>
                <Tooltip title="Open in Google Maps">
                  <IconButton 
                    size="small" 
                    onClick={handleMapClick}
                    sx={{
                      color: theme.palette.primary.main,
                      '&:hover': {
                        background: theme.palette.primary.main + '15',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <LocationOnIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Menu Items Count */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <RestaurantMenuIcon 
                  fontSize="small" 
                  sx={{ color: theme.palette.secondary.main }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {menuItemCount} Delicious Items
                </Typography>
              </Box>

              {/* Price Range */}
              {menuItemCount > 0 && (
                <Box
                  sx={{
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
                    borderRadius: 2,
                    p: 1.5,
                    mt: 1
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        From
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                        {formatPrice(minPrice)}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        To
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>
                        {formatPrice(maxPrice)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </CardContent>

          {/* Enhanced Action Buttons */}
          <CardActions sx={{ p: 3, pt: 0 }}>
            <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
              {onView && (
                <Button
                  startIcon={<VisibilityIcon />}
                  onClick={handleViewMenu}
                  variant="contained"
                  size="large"
                  sx={{ 
                    flex: 1,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 700,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  VIEW MENU
                </Button>
              )}
              
              {onEdit && (
                <Tooltip title="Edit Restaurant">
                  <IconButton
                    onClick={() => onEdit(restaurant.id)}
                    sx={{
                      color: theme.palette.info.main,
                      background: theme.palette.info.main + '15',
                      '&:hover': {
                        background: theme.palette.info.main + '25',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
              
              {onDelete && (
                <Tooltip title="Delete Restaurant">
                  <IconButton
                    onClick={() => onDelete(restaurant.id)}
                    sx={{
                      color: theme.palette.error.main,
                      background: theme.palette.error.main + '15',
                      '&:hover': {
                        background: theme.palette.error.main + '25',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </CardActions>

          {/* Toggle Status Button */}
          {onToggleStatus && (
            <Box sx={{ p: 3, pt: 0 }}>
              <Button
                variant="contained"
                color="success"
                fullWidth
                onClick={handleStatusToggle}
                disabled={isLoading}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 700,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {isLoading ? "Updating..." : "✓ Active Restaurant"}
              </Button>
            </Box>
          )}
        </Card>
      </Grow>

      {/* Menu Items Modal */}
      <MenuItemsModal
        open={showMenuModal}
        onClose={() => setShowMenuModal(false)}
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
      />
    </>
  );
};

export default RestaurantCard; 