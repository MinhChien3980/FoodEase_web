import { Button, Grid, Typography, Box, useTheme } from "@mui/joy";
import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Highlighter from "react-highlight-words";
import { useSelector } from "react-redux";
const Services = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const app_name = useSelector((state) => state.settings)?.value
    ?.system_settings?.[0]?.app_name;

  const originalText = t("Why-Choose-eRestro-for-Your-Food-Delivery?");

  // Replace "eRestro" with the value of app_name
  const dynamicText = originalText.replace("eRestro", app_name);

  return (
    <>
      <Grid
        container
        spacing={0}
        justifyContent="center"
        alignItems="center"
        width={"100%"}
      >
        <Grid xs={12} mb={6}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection={{ xs: "column", md: "row" }}
          >
            <Box
              ml={0}
              px={0}
              display="flex"
              flexDirection="column"
              maxWidth={{ xs: "100%", md: "100%" }}
              order={{ xs: 1, md: 0 }}
            >
              <Typography
                className="fontWeight800"
                mb={2}
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: {
                    xs: "1.5rem",
                    md: "var(--joy-fontSize-xl4, 2.25rem)",
                  },
                }}
              >
                <Highlighter
                  highlightClassName="highlight"
                  highlightStyle={{
                    backgroundColor: "transparent",
                    color: theme.palette.primary[600],
                  }}
                  searchWords={[t("food")]}
                  autoEscape={true}
                  textToHighlight={t("your-partner-text")}
                />
              </Typography>
              <Typography
                mb={3}
                variant="subtitle1"
                sx={{
                  color: theme.palette.text.primary,

                  fontSize: { xs: "md", md: "lg" },
                }}
              >
                {t(
                  "Ordering-in-is-convenient-for-your-customers-and-more-of-them-are-choosing-to-order-in-as-the-days-go-by.-While-it-works-great-for-the-customers,-delivering-food-can-be-a-real-hassle-for-your-business"
                )}
              </Typography>
              <Typography
                mb={4}
                variant="subtitle1"
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: { xs: "md", md: "lg" },
                }}
              >
                {t(
                  "The-best-we-know-is-that-orders-usually-peak-during-the-lunch-rush-and-dinner-rush.-It's-still-difficult-to-know-how-many-deliveries-you-might-need-to-do-in-a-two-to-four-hour-window-on-any-given-day"
                )}
              </Typography>
              {/* <Link href="/restaurants" passHref> */}
              <Link href="#">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent={{ xs: "start", md: "space-between" }}
                >
                  <Button
                    variant="soft"
                    color="primary"
                    className="learn-more"
                    sx={{
                      color: theme.palette.text.primary,
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                      position: "relative",
                      display: "inline-block",
                      cursor: "pointer",
                      outline: "none",
                      border: 0,
                      verticalAlign: "middle",
                      textDecoration: "none",
                      background: "transparent",
                      padding: 0,
                      fontSize: "inherit",
                      fontFamily: "inherit",
                      width: { xs: "100%", md: "10rem" },
                      height: "auto",
                    }}
                  >
                    <span className="circle">
                      <span className="icon arrow"></span>
                    </span>
                    <span className="button-text">{t("order-now")}</span>
                  </Button>
                </Box>
              </Link>
            </Box>
            <Box
              component="img"
              src="/assets/images/partner.png"
              sx={{
                width: { xs: "100%", md: "700px" },
                height: "auto",
                objectFit: "contain",
                mt: { xs: 2, md: 0 },
                order: { xs: 0, md: 1 },
              }}
            />
          </Box>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        width={"100%"}
      >
        <Grid
          className="flexProperties"
          xs={12}
          sx={{ textAlign: "center", mb: 4 }}
        >
          <Typography
            className="fontWeight800"
            sx={{
              color: theme.palette.text.primary,
              fontSize: {
                xs: "var(--joy-fontSize-xl2, 1.5rem)",
                md: "var(--joy-fontSize-xl3, 1.875rem)",
                xl: "var(--joy-fontSize-xl4, 2.25rem)",
              },
            }}
          >
            <Highlighter
              highlightClassName="highlight"
              highlightStyle={{
                backgroundColor: "transparent",
                color: theme.palette.primary[600],
              }}
              searchWords={[app_name]}
              autoEscape={true}
              textToHighlight={dynamicText}
            />
          </Typography>
        </Grid>

        <Grid
          container
          xs={12}
          md={4}
          direction="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          <Box
            component="img"
            src="/assets/images/easy-order.png"
            alt="order online"
            sx={{ width: "100%", maxWidth: "200px" }}
          />
          <Typography
            variant="h6"
            className="fontWeight800"
            sx={{
              color: theme.palette.text.primary,
              fontSize: {
                xs: "var(--joy-fontSize-xl, 1.25rem)",
                lg: "var(--joy-fontSize-xl3, 1.875rem)",
              },
            }}
          >
            {t("Easy-to-order")}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            {t("Easy-to-order,-whatever-you-want")}
          </Typography>
        </Grid>

        <Grid
          container
          xs={12}
          md={4}
          direction="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          <Box
            component="img"
            src="/assets/images/delivery-boy.png"
            alt="order online"
            sx={{ width: "100%", maxWidth: "200px" }}
          />
          <Typography
            className="fontWeight800"
            sx={{
              color: theme.palette.text.primary,
              fontSize: {
                xs: "var(--joy-fontSize-xl, 1.25rem)",
                lg: "var(--joy-fontSize-xl3, 1.875rem)",
              },
            }}
          >
            {t("Fastest-Delivery")}
          </Typography>
          <Typography
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            {t("Wouldn't-you-like-to-be-a-fastest-delivery-too?")}
          </Typography>
        </Grid>

        <Grid
          container
          xs={12}
          md={4}
          direction="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          <Box p={2}>
            <Box
              component="img"
              src="/assets/images/quality.png"
              alt="order online"
              sx={{ width: "100%", maxWidth: "200px" }}
            />
          </Box>
          <Typography
            className="fontWeight800"
            sx={{
              color: theme.palette.text.primary,
              fontSize: {
                xs: "var(--joy-fontSize-xl, 1.25rem)",
                lg: "var(--joy-fontSize-xl3, 1.875rem)",
              },
            }}
          >
            {t("Best-quality")}
          </Typography>
          <Typography
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            {t(
              "The-sweet-you-can-eat-between-meals-without-ruining-your-best-quality"
            )}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default Services;
