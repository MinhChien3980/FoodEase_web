import {
  AspectRatio,
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from "@mui/joy";
import React from "react";

const OrderCardSkeleton = () => {
  return (
    <Grid
      mt={3}
      container
      spacing={2}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "end",
        flexDirection: "column",
        width: "100%",
      }}
    >
      {[...Array(3)].map((_, index) => (
        <Grid xs={12} key={index}>
          <Card
            variant="outlined"
            sx={{
              width: "100%",
              borderRadius: "md",
            }}
          >
            <CardContent orientation="horizontal">
              <Skeleton variant="rectangular" width={"30%"} height={150} />
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"start"}
                width={"100%"}
              >
                <Box
                  display={"flex"}
                  justifyContent={"start"}
                  alignItems={"start"}
                  width={"100%"}
                  flexDirection={"column"}
                  sx={{ gap: 1 }}
                >
                  <Skeleton level="body-sm" variant="text" width={"80%"} />
                  <Skeleton level="body-sm" variant="text" width={"90%"} />
                  <Skeleton level="body-sm" variant="text" width={"70%"} />
                </Box>
                <Skeleton
                  variant="rectangular"
                  width={"30%"}
                  height={30}
                  sx={{ borderRadius: "sm" }}
                />
              </Box>
            </CardContent>
            <CardContent sx={{ gap: 1, mt: 1 }}>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"start"}
                width={"100%"}
                sx={{ gap: 2 }}
              >
                <Skeleton
                  variant="rectangular"
                  width={"40%"}
                  height={30}
                  sx={{ borderRadius: "sm" }}
                />
                <Skeleton
                  variant="rectangular"
                  width={"40%"}
                  height={30}
                  sx={{ borderRadius: "sm" }}
                />
              </Box>
              <Box
                display={"flex"}
                justifyContent={"start"}
                alignItems={"center"}
                width={"100%"}
                mt={2}
                sx={{ gap: 2 }}
              >
                <Skeleton
                  variant="rectangular"
                  width={"20%"}
                  height={30}
                  sx={{ borderRadius: "sm" }}
                />
                <Skeleton
                  variant="rectangular"
                  width={"20%"}
                  height={30}
                  sx={{ borderRadius: "sm" }}
                />
                <Skeleton
                  variant="rectangular"
                  width={"20%"}
                  height={30}
                  sx={{ borderRadius: "sm" }}
                />
                <Skeleton
                  variant="rectangular"
                  width={"20%"}
                  height={30}
                  sx={{ borderRadius: "sm" }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default OrderCardSkeleton;
