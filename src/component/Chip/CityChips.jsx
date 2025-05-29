import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Box, Chip } from "@mui/joy";
import { RiMapPin2Line } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import "swiper/css";

const CityChips = ({ cities = [], handleCityClick = () => {} }) => {
  const { t } = useTranslation();
  return (
    <Swiper spaceBetween={10} slidesPerView="auto" freeMode={true}>
      {cities.length > 0 &&
        cities?.map((city, index) => (
          <SwiperSlide key={index} className="height-width-auto">
            <Chip
              title={t("clickToSelectCity", {
                cityName: city.name,
              })}
              onClick={() => {
                handleCityClick(city);
              }}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                },
                padding: 1,
                paddingRight: 1.5,
                whiteSpace: "nowrap", // Prevent text wrapping
                display: "inline-flex", // Ensure proper inline display
              }}
              startDecorator={<RiMapPin2Line size={16} />}
              variant="outlined"
            >
              {city.name}
            </Chip>
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default CityChips;
