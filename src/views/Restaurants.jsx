import React, { useEffect, useState } from "react";
import { Box, Card } from "@mui/joy";
import SectionHeading from "@/component/SectionHeading/SectionHeading";
import { updateHomeRestaurants } from "@/repository/home/home_repo";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import RestaurantCard from "@/component/Cards/RestaurantCard";
import { useTranslation } from "react-i18next";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState();

  const restaurantsRedux = useSelector((state) => state?.homepage?.restaurants);
  useEffect(() => {
    setRestaurants(restaurantsRedux);
  }, [restaurantsRedux]);
  const { t } = useTranslation();

  return (
    <>
      {restaurants && restaurants.length > 0 && (
        <Box display={"flex"} flexDirection={"column"}>
          <SectionHeading
            title={t("Our-Top-Most-Restaurants")}
            highlightText={t("Restaurants")}
            showMore={true}
            showMoreLink="/restaurants"
            subtitle={t("We're-here-to-spice-things-up")}
            imageId={4}
          />
          <Box>
            <Swiper
              spaceBetween={1}
              loop={true}
              navigation={{ clickable: true }}
              modules={[Autoplay, Pagination, Navigation]}
              autoplay={false}
              className="paddingY8"
              breakpoints={{
                300: {
                  slidesPerView: 1,
                },
                350: {
                  slidesPerView: 2,
                },
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 3,
                },
                1445: {
                  slidesPerView: 4,
                },
                1545: {
                  slidesPerView: 5,
                },
              }}
            >
              {restaurants &&
                restaurants.map((restaurant, index) => (
                  <SwiperSlide
                    key={index}
                    className="my-swiper-slide paddingX4"
                  >
                    <RestaurantCard restaurant={restaurant} />
                  </SwiperSlide>
                ))}
            </Swiper>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Restaurants;
