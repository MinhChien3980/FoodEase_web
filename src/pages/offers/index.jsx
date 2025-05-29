import { useEffect, useState } from "react";
import { getOffers } from "@/interceptor/api";
import { Box, Button, Grid, Typography, useTheme } from "@mui/joy";
import React from "react";
import OffersCard from "@/component/Cards/OffersCard";
import dynamic from "next/dynamic";
const BreadCrumb = dynamic(() => import("@/component/BreadCrumps/BreadCrumb"), {
  ssr: false,
});
import { HeadTitle } from "@/component/HeadTitle";
import { useTranslation } from "react-i18next";
import { CardMedia } from "@mui/material";
import OfferSkeleton from "../../component/Skeleton/OfferSkeleton";
import * as fbq from "@/lib/fpixel";

const Index = () => {
  const [offers, setOffers] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalOffers, setTotalOffers] = useState(0);
  const [showLess, setShowLess] = useState(false);
  const [fetchedDataCount, setFetchedDataCount] = useState(0);
  const [showMore, setShowMore] = useState(true);
  const limit = 6;

  const theme = useTheme();

  const { t } = useTranslation();

  useEffect(() => {
    fetchOffers();
    fbq.customEvent("offers-page-view");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setShowLess(offers.length > limit);
    setShowMore(offers.length < totalOffers);
  }, [offers, totalOffers]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const offersData = await getOffers({ offset, limit });
      const newOffers = offersData?.data || [];
      setFetchedDataCount(newOffers.length);
      const totalOffers = offersData?.total || 0;

      if (offset == 0) {
        setOffers(newOffers);
        setTotalOffers(totalOffers);
      } else {
        setOffers((prevOffers) => {
          const filteredNewOffers = newOffers.filter((newOffer) => {
            return !prevOffers.some(
              (prevOffer) => prevOffer.id === newOffer.id
            );
          });
          return [...prevOffers, ...filteredNewOffers];
        });
        setTotalOffers(totalOffers);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = () => {
    setOffset((prevOffset) => {
      const newOffset = prevOffset + limit;
      fetchOffers({ offset: newOffset, limit });
      return newOffset;
    });
    setShowLess(true);
  };

  const handleShowLess = () => {
    setOffers((prevOffers) => prevOffers.slice(0, -fetchedDataCount));
    if (limit > fetchedDataCount) {
      setFetchedDataCount(limit);
    }
    setOffset((prevOffset) => Math.max(prevOffset - limit, 0));
  };

  return (
    <>
      <HeadTitle title={"Offers"} />
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        flexDirection={"column"}
        gap={4}
        mb={4}
        sx={{ height: "100%", width: "100%" }}
      >
        <BreadCrumb />
        {!loading ? (
          <>
            {offers?.length != 0 ? (
              <>
                <Grid
                  container
                  display={"flex"}
                  alignItems={"center"}
                  spacing={2}
                  justifyContent={"start"}
                >
                  {offers?.map((imagedata, index) => (
                    <Grid
                      xs={6}
                      sm={3}
                      md={4}
                      lg={2}
                      xl={1.5}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      key={index}
                    >
                      <Box
                        key={index}
                        width={{ xs: 150, md: 200 }}
                        height={{ xs: 200, md: 250 }}
                      >
                        <OffersCard imagedata={imagedata} />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                {/* <Box className="flexProperties" sx={{ gap: 2 }}>
              {showMore && (
                <Button onClick={handleShowMore} sx={{ mb: 2 }}>
                  {t("show-more")}
                </Button>
              )}
              {showLess && (
                <Button
                  variant="outlined"
                  onClick={handleShowLess}
                  sx={{ mb: 2 }}
                >
                  {t("show-less")}
                </Button>
              )}
            </Box> */}
              </>
            ) : (
              <Box
                width={"100%"}
                height={"100%"}
                display="flex"
                flexDirection={"column"}
                alignItems="center"
                justifyContent="center"
              >
                <CardMedia
                  component="img"
                  image="/assets/images/emptyCartIcon.svg"
                  alt="Empty Cart"
                  sx={{ width: "100%", maxWidth: 250 }}
                />
                <Typography
                  textAlign={"center"}
                  variant="h6"
                  sx={{ color: theme.palette.text.primary, fontSize: "xl" }}
                >
                  {t("no-offer-text")}
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <Box>
            <OfferSkeleton />
          </Box>
        )}
      </Box>
    </>
  );
};

export default Index;
