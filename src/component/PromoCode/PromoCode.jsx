import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPromoCode } from "@/store/reducers/promoCodeSlice";
import {
  Box,
  Button,
  CardActions,
  Drawer,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from "@mui/joy";
import { RiArrowRightDoubleFill, RiCoupon2Line } from "@remixicon/react";
import { get_promo_codes, validate_promo_code } from "@/interceptor/api";
import toast from "react-hot-toast";
import PromoCard from "./PromoCard";
import { t } from "i18next";
import { styled } from "@mui/joy/styles";

const CustomDrawerContent = styled("div")(({ theme }) => ({
  background: theme.palette.background.default,
  color: theme.palette.text.primary,
  maxWidth: "700px",
  width: "100%",
  height: "100%",
  overflowY: "auto",
  boxSizing: "border-box",
}));

const PromoCode = () => {
  const dispatch = useDispatch();
  const partner_id = useSelector(
    (state) =>
      state.cart.data[0]?.product_details[0]?.partner_details[0]?.partner_id
  );
  const themeMode = useSelector((state) => state.darkMode.value);

  const settings = useSelector((state) => state.settings.value);
  const currency = settings.currency[0];
  const promo = useSelector((state) => state.promoCode.value);
  const PreTotal = useSelector((state) => state.cart.overall_amount);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [promoCodes, setPromoCodes] = useState();
  const theme = useTheme();

  const handleViewAllClick = async () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const fetchPromoCodes = async (partner_id) => {
    try {
      const response = await get_promo_codes(partner_id);
      if (response.error) {
        if (process.env.NODE_ENV === "production") {
          toast.error(response.message);
        } else {
          console.error(response.message); // Log the error to console in local environment
        }
      } else {
        setPromoCodes(response?.data);
        // toast.success(response.message);
      }
    } catch (error) {
      console.error("error to fetch promoCodes", error); // Log any unexpected errors
    }
  };

  const validatePromoCode = async (promoCode) => {
    try {
      let promo_code = promoCode?.promo_code;
      let final_total = PreTotal;
      const finalPromo = await validate_promo_code(
        promo_code,
        final_total,
        partner_id
      );

      // Check if the promo code is valid
      if (!finalPromo.error) {
        toast.success(t("promo-code-applied-successfully"));

        dispatch(setPromoCode(finalPromo.data));
        // setPromoApplied(true);
        // Extract final total and update the UI
        let newGrandTotal = finalPromo.data[0].final_total;
        // setFinalTotal2(newGrandTotal);

        setIsDrawerOpen(false);
      } else {
        // setPromoApplied(false);
        toast.error(finalPromo?.message);
      }

      return finalPromo;
    } catch (error) {
      console.log("Error validating promo code:", error);
      //   setPromoApplied(false);
    }
  };

  useEffect(() => {
    fetchPromoCodes(partner_id);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Box
        sx={{
          borderRadius: "sm",
          backgroundColor: theme.palette.background.surface,
        }}
        className="boxShadow"
        p={2}
      >
        <CardActions
          orientation="horizontal"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"start"}
            gap={1}
          >
            <RiCoupon2Line color={theme.palette.text.primary} />
            <Typography
              textColor={
                theme.palette.mode === "light"
                  ? "text.menuText"
                  : "text.secondary"
              }
              sx={{ fontSize: { xs: "sm", md: "md" } }}
              fontWeight={"lg"}
            >
              {t("add-promoCode")}
            </Typography>
          </Box>

          <Typography
            color={"primary"}
            sx={{
              fontSize: { xs: "sm", md: "md", cursor: "pointer" },
            }}
            fontWeight={"xl"}
            onClick={handleViewAllClick}
          >
            {t("view-all")}
          </Typography>
        </CardActions>
        {promo && promo.length > 0 && (
          <CardActions
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: `2px dashed ${theme.palette.background.tooltip}`,
              bgcolor: theme.palette.background.bredCrump,
              padding: "8px 16px",
              marginTop: "8px",
            }}
          >
            <Box>
              <Box flexDirection={"column"} gap={1}>
                <Typography
                  sx={{ fontWeight: "lg", color: theme.palette.text.primary }}
                >
                  {" "}
                  Grab {promo[0].discount} % OFF
                </Typography>
              </Box>

              <Box display={"flex"} alignItems={"center"} gap={1}>
                <Typography sx={{ color: theme.palette.text.primary }}>
                  {promo[0].promo_code}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="plain"
              sx={{
                color: theme.palette.danger[500],
                "&:hover": {
                  backgroundColor: "transparent", // Set transparent background on hover
                },
              }}
              onClick={() => dispatch(setPromoCode([]))}
            >
              {t("remove")}
            </Button>
          </CardActions>
        )}
      </Box>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        role="presentation"
        sx={{
          "& .MuiDrawer-paper": {
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
            maxWidth: "100px !important", // Set your desired maximum width here
            width: "100% !important", // This ensure
          },
        }}
      >
        {" "}
        <CustomDrawerContent>
          <Grid container spacing={2} padding={2}>
            <Grid xs={12} display="flex" justifyContent="flex-start" ml={-2}>
              <IconButton
                onClick={() => setIsDrawerOpen(false)}
                sx={{
                  color: "#333",
                }}
              >
                <RiArrowRightDoubleFill
                  size={32}
                  color={themeMode == "dark" ? "white" : "black"}
                />
              </IconButton>
            </Grid>
            <Grid xs={12}>
              <Typography
                level="h3"
                sx={{ fontWeight: 500, fontSize: "1.25rem " }}
              >
                {t("promoCode")}
              </Typography>
            </Grid>
            <Grid xs={12}>
              {promoCodes?.length > 0 ? (
                promoCodes?.map((promoCode) => (
                  <PromoCard
                    key={promoCode?.id}
                    promoCode={promoCode}
                    onApplyPromoCode={validatePromoCode}
                    currency={currency}
                  />
                ))
              ) : (
                <Box mb={2}>
                  <Typography
                    textAlign={"center"}
                    sx={{ fontWeight: 500, fontSize: "1.25rem " }}
                  >
                    {t("not-promo-codes-available")}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </CustomDrawerContent>
      </Drawer>
    </>
  );
};

export default PromoCode;
