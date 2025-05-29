import React from "react";
import Image from "next/image";
import { Box } from "@mui/joy";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const FoodType = ({ foodIndicator }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const size = isSmallScreen ? 18 : 23; 

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      {(() => {
        if (foodIndicator == 1) {
          return (
            <Image
              src="/assets/images/veg.png"
              alt="veg"
              width={size}
              height={size}
            />
          );
        } else if (foodIndicator == 2) {
          return (
            <Image
              src="/assets/images/non-veg.jpg"
              alt="nonVeg"
              width={size}
              height={size}
            />
          );
        } else {
          return <></>;
        }
      })()}
    </Box>
  );
};

export default FoodType;
