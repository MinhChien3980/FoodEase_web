"use client";
import SectionHeading from "@/component/SectionHeading/SectionHeading";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { Box, Card } from "@mui/joy";
import React from "react";
import { useSelector } from "react-redux";
import ProductCard from "@/component/Cards/ProductCard";
import { useTranslation } from "react-i18next";
const Products = () => {
  const Products = useSelector((state) => state?.homepage?.homeProducts);
  const { t } = useTranslation();

  if (Products?.length == 0) {
    return null;
  }
  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box>
        <SectionHeading
          title={t("Top-Rated-Foods")}
          highlightText={t("Foods")}
          showMore={true}
          showMoreLink="/products"
          subtitle={t(
            "You're-looking-at-a-great-source-of-vitamins,-potassium,-and-fiber"
          )}
          imageId={1}
        />
      </Box>
      <Box>
        <Swiper
          spaceBetween={1}
          navigation={{ clickable: true }}
          modules={[Pagination, Navigation]}
          className="paddingY8"
          breakpoints={{
            375: {
              slidesPerView: 2,
            },
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 2,
            },
            1440: {
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
          {Products &&
            Products?.map((Product, index) => {
              return (
                <SwiperSlide key={index} className="my-swiper-slide paddingX4">
                  <ProductCard Product={Product} />
                </SwiperSlide>
              );
            })}
        </Swiper>
      </Box>
    </Box>
  );
};

export default Products;
