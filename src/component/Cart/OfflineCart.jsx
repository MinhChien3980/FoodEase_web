import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Drawer,
  IconButton,
  Typography,
  useTheme,
  Button,
} from "@mui/joy";
import { RiArrowLeftDoubleLine, RiShoppingCart2Line } from "@remixicon/react";
import { useDispatch, useSelector } from "react-redux";
import OfflineCartItem from "./OfflineCartItem";
import { CardMedia } from "@mui/material";
import { useTranslation } from "react-i18next";
import { clearOfflineCart } from "@/events/actions";
import { setDrawerOpen } from "@/store/reducers/cartSlice";

const OfflineCart = ({ label = false }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const offlineCart = useSelector((state) => state.cart.offline_cart);
  const isDrawerOpen = useSelector((state) => state.cart.isDrawerOpen);
  const [cartState, setCartState] = useState([]);
  let cartItemsCount = offlineCart?.length;

  useEffect(() => {
    setCartState(offlineCart);
  }, [offlineCart]);

  const toggleDrawer = (open) => () => {
    dispatch(setDrawerOpen(open));
  };

  return (
    <>
      {label ? (
        <Box
          component="div"
          onClick={toggleDrawer(true)}
          sx={{
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          <Typography
            sx={{ fontSize: "md", fontWeight: "lg" }}
            startDecorator={
              <Badge badgeContent={cartItemsCount}>
                <RiShoppingCart2Line color={theme.palette.text.primary} />
              </Badge>
            }
          >
            {t("cart")}
          </Typography>
        </Box>
      ) : (
        <Badge badgeContent={cartItemsCount} variant="solid" size="sm">
          <RiShoppingCart2Line
            color={theme.palette.text.primary}
            onClick={toggleDrawer(true)}
            className="cursor"
          />
        </Badge>
      )}

      <Box width={"100%"}>
        <Drawer
          anchor="right"
          open={isDrawerOpen} // Use Redux state to control drawer visibility
          onClose={toggleDrawer(false)}
          role="presentation"
        >
          <Box width={"100%"} p={2}>
            <Box sx={{ width: "100%", position: "relative", marginBottom: 8 }}>
              <IconButton
                onClick={toggleDrawer(false)}
                sx={{ position: "absolute", top: 0, left: 0 }}
              >
                <RiArrowLeftDoubleLine size={32} />
              </IconButton>
            </Box>

            {cartState && cartState.length !== 0 ? (
              <>
                {cartState.map((item, index) => (
                  <Box key={index}>
                    <OfflineCartItem item={item} />
                  </Box>
                ))}
                <Box p={2} className="flexProperties">
                  <Button
                    sx={{ width: "100%" }}
                    color="primary"
                    onClick={() => clearOfflineCart()}
                  >
                    {t("clear-cart")}
                  </Button>
                </Box>
              </>
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                width="100%"
                height="100%"
                p={4}
              >
                <CardMedia
                  component="img"
                  image="/assets/images/emptyCartIcon.svg"
                  alt="Empty Cart"
                  sx={{ width: "50%" }}
                />
                <Typography
                  component="h1"
                  textAlign="center"
                  sx={{ fontWeight: "xl2", fontSize: "xl2" }}
                >
                  {t("no-order-yet")}
                </Typography>
                <Typography fontWeight="sm" fontSize="md" textAlign="center">
                  {t("Looks-like-you-haven't-made-your-choice-yet")}
                </Typography>
              </Box>
            )}
          </Box>
        </Drawer>
      </Box>
    </>
  );
};

export default OfflineCart;
