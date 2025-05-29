import React from "react";
import { Box } from "@mui/joy";
import Link from "next/link";

const OffersCard = ({ imagedata }) => {
  const { image } = imagedata;
  return (
    <Box
      display="flex"
      justifyContent="start"
      sx={{
        height: "100%",
        width: "100%",
        position: "relative", // Add position relative to handle overflow properly
        overflow: "hidden", // Hide overflowing content
        borderRadius: "xl",
      }}
    >
      {imagedata?.type == "categories" ? (
        <Link
          href={"categories/" + imagedata?.data[0]?.slug}
          passHref
          className="min-size-100 object-fit"
        >
          <Box
            component="img"
            src={image}
            alt={imagedata?.data[0]?.slug}
            sx={{
              width: "100%", // Ensure image takes full width of its container
              height: "100%", // Ensure image takes full height of its container
              objectFit: "cover", // Cover the entire box while preserving aspect ratio
            }}
          />
        </Link>
      ) : (
        <Box
          component="img"
          src={image}
          alt="product banner image"
          sx={{
            width: "100%", // Ensure image takes full width of its container
            height: "100%", // Ensure image takes full height of its container
            objectFit: "cover", // Cover the entire box while preserving aspect ratio
            borderRadius: "xl",
          }}
        />
      )}
    </Box>
  );
};

export default OffersCard;
