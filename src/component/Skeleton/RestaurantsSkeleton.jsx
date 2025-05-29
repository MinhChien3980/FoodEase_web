import {
  AspectRatio,
  Box,
  Button,
  Card,
  Skeleton,
  Grid,
  Typography,
} from "@mui/joy";

const RestaurantsSkeleton = ({ itemCount = 6 }) => {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        width: "100%",
      }}
    >
      {[...Array(itemCount)].map((_, index) => (
        <Grid sm={6} lg={3} xl={2} key={index}>
          <Card
            sx={{
              width: "100%",
            }}
          >
            <AspectRatio ratio="21/16">
              <Skeleton animation="wave" variant="overlay">
                <Box
                  component={"img"}
                  alt=""
                  src="https://images.unsplash.com/photo-1686548812883-9d3777f4c137?h=400&fit=crop&auto=format&dpr=2"
                />
              </Skeleton>
            </AspectRatio>

            <Typography>
              <Skeleton sx={{ width: "5%" }}>Lorem ipsum lorem lorem</Skeleton>
            </Typography>

            <Box
              mt={-1}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Skeleton animation="wave" variant="text" sx={{ width: "65%" }} />
              <Skeleton animation="wave" variant="text" sx={{ width: "23%" }} />
            </Box>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Skeleton animation="wave" variant="text" sx={{ width: "55%" }} />
              <Skeleton animation="wave" variant="text" sx={{ width: "15%" }} />
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default RestaurantsSkeleton;
