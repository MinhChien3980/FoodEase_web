import React from "react";
import { Box, Typography, useTheme, Rating } from "@mui/material";
import { Rating as SimpleRating } from "react-simple-star-rating";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

interface RatingBoxProps {
  rating: number;
  reviewCount?: number;
  showReviewCount?: boolean;
  size?: "small" | "medium" | "large";
  readonly?: boolean;
  onChange?: (rating: number) => void;
  precision?: number;
}

const RatingBox: React.FC<RatingBoxProps> = ({
  rating,
  reviewCount,
  showReviewCount = true,
  size = "medium",
  readonly = true,
  onChange,
  precision = 0.5,
}) => {
  const theme = useTheme();

  const getSizeConfig = () => {
    switch (size) {
      case "small":
        return { starSize: 16, fontSize: "0.75rem" };
      case "large":
        return { starSize: 24, fontSize: "1rem" };
      default:
        return { starSize: 20, fontSize: "0.875rem" };
    }
  };

  const { starSize, fontSize } = getSizeConfig();

  const handleRatingChange = (rate: number) => {
    if (onChange && !readonly) {
      onChange(rate);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
      }}
    >
      <SimpleRating
        initialValue={rating}
        onClick={handleRatingChange}
        readonly={readonly}
        allowFraction
        size={starSize}
        fillColor={theme.palette.warning.main}
        emptyColor={theme.palette.grey[300]}
        SVGclassName="rating-star"
        transition
        allowHover={!readonly}
      />
      
      <Typography
        variant="body2"
        sx={{
          fontSize,
          color: theme.palette.text.secondary,
          fontWeight: 500,
          ml: 0.5,
        }}
      >
        {rating.toFixed(1)}
      </Typography>

      {showReviewCount && reviewCount !== undefined && (
        <Typography
          variant="body2"
          sx={{
            fontSize,
            color: theme.palette.text.secondary,
            ml: 0.5,
          }}
        >
          ({reviewCount} reviews)
        </Typography>
      )}
    </Box>
  );
};

export default RatingBox;

// Alternative Material-UI native rating component
export const MuiRatingBox: React.FC<RatingBoxProps> = ({
  rating,
  reviewCount,
  showReviewCount = true,
  size = "medium",
  readonly = true,
  onChange,
  precision = 0.5,
}) => {
  const theme = useTheme();

  const handleChange = (_: React.SyntheticEvent, newValue: number | null) => {
    if (onChange && newValue !== null) {
      onChange(newValue);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
      }}
    >
      <Rating
        value={rating}
        onChange={handleChange}
        readOnly={readonly}
        precision={precision}
        size={size}
        icon={<StarIcon fontSize="inherit" />}
        emptyIcon={<StarBorderIcon fontSize="inherit" />}
        sx={{
          color: theme.palette.warning.main,
        }}
      />
      
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.secondary,
          fontWeight: 500,
          ml: 0.5,
        }}
      >
        {rating.toFixed(1)}
      </Typography>

      {showReviewCount && reviewCount !== undefined && (
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            ml: 0.5,
          }}
        >
          ({reviewCount} reviews)
        </Typography>
      )}
    </Box>
  );
}; 