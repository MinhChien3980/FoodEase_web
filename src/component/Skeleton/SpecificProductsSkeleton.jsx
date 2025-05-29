import { AspectRatio, Box, Card, Grid, Skeleton, Typography } from "@mui/joy";
import React from "react";

const SpecificProductsSkeleton = ({ count = 12 }) => {
  return (
    <Grid
      className="flexProperties"
      container
      spacing={2}
      width={"100%"}
      mb={1}
    >
      {[...Array(count)].map((_, index) => (
        <Grid xs={12} sm={6} md={3} lg={2} key={index}>
          <Card
            sx={{
              width: "100%",
              borderRadius: "md",
            }}
          >
            <AspectRatio ratio="21/15">
              <Skeleton variant="rectangular">
                <Box
                  component={"img"}
                  alt=""
                  src="https://images.unsplash.com/photo-1686548812883-9d3777f4c137?h=400&fit=crop&auto=format&dpr=2"
                />
              </Skeleton>
            </AspectRatio>
            <Typography variant="text">
              <Skeleton>
                Lorem ipsum is placeholder text commonly used in the exist.
              </Skeleton>
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SpecificProductsSkeleton;
