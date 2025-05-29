import React, { useState } from "react";
import { CardMedia } from "@mui/material";
import { Box, Button, Grid, Typography, useTheme } from "@mui/joy";
import { RiErrorWarningFill } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { formatePrice } from "@/helpers/functionHelpers";

const PromoCard = ({ promoCode, currency, onApplyPromoCode }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.darkMode.value);

  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const handleApplyPromoCode = async () => {
    try {
      const response = await onApplyPromoCode(promoCode);

      if (!response.error) {
        setIsPromoApplied(false);
      }
    } catch (error) {
      console.error("Error applying promo code:", error);
    }
  };
  

  return (
    <Grid
      container
      sx={{
        height: "270px",
        width: "100%",
        borderRadius: "md",
        padding: 2,
        marginBottom: 4,
        bgcolor:
          themeMode == "dark"
            ? theme.palette.background.body
            : theme.palette.primary[50],
      }}
    >
      <Grid
        xs={8}
        sx={{
          borderRight: `3px dashed ${
            themeMode == "dark" ? theme.palette.background.surface : "white"
          }`,
        }}
      >
        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <Box sx={{ width: "25%", ml: -1 }}>
            <CardMedia
              component="img"
              alt="Promo Image"
              image={promoCode?.image}
              sx={{
                borderRadius: "10%",
                height: "100%",
                width: "100%",
                maxWidth: "400px",
                objectFit: "container",
              }}
            />
          </Box>
          <Box sx={{ width: "75%" }}>
            <Typography
              component="h1"
              sx={{
                marginLeft: "16px",
                display: "flex",
                alignItems: "center",
                height: "30px",
                wordWrap: "break-word",
                whiteSpace: "normal",
                fontWeight: "bold",
              }}
            >
              {promoCode?.promo_code}
            </Typography>
            <Typography
              sx={{
                marginLeft: "16px",
                display: "flex",
                alignItems: "center",
                wordWrap: "break-word",
                whiteSpace: "normal",
              }}
            >
              {promoCode?.message}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{ fontSize: { xs: "xs", sm: "sm" } }}
            display={"flex"}
            gap={1}
          >
            {t("minimum-order-value")}:
            <Typography
              sx={{
                color: theme.palette.text.currency,
                fontWeight: "bold",
                fontSize: { xs: "xs", sm: "sm" },
              }}
            >
              {formatePrice(promoCode?.min_order_amt)}
            </Typography>
          </Box>
          <Box
            sx={{ fontSize: { xs: "xs", sm: "sm" } }}
            display={"flex"}
            gap={1}
          >
            {t("maximum-discount")}
            <Typography
              sx={{
                color: theme.palette.text.currency,
                fontWeight: "bold",
                fontSize: { xs: "xs", sm: "sm" },
              }}
            >
              {formatePrice(promoCode?.max_discount_amt)}
            </Typography>
          </Box>
          <Box
            sx={{ fontSize: { xs: "xs", sm: "sm" } }}
            display={"flex"}
            gap={1}
          >
            {t("offer-starts-from")}:
            <Typography
              sx={{ fontWeight: "bold", fontSize: { xs: "xs", sm: "sm" } }}
            >
              {" "}
              {promoCode?.start_date}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              fontSize: "md",
              gap: 0.5,
              fontSize: { xs: "xs", sm: "sm" },
            }}
          >
            <RiErrorWarningFill />
            <Typography
              sx={{
                fontWeight: "bold",
                color: theme.palette.primary[600],
                fontSize: { xs: "xs", sm: "sm" },
              }}
            >
              {promoCode?.remaining_days}*
            </Typography>
            {t("days-remaining-hurry-up")}
          </Box>
        </Box>
      </Grid>

      <Grid
        xs={1}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box
          width={"50px"}
          height={"25px"}
          sx={{
            borderRadius: "0 0 25px 25px",
            transform: "translate(-50%, -65%)",
            backgroundColor:
              themeMode == "dark" ? theme.palette.background.surface : "white",
          }}
        />
        <Box
          sx={{
            width: "50px",
            backgroundColor:
              themeMode == "dark" ? theme.palette.background.surface : "white",
            height: "25px",
            borderRadius: "25px 25px 0 0",
            transform: "translate(-50%, 65%)",
          }}
        />
      </Grid>

      <Grid
        xs={3}
        py={4}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            marginBottom={1}
            sx={{
              fontWeight: "md",
              fontSize: { xs: "xl2", sm: "xl4" },
              color:
                themeMode == "dark"
                  ? theme.palette.text.white
                  : theme.palette.text.black,
              display: "flex",
              whiteSpace: "nospace",
            }}
          >
            {promoCode?.discount}
            {promoCode?.discount_type == "amount" ? currency : "%"}
          </Typography>
          <Typography
            marginBottom={1}
            sx={{
              fontWeight: "md",
              fontSize: { xs: "xl2", sm: "xl4" },
              color:
                themeMode == "dark"
                  ? theme.palette.text.white
                  : theme.palette.text.black,
              display: "flex",
              whiteSpace: "nospace",
            }}
          >
            {t("off")}
          </Typography>
        </Box>

        <Button
          variant="solid"
          onClick={handleApplyPromoCode}
          disabled={isPromoApplied}
          sx={{
            width: "80%",
            textTransform: "none",
            color: theme.palette.text.white,
            "&:hover": {},
          }}
        >
          {isPromoApplied ? "applied" : "Apply"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default PromoCard;
