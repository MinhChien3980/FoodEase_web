import { Box, Grid, Typography, useTheme } from "@mui/joy";
import React from "react";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";

const CategoryCard2 = ({ title, image, slug }) => {
  const theme = useTheme();
  return (
    <Grid container gap={1} mt={0.5}>
      <Grid
        xs={12}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box component={Link} href={slug ? "/categories/" + slug : "#"}>
          <Box
            width={{ xs: 100, sm: 120, md: 150 }}
            height={{ xs: 100, sm: 120, md: 150 }}
            borderRadius="xl"
            overflow="hidden"
            position="relative"
            sx={{
              transition: "transform 0.3s", // Apply a transition for smooth scaling
              "&:hover": {
                transform: "scale(1.05)", // Scale the content by 10% when hovered
              },
            }}
          >
            <LazyLoadImage
              src={image}
              srcSet={`${image} 2x`}
              loading="lazy"
              effect="blur"
              alt={image}
              className="full-screen-centered"
            />
          </Box>
        </Box>
      </Grid>
      <Grid
        xs={12}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Typography
          fontWeight={"xl"}
          fontSize={{ xs: "xs", md: "md" }}
          textAlign={"center"}
          sx={{
            textWrap: "nowrap",
            textDecoration: "none",
            textOverflow: "ellipsis",
            overflow: "hidden",
            color: theme.palette.text.primary,
            transition: "color 0.3s ease-in-out",
          }}
        >
          {title}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default CategoryCard2;
