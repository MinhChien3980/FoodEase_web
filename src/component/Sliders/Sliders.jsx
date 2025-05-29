import React, { useState, useLayoutEffect } from "react";
import { Box, Card, CardCover, Typography, CardContent } from "@mui/joy";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "swiper/css/navigation";
import { useTranslation } from "react-i18next";
import { RiArrowRightCircleFill, RiContractRightLine } from "@remixicon/react";
import { formatePrice } from "@/helpers/functionHelpers";

const Sliders = () => {
  const [sliders, setSliders] = useState([]);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const settings = useSelector((state) => state.settings.value);
  const Sliders2 = useSelector((state) => state?.homepage?.sliders);
  const { t } = useTranslation();

  useLayoutEffect(() => {
    if (Sliders2 !== sliders) {
      setSliders(Sliders2);
      setLoopEnabled(Sliders2 && Sliders2.length > 1);
    }
  }, [Sliders2]);

  if (!sliders || sliders.length === 0) {
    return null; // Or return a placeholder/loading component
  }

  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      pagination={{ clickable: true, dynamicBullets: true }}
      loop={loopEnabled}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      autoplay={loopEnabled ? { delay: 3000 } : false}
      className="borderRadiusXl"
    >
      {sliders.map((slider, index) => {
        let link = "#";
        if (
          slider.type === "categories" &&
          slider.data &&
          slider.data.length > 0
        ) {
          link = "/categories/" + slider.data[0].slug;
        } else if (
          slider.type === "products" &&
          slider.data &&
          slider.data.length > 0
        ) {
          link = "/products/" + slider.data[0].slug;
        }
        return (
          <SwiperSlide key={index}>
            <Link href={link || "#"}>
              <Card sx={{ minHeight: { xs: 150, md: 472 } }}>
                <CardCover sx={{ minHeight: "100%" }}>
                  <Box
                    component="img"
                    src={slider.image}
                    srcSet={slider.image}
                    effect="blur"
                    loading="lazy"
                    alt={slider.image}
                    sx={{ width: "auto", height: "100%", objectFit: "cover" }}
                  />
                </CardCover>
                <CardCover
                  sx={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
                  }}
                />
                <CardContent sx={{ justifyContent: "flex-end" }}>
                  <Typography
                    level="title-lg"
                    textColor="neutral.300"
                    fontSize={{ xs: "sm", sm: "md" }}
                  >
                    {slider?.data[0]?.name}
                  </Typography>
                  {slider?.data[0]?.min_max_price?.special_price ? (
                    <Typography
                      textColor="neutral.300"
                      fontSize={{ xs: "xs", sm: "md" }}
                    >
                      {formatePrice(
                        slider?.data[0]?.min_max_price?.special_price
                      )}
                    </Typography>
                  ) : (
                    <Typography
                      fontSize={{ xs: "sm", sm: "md" }}
                      display={slider.type === "default" ? "none" : ""}
                      endDecorator={<RiContractRightLine size={20} />}
                      textColor="neutral.300"
                    >
                      {t("view-product")}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default Sliders;
