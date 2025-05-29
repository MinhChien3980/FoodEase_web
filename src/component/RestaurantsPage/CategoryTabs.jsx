import React, { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import { Box, useTheme } from "@mui/joy";

const CategoryTabs = ({
  categories,
  selectedCategoryId,
  setSelectedCategoryId,
  handleTabChange,
}) => {
  const handleChange = (event, newValue) => {
    setSelectedCategoryId(newValue);
    handleTabChange(event, newValue);
  };

  const theme = useTheme();

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <Box
      p={1}
      sx={{
        backgroundColor: theme.palette.background.bredCrump,
        borderRadius: "xl",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Tabs
        value={selectedCategoryId}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
        TabIndicatorProps={{ style: { display: "none" } }}
        sx={{
          width: "100%",
          minHeight: "unset",
          "& .MuiTabs-scroller": {
            display: "flex",
            alignItems: "center",
          },

          "& .Mui-selected": {
            color: `${theme.palette.common.black} !important`,
            backgroundColor: theme.palette.common.white,
            fontWeight: 500,
            borderRadius: "10px",
          },
          "& .MuiTab-root": {
            textTransform: "none",
            color: theme.palette.text.primary,
            fontWeight: 500,
            fontSize: "16px",
            padding: "8px 8px",
            minHeight: "unset",
            marginTop: 0,
            marginBottom: 0,
          },
        }}
      >
        <Tab
          label="All"
          value={null}
          sx={{
            marginRight: "1%",
            "&:hover": {
              bgcolor: theme.palette.common.white,
              color: theme.palette.common.black,
              borderRadius: "10px",
            },
          }}
        />
        {categories.map((category) => (
          <Tab
            key={category.id}
            label={capitalizeFirstLetter(category.name)}
            value={category.id}
            sx={{
              marginRight: "1%",
              "&:hover": {
                bgcolor: theme.palette.common.white,
                color: theme.palette.common.black,
                borderRadius: "10px",
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default CategoryTabs;
