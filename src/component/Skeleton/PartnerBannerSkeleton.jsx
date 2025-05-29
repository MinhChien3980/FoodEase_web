// PartnerBannerSkeleton.jsx
import React from "react";
import Skeleton from "@mui/joy/Skeleton";
import { styled } from "@mui/joy/styles";

const FullWidthSkeleton = styled(Skeleton)(({ theme, height }) => ({
  width: "100%",
  borderRadius: theme.vars.radius.xl,
  height: height || "200px",
}));

const PartnerBannerSkeleton = ({ height = "32vh" }) => {
  return <FullWidthSkeleton variant="rectangular" height={height} />;
};

export default PartnerBannerSkeleton;
