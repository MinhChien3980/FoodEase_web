import { AspectRatio, Box, Skeleton, Grid, Typography, Card } from "@mui/joy";

const CategorySkeleton = ({ count = 6 }) => {
  return (
    <Grid
      className="flexProperties"
      container
      spacing={2}
      width={"100%"}
      mb={1}
    >
      {[...Array(count)].map((_, index) => (
        <Grid xs={6} sm={6} md={3} lg={2} key={index}>
          <Card
            sx={{
              width: "100%",
              borderRadius: "xl",
            }}
          >
            <AspectRatio ratio="21/15">
              <Skeleton animation="wave" variant="overlay">
                <Box
                  component={"img"}
                  alt=""
                  src="https://images.unsplash.com/photo-1686548812883-9d3777f4c137?h=400&fit=crop&auto=format&dpr=2"
                />
              </Skeleton>
            </AspectRatio>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              sx={{ position: "absolute" }}
            >
              <Skeleton animation="wave" variant="text" sx={{ width: "23%" }} />
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CategorySkeleton;
