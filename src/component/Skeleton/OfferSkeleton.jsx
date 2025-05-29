import React from "react";
import { Box, Skeleton, Grid } from "@mui/joy";

const OfferSkeleton = () => {
  return (
    <Grid
      container
      display={"flex"}
      alignItems={"center"}
      spacing={2}
      justifyContent={"start"}
    >
      {Array.from(new Array(16)).map((_, index) => (
        <Grid
          key={index}
          xs={6}
          sm={3}
          md={4}
          lg={2}
          xl={1.5}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          borderRadius={"lg"}
        >
          <Box
            width={{ xs: 150, md: 200 }}
            height={{ xs: 200, md: 250 }}
            borderRadius={"lg"}
            sx={{ overflow: "hidden" }}
          >
            <Skeleton variant="rectangular" width="100%" height="100%" />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default OfferSkeleton;
