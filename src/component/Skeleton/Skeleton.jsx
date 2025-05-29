import {
  AspectRatio,
  Box,
  Button,
  Card,
  Skeleton,
  Grid,
  Typography,
} from "@mui/joy";

const SkeletonBox = () => {
  return (
    <Grid mt={3} container spacing={2}>
      {[...Array(6)].map((_, index) => (
        <Grid item xs={12} sm={6} md={3} lg={2} key={index}>
          <Card
            sx={{
              width: "100%",
            }}
          >
            <AspectRatio ratio="21/9">
              <Skeleton animation="wave" variant="overlay">
                <Box
                  component={"img"}
                  alt=""
                  src="https://images.unsplash.com/photo-1686548812883-9d3777f4c137?h=400&fit=crop&auto=format&dpr=2"
                />
              </Skeleton>
            </AspectRatio>
            <Typography>
              <Skeleton>
                Lorem ipsum is placeholder text commonly used in the exist
              </Skeleton>
            </Typography>
            <Box display={"flex"} alignItems={"center"} justifyContent={"end"}>
              <Skeleton animation="wave" variant="text" sx={{ width: "23%" }} />
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SkeletonBox;
