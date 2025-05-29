import React, { useLayoutEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Box, Card } from "@mui/joy";
import SectionHeading from "@/component/SectionHeading/SectionHeading";
import OffersCard from "@/component/Cards/OffersCard";
import { useSelector } from "react-redux";
import { t } from "i18next";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const Sliders = useSelector((state) => state?.homepage?.offers);
  useLayoutEffect(() => {
    setOffers(Sliders);
  }, [Sliders]);

  return (
    <>
      {offers.length > 0 && (
        <Box display={"flex"} flexDirection={"column"} gap={1} mb={5}>
          <Box>
            <SectionHeading
              title={t("Best-Offer-For-You")}
              highlightText="Offer"
              showMore={true}
              showMoreLink="/offers"
              subtitle={t(
                "Feast-on-savings!-Explore-exclusive-online-deals.-🍔🍕-#FoodieSavings"
              )}
              imageId={5}
            />
          </Box>
          <Box>
            <Swiper
              spaceBetween={10}
              loop={true}
              navigation={{ clickable: true }}
              modules={[Autoplay, Pagination, Navigation]}
              autoplay={{ delay: 3000 }}
              className="paddingY8"
              breakpoints={{
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
                  slidesPerView: 4,
                },
                1445: {
                  slidesPerView: 5,
                },
                1545: {
                  slidesPerView: 7,
                },
              }}
            >
              <Card>
                {offers.length > 0 &&
                  offers?.map((imagedata, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <Box
                          width={{ xs: 150, md: 200 }}
                          height={{ xs: 200, md: 250 }}
                        >
                          <OffersCard imagedata={imagedata} />
                        </Box>
                      </SwiperSlide>
                    );
                  })}
              </Card>
            </Swiper>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Offers;
