import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import { useNavigate } from "react-router-dom";
import { favoriteService, categoryService } from "../../../services";
import RestaurantCard from "../../../components/restaurant/RestaurantCard";
import type { Restaurant } from "../../../services/restaurantService";
import type { MenuItem } from "../../../interfaces/menuItem";
import type { ICategory } from "../../../interfaces";
import MenuItemCard from "../../../components/menu-item/MenuItemCard";
import { useCart } from "../../../contexts/CartContext";
import { useSnackbar } from "notistack";

type FavoriteRestaurant = Restaurant & { isFavorite: boolean };
type FavoriteMenuItem = MenuItem & {
  isFavorite: boolean;
  restaurantName: string;
};

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const {
    addToCart,
    getItemQuantity,
    updateQuantity,
    removeItem,
  } = useCart();
  const [currentTab, setCurrentTab] = useState(0);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<
    FavoriteRestaurant[]
  >([]);
  const [favoriteMenuItems, setFavoriteMenuItems] = useState<
    FavoriteMenuItem[]
  >([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavoritesAndCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [favorites, categoriesData] = await Promise.all([
        favoriteService.getFavorites(),
        categoryService.getAllCategories(),
      ]);

      setFavoriteRestaurants(
        favorites.restaurants.map((r: Restaurant) => ({ ...r, isFavorite: true }))
      );
      setFavoriteMenuItems(
        favorites.menu_items.map((item: any) => ({
          ...item,
          isFavorite: true,
          restaurantName: item.restaurantName || "Restaurant",
        }))
      );
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavoritesAndCategories();
  }, [fetchFavoritesAndCategories]);

  const handleToggleRestaurantFavorite = async (restaurantId: number) => {
    try {
      await favoriteService.toggleRestaurantFavorite(restaurantId);
      setFavoriteRestaurants((prev) =>
        prev.filter((r) => r.id !== restaurantId)
      );
    } catch (error) {
      console.error("Failed to toggle restaurant favorite", error);
    }
  };

  const handleToggleMenuItemFavorite = async (menuItemId: number) => {
    try {
      await favoriteService.toggleMenuItemFavorite(menuItemId);
      setFavoriteMenuItems((prev) =>
        prev.filter((item) => item.id !== menuItemId)
      );
    } catch (error) {
      console.error("Failed to toggle menu item favorite", error);
    }
  };

  const handleAddToCart = (item: FavoriteMenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      categoryId: item.categoryId,
      restaurantId: item.restaurantId,
      restaurantName: item.restaurantName,
      imageUrl: item.imageUrl,
    });
    enqueueSnackbar(`${item.name} has been added to your cart!`, {
      variant: "success",
    });
  };

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    const item = favoriteMenuItems.find((mi) => mi.id === itemId);
    if (item) {
      if (newQuantity === 0) {
        removeItem(itemId, item.restaurantId);
      } else {
        updateQuantity(itemId, item.restaurantId, newQuantity);
      }
    }
  };

  const handleRemoveFromCart = (itemId: number) => {
    const item = favoriteMenuItems.find((mi) => mi.id === itemId);
    if (item) {
      removeItem(itemId, item.restaurantId);
    }
  };

  const renderRestaurants = () => {
    if (loading) {
      return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;
    }
    if (favoriteRestaurants.length === 0) {
      return (
        <Typography sx={{ textAlign: "center", mt: 4 }}>
          You haven't favorited any restaurants yet.
        </Typography>
      );
    }
    return (
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {favoriteRestaurants.map((restaurant) => (
          <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
            <RestaurantCard
              restaurant={restaurant}
              isFavorite={restaurant.isFavorite}
              onToggleFavorite={handleToggleRestaurantFavorite}
              onView={(id: number) => navigate(`/foodease/restaurants/${id}`)}
              categories={categories}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderMenuItems = () => {
    if (loading) {
      return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;
    }
    if (favoriteMenuItems.length === 0) {
      return (
        <Typography sx={{ textAlign: "center", mt: 4 }}>
          You haven't favorited any food items yet.
        </Typography>
      );
    }
    return (
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {favoriteMenuItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <MenuItemCard
              item={{
                ...item,
                restaurantName: item.restaurantName || "Restaurant",
              }}
              isFavorite={item.isFavorite}
              onToggleFavorite={handleToggleMenuItemFavorite}
              onAddToCart={() => handleAddToCart(item)}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveFromCart={handleRemoveFromCart}
              quantityInCart={getItemQuantity(item.id)}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        My Favorites
      </Typography>
      <Paper elevation={1} sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab icon={<RestaurantIcon />} label="Restaurants" />
          <Tab icon={<FastfoodIcon />} label="Food Items" />
        </Tabs>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ my: 4 }}>
          {error}
        </Alert>
      )}

      {currentTab === 0 ? renderRestaurants() : renderMenuItems()}
    </Box>
  );
};

export default FavoritesPage; 