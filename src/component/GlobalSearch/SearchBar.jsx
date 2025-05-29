"use client";
import { Box, Grid, IconButton, Input, useTheme } from "@mui/joy";
import { RiMapPin2Line, RiSearch2Line } from "@remixicon/react";
import React from "react";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
const LocationModal = dynamic(
  () => import("@/component/Models/LocationModal"),
  {
    ssr: false,
  }
);
const SearchBar = ({ onClick }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box
      sx={{
        mb: [2, null, 4], // 2 for default, null for sm, 4 for md
        width: "100%",
      }}
    >
      {/* sx={{display: {xs: "block", md: "none"}}} */}

      <Grid
        container
        spacing={2}
        sx={{
          flexGrow: 1,
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Grid xs={3} sm={12}>
          <LocationModal />
        </Grid>
        <Grid xs={8} sm={10} onClick={onClick}>
          <Input
            disabled={true}
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#000000",
              },
            }}
            endDecorator={
              <RiSearch2Line
                color={theme.palette.mode === "dark" ? "white" : "black"}
              />
            }
            placeholder={t("search-bar-text")}
            variant="outlined"
            size="lg"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchBar;
