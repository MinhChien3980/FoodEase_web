import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Typography,
  useTheme,
} from "@mui/joy";
import {
  RiAddCircleFill,
  RiDeleteBin5Line,
  RiShoppingBag3Line,
} from "@remixicon/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SingleCartItem from "./SingleCartItem";
import { useRouter } from "next/router";
import { clearUserCart } from "@/events/actions";
import { useTranslation } from "react-i18next";
import Link from "next/link";

const CartItems = () => {
  const theme = useTheme();

  const CartData = useSelector((state) => state.cart.data);
  const partner_details =
    CartData?.[0]?.product_details?.[0]?.partner_details?.[0];
  const router = useRouter();
  const { t } = useTranslation();

  const [iconSize, setIconSize] = useState(20);

  useEffect(() => {
    const handleResize = () => {
      setIconSize(window.innerWidth < 600 ? 16 : 24);
    };

    handleResize(); // Check the initial screen size
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClick = () => {
    router.push("/products");
  };

  return (
    <Box
      className="boxShadow"
      sx={{
        borderRadius: "sm",
        backgroundColor: theme.palette.background.surface,
      }}
      p={2}
    >
      <Grid container direction="column">
        <Grid
          xs={12}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Box>
            <Typography
              variant="h1"
              fontWeight={"xl"}
              sx={{
                color: theme.palette.text.primary,
                fontSize: { xs: "xs", sm: "md" },
              }}
              startDecorator={<RiShoppingBag3Line size={iconSize} />}
            >
              {t("food-in-your-bag")}
            </Typography>

            <Typography
              component={Link}
              href={`/restaurants/${partner_details.slug}`}
              sx={{ fontSize: { xs: "xs", md: "sm" }, ml: 4 }}
            >
              {t("From")}:
              <Box component="span" ml={0.5}>
                {partner_details.partner_name}
              </Box>
            </Typography>
          </Box>
          <Button
            onClick={() => clearUserCart()}
            variant="plain"
            sx={{
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <Typography
              variant="h1"
              fontWeight={"xl"}
              sx={{
                color: theme.palette.danger[600],
                fontSize: { xs: "xs", sm: "md" },
              }}
              startDecorator={<RiDeleteBin5Line size={iconSize} />}
            >
              {t("clear-cart")}
            </Typography>
          </Button>
        </Grid>
        <Divider sx={{ my: 1 }} />
        <Grid xs={12}>
          {CartData?.map((item, index) => (
            <Box key={index}>
              <SingleCartItem item={item} />
              <Divider sx={{ my: 1 }} />
            </Box>
          ))}
        </Grid>
        <Grid xs={12}>
          <Button
            variant="plain"
            sx={{
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
            onClick={handleClick}
          >
            <Typography
              variant="h1"
              fontWeight={"xl"}
              textAlign={"center"}
              sx={{
                color: theme.palette.danger[600],
                fontSize: { xs: "sm", sm: "md" },
              }}
              startDecorator={<RiAddCircleFill />}
            >
              {t("add-more-food-in-your-cart")}
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartItems;
