"use client";
import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/joy";
import React from "react";
import { useTheme } from "@mui/joy/styles";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Link from "next/link";

const CategoryCard = ({ title, image, slug }) => {
  const theme = useTheme();
  return (
    <Link href={slug ? "/categories/" + slug : "#"}>
      <Card
        sx={{
          px: 1,
          width: "100%",
          height: "auto",
          border: "none",
          borderBottom: "1px solid #18274B14",
          borderRadius: theme.radius.lg,
          boxShadow:
            "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
          py: 2,
          "&:hover": {
            cursor: "pointer",
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.primary[100]
                : theme.palette.primary[900],
          },
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box
            width={100}
            height={100}
            borderRadius="50%"
            overflow="hidden"
            position="relative"
            sx={{
              transition: "transform 0.3s", // Apply a transition for smooth scaling
              "&:hover": {
                transform: "scale(1.1)", // Scale the content by 10% when hovered
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
        <CardContent orientation="horizontal">
          <Box
            sx={{ width: "100%" }}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Typography
              fontWeight={"md"}
              fontSize={"md"}
              sx={{
                textWrap: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                color:
                  theme.palette.mode === "light"
                    ? theme.palette.text.primary
                    : theme.palette.text.primary,
                transition: "color 0.3s ease-in-out",
              }}
            >
              {title}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
