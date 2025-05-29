import { Box, Typography, Button, tabClasses, Grid } from "@mui/joy";
import React from "react";
import { useTheme } from "@mui/joy";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const FirstFreeDelivery = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const app_name = useSelector((state) => state.settings)?.value
    ?.system_settings?.[0]?.app_name;

  const orderNowText = t("order-now-text").replace("Erestro", app_name);
  const welcomeSentence = t("erestro-welcomes").replace("Erestro", app_name);

  return (
    <Grid
      container
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        padding: 0,
        borderRadius: "10px",

        overflow: "hidden",
      }}
    >
      <Grid
        xs={8}
        sx={{
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "xs", sm: "lg", md: "xl" },
            fontWeight: "bold",
            color: theme.palette.primary[600],
            mb: { xs: 0, md: 2 },
          }}
        >
          {t("welcome-offer")}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "xs", sm: "lg", lg: "xl2", xl: "xl4" },
            fontWeight: "bold",
            lineHeight: { xs: 1, sm: 1.2 },
            color: theme.palette.text.primary,
            whiteSpace: { xs: "none", sm: "nowrap" },
          }}
        >
          {welcomeSentence}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "xs", sm: "md", lg: "lg", xl: "xl" },
            fontWeight: "bold",
            lineHeight: 1,
            color: theme.palette.text.primary,
            display: { xs: "none", sm: "block" },
          }}
        >
          {orderNowText}
        </Typography>
        <Typography fontSize={{ xs: "0.4rem", sm: "0.8rem" }}>
          {t("terms-conditions-for-free")}
        </Typography>
      </Grid>
      <Grid xs={4} display={"flex"} justifyContent={"end"}>
        <Box
          component={"img"}
          src={"/assets/images/FirstFreeDelivery.svg"}
          alt="Free delivery"
          height={"100%"}
          width={{ xs: 100, sm: 150, lg: 350 }}
          sx={{ zIndex: 1, objectFit: "contain" }}
        />
      </Grid>
    </Grid>
  );
};

export default FirstFreeDelivery;
