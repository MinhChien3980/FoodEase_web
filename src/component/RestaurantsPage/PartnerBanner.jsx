import React, { useState } from "react";
import { Box, Typography, useTheme, Modal, IconButton } from "@mui/joy";
import {
  RiCalendarScheduleLine,
  RiCloseLine,
  RiTimeFill,
  RiTimeLine,
} from "@remixicon/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import RatingBox from "../RatingBox/RatingBox";
import SocialMedia from "../../component/RestaurantsPage/SocialMedia";
import { useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";

const PartnerBanner = ({ restaurant }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { t } = useTranslation();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (!restaurant) {
    return null; // Or a loading state
  }

  const {
    partner_profile,
    is_restro_open,
    partner_name,
    partner_address,
    partner_cook_time,
    partner_rating,
    partner_working_time,
    latitude,
    longitude,
  } = restaurant;

  const handleMapClick = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${Number(
      latitude
    )},${Number(longitude)}`;
    window.open(url, "_blank");
  };

  return (
    <Box
      sx={{
        position: "relative",
        boxShadow: "none",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "300px",
        mt: 2,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8))`,
          zIndex: 1,
        }}
        className="borderRadiusMd"
      />
      <LazyLoadImage
        src={partner_profile}
        srcSet={`${partner_profile} 2x`}
        loading="lazy"
        effect="blur"
        alt="Restaurant profile"
        width="100%"
        height="300px"
        className="lazy-load"
      />
      <Box
        sx={{
          position: "absolute",
          zIndex: 1,
          bottom: 0,
          width: "400px",
          height: "100%",
          padding: 2,
          right: 0,
          display: { xs: "none", sm: "none", md: "block" },
        }}
      >
        <Box
          sx={{
            backgroundImage: `url(${partner_profile})`,
            backgroundSize: { xs: "cover", md: "cover" },
            backgroundPosition: "center",
            width: "100%",
            height: "100%",
            display: { xs: "none", sm: "none", md: "block" },
          }}
          className="borderRadiusMd"
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 22,
            right: 22,
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 2,
          }}
        >
          <SocialMedia />
          <Box
            sx={{
              backgroundColor: theme.palette.text.currency,
              borderRadius: "50%",
              padding: 1.1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={handleOpen}
          >
            <RiCalendarScheduleLine color="white" />
          </Box>
        </Box>
      </Box>
      <Box
        className="borderRadiusXs"
        sx={{
          position: "absolute",
          zIndex: 3,
          top: "16px",
          left: "16px",
          right: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            bgcolor:
              is_restro_open === "0"
                ? "var(--toastify-color-error)"
                : "var(--toastify-color-success)",
            borderRadius: "sm",
            paddingY: 0.125,
          }}
        >
          <Typography
            variant="body1"
            component="span"
            sx={{
              fontSize: "sm",
              fontWeight: "md",
              p: { xs: 0.5, sm: 1 },
              color: theme.palette.common.white,
            }}
          >
            {is_restro_open === "0" ? "Currently Closed" : "Open Now"}
          </Typography>
        </Box>

        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            gap: 1,
          }}
        >
          <SocialMedia />
          <Box
            sx={{
              backgroundColor: theme.palette.text.currency,
              borderRadius: "50%",
              padding: 1.1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={handleOpen}
          >
            <RiCalendarScheduleLine color="white" />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          zIndex: 3,
          bottom: { xs: -6, sm: 10 },
          left: 16,
          fontSize: { xs: "xs", sm: "sm", md: "md", lg: "lg", xl: "xl" },
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "column" },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={4}
          sx={{
            order: { xs: 1, sm: 1, md: 0 },
            mb: { xs: 2, sm: 2, md: 1 },
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            bgcolor={theme.palette.background.cookingTime}
            p={{ xs: 0.3, sm: 0.5 }}
            className="borderRadiusMd"
            onClick={handleOpen}
            sx={{ cursor: "pointer" }}
          >
            <RiTimeFill
              alignmentBaseline="center"
              color={theme.palette.text.black}
              size={isSmallScreen ? 16 : 20}
            />
            <Typography
              variant="caption"
              component="span"
              sx={{
                fontSize: { xs: "0.6rem", sm: "sm" },
                alignItems: "center",
                justifyContent: "center",
                color: theme.palette.text.black,
                whiteSpace: "nowrap",
              }}
            >
              {partner_cook_time || ""}
            </Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            className="borderRadiusMd"
          >
            <RatingBox partnerRating={partner_rating} />
          </Box>
        </Box>
        <Box
          sx={{
            order: { xs: 2, sm: 2, md: 1 },
            mb: { xs: 2, sm: 2, md: 0 },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography
              className="fontWeight800"
              variant="h4"
              component="h4"
              color={theme.palette.common.white}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: { xs: "md", sm: "sm", md: "md", lg: "xl" },
                maxWidth: { xs: "280px", sm: "380px", md: "350px" },
                color: theme.palette.common.white,
              }}
            >
              {partner_name || ""}
            </Typography>
            <Typography sx={{ color: theme.palette.common.white }}>
              {partner_address || ""}
            </Typography>
          </Box>
          <Box
            component="img"
            src="/assets/images/google-map-icon.svg"
            alt="Google Logo"
            width={48}
            height={48}
            sx={{ cursor: "pointer" }}
            onClick={handleMapClick}
          />
        </Box>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: theme.palette.background.surface,
            boxShadow: 0,
            p: 3,
            borderRadius: "md",
            width: { xs: "90%", sm: "80%", md: "25%" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <Typography
              startDecorator={<RiTimeLine />}
              sx={{ color: theme.palette.text.primary, fontWeight: "lg" }}
            >
              {t("Working-Hours")}
            </Typography>
            <IconButton onClick={handleClose}>
              <RiCloseLine />
            </IconButton>
          </Box>
          {partner_working_time?.map((time) => (
            <Box
              key={time.id}
              display="flex"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography sx={{ color: theme.palette.text.primary }}>
                {time.day}:
              </Typography>
              <Typography sx={{ color: theme.palette.text.primary }}>
                {time.opening_time} - {time.closing_time}
              </Typography>
            </Box>
          ))}
        </Box>
      </Modal>
    </Box>
  );
};

export default React.memo(PartnerBanner);
