import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Chip,
  Rating,
  Button,
  CardActions,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { MenuItemWithRestaurant } from "../../interfaces/menuItem";
import { Add, Remove, Delete } from "@mui/icons-material";

interface MenuItemCardProps {
  item: MenuItemWithRestaurant;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onAddToCart: (item: MenuItemWithRestaurant) => void;
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onRemoveFromCart: (itemId: number) => void;
  quantityInCart: number;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  quantityInCart,
}) => {
  const theme = useTheme();

  const getDiscountPercentage = (id: number) => {
    const discounts = [0, 6, 9, 16];
    const hash = id.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return discounts[hash % discounts.length];
  };

  const getRandomRating = (id: number) => {
    const hash = id.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 3 + (hash % 20) / 10;
  };
  
  const isVegetarian = (name: string) => {
    const vegKeywords = ['veg', 'paneer', 'mushroom', 'cheese', 'salad', 'pizza'];
    return vegKeywords.some(keyword => name.toLowerCase().includes(keyword));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const discount = getDiscountPercentage(item.id);
  const discountedPrice = item.price * (1 - discount / 100);
  const rating = getRandomRating(item.id);
  const isVeg = isVegetarian(item.name);

  return (
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
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={item.imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop'}
          alt={item.name}
          sx={{ objectFit: "cover" }}
        />
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
        <IconButton
          onClick={() => onToggleFavorite(item.id)}
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
          {isFavorite ? (
            <FavoriteIcon sx={{ color: "#ff4757", fontSize: 20 }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 20 }} />
          )}
        </IconButton>
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

      <CardContent sx={{ p: 2, pb: 1, flexGrow: 1 }}>
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
          title={item.name}
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
          title={item.description}
          sx={{
            mb: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minHeight: "40px",
          }}
        >
          {item.description}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Rating
            value={rating}
            precision={0.1}
            readOnly
            size="small"
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({rating.toFixed(1)})
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, alignSelf: 'stretch' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="p" color="primary" sx={{ fontWeight: 700 }}>
            {formatPrice(discountedPrice)}
          </Typography>
          {discount > 0 && (
            <Typography
              variant="body2"
              sx={{
                textDecoration: "line-through",
                color: "text.secondary",
                fontSize: "0.8rem",
              }}
            >
              {formatPrice(item.price)}
            </Typography>
          )}
        </Box>
        {quantityInCart > 0 ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              size="small"
              onClick={() => onUpdateQuantity(item.id, quantityInCart - 1)}
              disabled={quantityInCart <= 0}
              sx={{ color: theme.palette.primary.main }}
            >
              <Remove />
            </IconButton>
            <Typography sx={{ mx: 1, fontWeight: "bold" }}>
              {quantityInCart}
            </Typography>
            <IconButton
              size="small"
              onClick={() => onUpdateQuantity(item.id, quantityInCart + 1)}
              sx={{ color: theme.palette.primary.main }}
            >
              <Add />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onRemoveFromCart(item.id)}
              sx={{ color: theme.palette.error.main, ml: 1 }}
            >
              <Delete />
            </IconButton>
          </Box>
        ) : (
          <Button
            variant="contained"
            size="small"
            onClick={() => onAddToCart(item)}
            sx={{
              backgroundColor: "#ff4757",
              "&:hover": { backgroundColor: "#ff3838" },
            }}
          >
            Add
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default MenuItemCard; 