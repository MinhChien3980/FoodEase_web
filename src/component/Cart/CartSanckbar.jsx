import * as React from "react";
import Snackbar from "@mui/joy/Snackbar";
import { keyframes } from "@mui/system";
import { Button, Typography, useTheme } from "@mui/joy";
import { useRouter } from "next/router";
import { isLogged } from "@/events/getters";
import { useDispatch, useSelector } from "react-redux";
import { setSanckbar, setDrawerOpen } from "@/store/reducers/cartSlice"; // Import the new action
import { RiCheckboxCircleFill } from "@remixicon/react";
import { useTranslation } from "react-i18next";

const inAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const outAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
`;

export default function CartSnackbar() {
  const snackbarState = useSelector((state) => state.cart.snackbar);
  const dispatch = useDispatch();
  const router = useRouter();

  const animationDuration = 600;
  const autoHide = 4000;

  const viewCartHandler = () => {
    if (isLogged()) {
      router.push("/cart");
    } else {
      dispatch(setDrawerOpen(true));
    }
    setTimeout(() => {
      dispatch(setSanckbar(false));
    }, 1000);
  };
  const { t } = useTranslation();
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={snackbarState}
      autoHideDuration={autoHide}
      transitioncomponent={{
        enter: inAnimation,
        exit: outAnimation,
        duration: animationDuration,
      }}
      onClose={() => dispatch(setSanckbar(false))}
      startDecorator={
        <Typography
          sx={{ fontSize: "md", fontWeight: "md" }}
          startDecorator={<RiCheckboxCircleFill color="green" />}
        >
          {t("Item-added-to-cart")}
        </Typography>
      }
      endDecorator={
        <Button
          variant="plain"
          color="primary"
          sx={{
            "&:hover": {
              bgcolor: "transparent",
            },
            fontSize: "md",
            fontWeight: "md",
          }}
          onClick={viewCartHandler}
        >
          {t("view-cart")}
        </Button>
      }
      sx={{
        position: "fixed",
        bottom: 12,
      }}
    />
  );
}
