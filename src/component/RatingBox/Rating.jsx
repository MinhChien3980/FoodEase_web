import { Box } from "@mui/joy";
import React from "react";

const Star = ({ filled, half, size, color = "#FFD700" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    style={{ display: "block" }}
  >
    <defs>
      <linearGradient id={`halfFill-${size}`}>
        <stop offset="50%" stopColor={color} />
        <stop offset="50%" stopColor="#D3D3D3" />
      </linearGradient>
    </defs>
    <path
      fill={filled ? color : half ? `url(#halfFill-${size})` : "#D3D3D3"}
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
    />
  </svg>
);

const RatingStars = ({ value = 0, size = 18, totalRaters = 0 }) => {
  const numericValue = Math.min(5, Math.max(0, Number(value) || 0));

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "2px",
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(numericValue);
    const hasHalfStar = numericValue % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={size}
          filled={i < fullStars}
          half={i === fullStars && hasHalfStar}
        />
      );
    }
    return stars;
  };

  const formatRaters = () => {
    const raters = parseInt(totalRaters, 10);
    if (isNaN(raters) || raters <= 0) return null;
    if (raters > 99) return "99+";
    return raters.toString();
  };

  return (
    <Box sx={containerStyle}>
      <Box sx={{ display: "flex", gap: "2px" }}>{renderStars()}</Box>
      {formatRaters() && (
        <Box
          sx={{
            fontSize: `${size * 0.8}px`,
            color: "#666666",
            marginLeft: "4px",
          }}
        >
          ({formatRaters()})
        </Box>
      )}
    </Box>
  );
};

export default RatingStars;
