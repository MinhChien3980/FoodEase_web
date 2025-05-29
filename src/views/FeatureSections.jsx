import { Box, Grid, Typography } from "@mui/joy";
import React, { useState, useEffect } from "react";
import SectionHeading from "@/component/SectionHeading/SectionHeading";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "swiper/css/navigation";
import theme from "@/theme";
import ProductCard2 from "@/component/Cards/ProductCard2";
import ProductCard from "@/component/Cards/ProductCard";

const FeatureSections = () => {
  const sections = useSelector((state) => state?.homepage?.sections);

  return (
    <Box display={"flex"} flexDirection={"column"} gap={1} mb={5}>
      {Array.isArray(sections) &&
        sections.map((data, sectionIndex) => {
          const { product_details, product_tags, title, short_description } =
            data;
          let slug = data.slug;

          const swiperParams = {
            spaceBetween: 10,
            pagination: { clickable: true, dynamicBullets: true },
            navigation: { clickable: true },
            modules: [Autoplay, Pagination, Navigation],
            className: "paddingY8",
            breakpoints: {
              300: { slidesPerView: 1 },
              370: { slidesPerView: 2 },
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 3 },
              1440: { slidesPerView: 4 },
              1545: { slidesPerView: 5 },
            },
          };

          // Only enable loop and autoplay if there are more than 5 products
          if (product_details.length > 5) {
            swiperParams.loop = true;
            swiperParams.autoplay = { delay: 3000 };
          }

          return (
            <Box key={sectionIndex}>
              {product_details.length > 0 && (
                <Box>
                  <SectionHeading
                    title={title}
                    highlightText=""
                    showMore={true}
                    showMoreLink={"/exclusiveProducts/" + slug}
                    subtitle={short_description}
                    imageId={3}
                  />
                  <Grid
                    gap={4}
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: { xs: 1, md: 2 },
                      paddingLeft: "2%",
                    }}
                  >
                    {product_tags.map((tag, tagIndex) => (
                      <Grid xs={0} md={2} lg={1} key={tagIndex}>
                        <Typography
                          sx={{
                            color: theme.palette.primary[600],
                            fontSize: { xs: "xs", md: "md" },
                          }}
                        >
                          #{tag}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>

                  <Swiper {...swiperParams}>
                    {product_details.map((Product, productIndex) => (
                      <SwiperSlide key={productIndex}>
                        <ProductCard2
                          Product={Product}
                          is_section_product={true}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Box>
              )}
            </Box>
          );
        })}
    </Box>
  );
};

export default FeatureSections;
