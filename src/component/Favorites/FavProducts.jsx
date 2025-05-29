import React, { useEffect, useState } from "react";
import ProductCard from "../Cards/ProductCard";
import { get_favorites } from "@/interceptor/api";
import RestaurantsSkeleton from "../Skeleton/RestaurantsSkeleton";
import { Box, Grid } from "@mui/joy";
import NotFound from "@/pages/404";

const FavProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFavoriteToggleParent = () => {
    fetchData({ initialState: false });
  };

  const fetchData = async ({ initialState }) => {
    try {
      if (initialState) setLoading(true);
      const Products = await get_favorites({ type: "products" });
      setProducts(Products.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching FavRestaurants:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData({ initialState: true });
  }, []);

  return (
    <Box>
      {loading ? (
        <RestaurantsSkeleton itemCount={5} />
      ) : (
        <>
          {products && products.length != 0 ? (
            <Grid
              container
              display="flex"
              alignItems="center"
              justifyContent={"start"}
              spacing={2}
              width={"100%"}
            >
              {products.map((product) => (
                <Grid key={product.id} md={4} sm={6} lg={3}>
                  <ProductCard
                    Product={product}
                    handleFavoriteToggleParent={handleFavoriteToggleParent}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <NotFound />
          )}
        </>
      )}
    </Box>
  );
};

export default FavProducts;
