import React from "react";
import Link from "next/link";
import { Box, Typography, useTheme } from "@mui/joy";

const CategoryFlatCard = ({ category }) => {
  const { name, image, slug } = category;
  const theme = useTheme();

  return (
    <>
      <Link href={slug ? "/categories/" + slug : "#"} passHref>
        <Box
          width={{ xs: 120, sm: 260 }}
          height={{ xs: 120, sm: 200 }}
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            borderRadius: "md",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={image}
            alt={name}
            width="100%"
            height="100%"
            sx={{
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))`,
            }}
          />
          <Typography
            sx={{
              color: theme.palette.common.white,
              position: "relative",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "90%",
              padding: 1,
              fontWeight: "xl",
              fontSize: { xs: "xs", md: "md", xl: "lg" },
              zIndex: 1,
            }}
          >
            {name}
          </Typography>
        </Box>
      </Link>
    </>
  );
};

export default CategoryFlatCard;
