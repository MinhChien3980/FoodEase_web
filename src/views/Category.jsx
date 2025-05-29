"use client";
import { get_categories } from "@/interceptor/api";
import React, { useLayoutEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Box, Grid, Typography } from "@mui/joy";
import Highlighter from "react-highlight-words";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import CategoryCard from "@/component/Cards/CategoryCard";
import SectionHeading from "@/component/SectionHeading/SectionHeading";
import { updateHomeCategories } from "@/repository/home/home_repo";
import { useSelector } from "react-redux";
import CategoryCard2 from "@/component/Cards/CategoryCard2";
import { useTranslation } from "react-i18next";

const Category = () => {
  const [categories, setCategory] = useState([]);

  const homeCategories = useSelector((state) => state.homepage.categories);

  useLayoutEffect(() => {
    if (homeCategories !== categories) {
      setCategory(homeCategories); // Set sliders once when component mounts
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeCategories]);
  const { t } = useTranslation();

  if (categories?.length == 0) {
    return null;
  }
  return (
    <>
      <Box>
        <SectionHeading
          title={t("cuisine-crafted-with-care")}
          showMore={true}
          subtitle={t("Our-best-cuisine,-try-it,-you-will-like-it..")}
          highlightText={t("Cuisine")}
          showMoreLink="/categories"
          imageId={2}
        />
      </Box>
      <Box>
        <Swiper
          spaceBetween={1}
          loop={true}
          navigation={{ clickable: true }}
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 3000 }}
          className="paddingY8"
          breakpoints={{
            310: {
              slidesPerView: 2,
            },
            370: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 4,
            },
            1439: {
              slidesPerView: 7,
            },
            1545: {
              slidesPerView: 9,
            },
          }}
        >
          {categories &&
            categories.map((category, index) => {
              const { name, image, slug } = category;
              return (
                <Grid xs={3} md={1} key={index}>
                  <SwiperSlide key={index}>
                    <CategoryCard2 title={name} image={image} slug={slug} />
                  </SwiperSlide>
                </Grid>
              );
            })}
        </Swiper>
      </Box>
    </>
  );
};

export default Category;
