import React from "react";
import { AspectRatio, Box, Card, Grid, Skeleton, Typography } from "@mui/joy";

const ProductFlatCardSkeleton = ({ count = 8 }) => {
  return (
    <Grid container spacing={2} width={"100%"} mb={1}>
      {[...Array(count)].map((_, index) => (
        <Grid xs={12} sm={6} lg={3} key={index}>
          <Card
            sx={{
              width: "100%",
              borderRadius: "md",
              display: "flex",
              flexDirection: "row",
              padding: 1.5,
            }}
          >
            <Box
              sx={{
                width: "32%",
                display: "flex",
              }}
            >
              <AspectRatio
                ratio="11/11"
                sx={{ width: "100%", borderRadius: "sm" }}
              >
                <Skeleton variant="rectangular" width="100%" height="100%">
                  <Box
                    component={"img"}
                    alt=""
                    src="https://images.unsplash.com/photo-1686548812883-9d3777f4c137?h=400&fit=crop&auto=format&dpr=2"
                  />
                </Skeleton>
              </AspectRatio>
            </Box>
            <Box
              sx={{
                width: "68%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                padding: 0,
              }}
            >
              <Box p={0} display={"flex"} gap={2}>
                <Typography variant="text">
                  <Skeleton width="6%">Lorem ipsum is place</Skeleton>
                </Typography>
                <Typography variant="text" gap={2} textAlign={"end"}>
                  <Skeleton width="6%">Lorem is</Skeleton>
                </Typography>
              </Box>
              <Box p={0} display={"flex"} gap={2}>
                <Typography variant="text">
                  <Skeleton width="6%">Lorem ipsum is </Skeleton>
                </Typography>
              </Box>
              
              <Box
                p={0}
                display={"flex"}
                gap={2}
                justifyContent={"space-between"}
              >
                <Typography variant="text">
                  <Skeleton width="6%">Lorem ipsum </Skeleton>
                </Typography>
                <Typography variant="text">
                  <Skeleton width="6%">Lorem</Skeleton>
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductFlatCardSkeleton;
