import React, { useEffect, useState } from "react";
import { get_restaurants_all } from "@/interceptor/api";
import { Box, CircularProgress, Grid } from "@mui/joy";
import dynamic from "next/dynamic";
import * as fbq from "@/lib/fpixel";
const BreadCrumb = dynamic(() => import("@/component/BreadCrumps/BreadCrumb"), {
  ssr: false,
});
const Button = dynamic(() => import("@mui/joy/Button"), { ssr: false });
import RestaurantCard from "@/component/Cards/RestaurantCard";
import { HeadTitle } from "@/component/HeadTitle";
import { useTranslation } from "react-i18next";
import RestaurantsSkeleton from "@/component/Skeleton/RestaurantsSkeleton";
import NotFound from "../NotFound";

const Index = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchRestaurants();
    // Track a page view when the component mounts
    fbq.customEvent("restaurants-Page-view");
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await get_restaurants_all();
      const newRestaurants = response?.data || [];
      setRestaurants(newRestaurants);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeadTitle title={"Restaurants"} />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={4}
        width="100%"
      >
        <BreadCrumb />
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
              {restaurants?.map((restaurant) => (
                <Grid sm={6} lg={3} xl={2} key={restaurant.id}>
                  <RestaurantCard restaurant={restaurant} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <>{loading ? <RestaurantsSkeleton /> : <NotFound />}</>
          )}
        </>
        {loading && <RestaurantsSkeleton />}
      </Box>
    </>
  );
};

export default Index;
