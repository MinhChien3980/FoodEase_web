import { isLogged } from "@/events/getters";
import { Box, Button, Typography } from "@mui/joy";
import { useRouter } from "next/router";
import React from "react";

const CartToastButton = () => {
  const router = useRouter();
  const viewCartHandler = () => {
    if (isLogged()) router.push("/cart");
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography>Item added to cart</Typography>
      <Button
        variant="plain"
        sx={{
          "&:hover": {
            bgcolor: "transparent",
          },
        }}
        onClick={() => viewCartHandler()}
      >
        View Cart
      </Button>
    </Box>
  );
};

export default CartToastButton;
