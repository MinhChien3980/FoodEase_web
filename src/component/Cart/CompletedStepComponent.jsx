import React from "react";
import { Box, Typography, useTheme } from "@mui/joy";
import { RiCheckboxCircleFill } from "@remixicon/react";
import { useTranslation } from "react-i18next";

const CompletedStepComponent = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box
      className="flexProperties"
      sx={{
        padding: 4,
        height: "100%",
        width: "100%",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <Box
        className="boxShadow "
        sx={{
          textAlign: "center",
          padding: 4,
          height: "100%",
          borderRadius: "xl",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <RiCheckboxCircleFill size={80} color={theme.palette.text.currency} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography
            level="h1"
            sx={{
              color: theme.palette.text.primary,
              fontSize: { xs: "lg", sm: "xl" },
            }}
          >
            {t("Order-Placed-Successfully!")}
          </Typography>
          <Typography
            sx={{
              color: theme.palette.text.secondary,
              fontSize: { xs: "sm", sm: "md" },
            }}
          >
            {t("Thank-you-for-your-purchase.Your-order-has-been-placed-successfully-and-is-being-processed.")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CompletedStepComponent;
