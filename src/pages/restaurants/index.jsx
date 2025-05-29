import React, { useEffect, useState } from "react";
import { get_partners } from "@/interceptor/api";
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
  const [offset, setOffset] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [showLess, setShowLess] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [fetchedDataCount, setFetchedDataCount] = useState(0);
  const limit = 12;

  useEffect(() => {
    if (offset >= restaurants.length) {
      fetchRestaurants();
    } else {
      updateShowButtons();
    }
    // eslint-disable-next-line
  }, [offset]);

  useEffect(() => {
    updateShowButtons(); // eslint-disable-next-line
  }, [restaurants, totalItems]);
  useEffect(() => {
    // Track a page view when the component mounts
    fbq.customEvent("restaurants-Page-view");
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await get_partners({ offset, limit });
      const newRestaurants = response?.data || [];
      setFetchedDataCount(newRestaurants.length);
      setTotalItems(response?.total || 0);

      setRestaurants((prevRestaurants) => {
        const combinedRestaurants = [...prevRestaurants, ...newRestaurants];
        const uniqueRestaurants = Array.from(
          new Set(
            combinedRestaurants.map((restaurant) => restaurant.partner_id)
          )
        ).map((id) =>
          combinedRestaurants.find((restaurant) => restaurant.partner_id === id)
        );
        return uniqueRestaurants;
      });
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateShowButtons = () => {
    setShowLess(offset > 0);
    setShowMore(offset + limit < totalItems);
  };

  const handleShowMore = () => {
    setOffset((prevOffset) => prevOffset + limit);
  };

  const handleShowLess = () => {
    setRestaurants((prevRestaurants) =>
      prevRestaurants.slice(0, -fetchedDataCount)
    );
    if (limit > fetchedDataCount) {
      setFetchedDataCount(limit);
    }
    setOffset((prevOffset) => Math.max(prevOffset - limit, 0));
  };

  const { t } = useTranslation();

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
                <Grid sm={6} lg={3} xl={2} key={restaurant.partner_id}>
                  <RestaurantCard restaurant={restaurant} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <>{loading ? <RestaurantsSkeleton /> : <NotFound />}</>
          )}
        </>
        {loading && <RestaurantsSkeleton />}
        <Box className="flexProperties" sx={{ gap: 2 }}>
          {showMore && (
            <Button onClick={handleShowMore} disabled={loading} sx={{ mb: 2 }}>
              {t("show-more")}
            </Button>
          )}
          {showLess && (
            <Button
              variant="outlined"
              disabled={loading}
              onClick={handleShowLess}
              sx={{ mb: 2 }}
            >
              {t("show-less")}
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Index;
