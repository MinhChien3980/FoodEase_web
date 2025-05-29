import { get_favorites } from "@/interceptor/api";
import { Box, Grid } from "@mui/joy";
import React, { useEffect, useState } from "react";
import RestaurantCard from "../Cards/RestaurantCard";
import RestaurantsSkeleton from "../Skeleton/RestaurantsSkeleton";
import NotFound from "@/pages/404";

const FavRestaurants = ({}) => {
  const [restaurants, setRestaurants] = useState([]);
  const [totalData, setTotalData] = useState();
  const [loading, setLoading] = useState(false);

  const handleFavoriteToggleParent = () => {
    fetchData({ initialState: false });
  };

  const fetchData = async ({ initialState }) => {
    try {
      if (initialState) setLoading(true);
      const Restaurants = await get_favorites({ type: "partners" });
      setRestaurants(Restaurants.data);

      setTotalData(Restaurants?.total);
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
        <RestaurantsSkeleton />
      ) : (
        <>
          {restaurants && restaurants.length != 0 ? (
            <Grid
              container
              display="flex"
              alignItems="center"
              justifyContent={"start"}
              spacing={2}
              width={"100%"}
            >
              {restaurants &&
                restaurants?.map((restaurant) => (
                  <Grid md={5} xl={3} xs={12} sm={6} key={restaurant.id}>
                    <RestaurantCard
                      restaurant={restaurant}
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

export default FavRestaurants;
