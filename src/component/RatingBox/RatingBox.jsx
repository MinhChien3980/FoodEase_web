import React from "react";
import { Box, Typography, useTheme } from "@mui/joy";
import { RiStarFill } from "@remixicon/react";

const RatingBox = ({ totalRaters, partnerRating }) => {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      padding={0.5}
      alignItems="center"
      justifyContent="center"
      borderRadius="var(--border-radius-xl)"
      bgcolor={theme.palette.text.currency}
      sx={{
        height: { xs: 24, sm: 32 },  
        width: { xs: 55, sm: 60, md: 80 },  
        color: theme.palette.background.star2,
      }}
    >
      <Box
        display="flex"
        padding={0.5}
        alignItems="center"
        justifyContent="center"
      >
        <RiStarFill size={16} />
      </Box>
      <Box
        sx={{
          color: theme.palette.text.white,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          component="span"
          fontWeight="bold"
          sx={{ fontSize: { xs: "xs", sm: "xs", md: "sm" } }}
          mr={0.5}
          color={theme.palette.text.white}
        >
          {partnerRating}
        </Typography>

        {partnerRating === 10 && (
          <Typography component="span" fontSize="xs" mr={1}>
            ({totalRaters}+)
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default RatingBox;
