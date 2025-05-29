`use client`;
import { Box, Button, Grid, Input, useTheme } from "@mui/joy";
import { useMediaQuery } from "@mui/material";
import {
  RiEqualizer2Line,
  RiGridFill,
  RiListCheck2,
  RiSearch2Line,
} from "@remixicon/react";
import React, { useState } from "react";
import FilterDrawer from "./FilterDrawer";
import { useTranslation } from "react-i18next";

const FilterSection = ({
  handleInputChange,
  toggleViewMode,
  prefill,
  setPrefill,
  handleApplyFilters,
}) => {
  const [openFilter, setOpenFilter] = useState(false);
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "xl"));
  const IconSize = isSm ? 22 : 16;

  const { t } = useTranslation();

  return (
    <>
      <Grid
        container
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Grid
          sm={6}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "start",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                mb: { xs: 1, sm: 0 },
              }}
            >
              <Box sx={{ display: "flex" }}>
                <Button
                  variant="outlined"
                  color="neutral"
                  onClick={() => setOpenFilter(true)}
                  startDecorator={<RiEqualizer2Line size={IconSize} />}
                  sx={{
                    width: { xs: "80px", sm: "100%" },
                    fontSize: { xs: "xs", sm: "sm" },
                    zIndex: 10,
                    maxWidth: { xs: "none", sm: "100px" },
                    display: "flex",
                    mr: { xs: 1, sm: 1 },
                  }}
                >
                  {t("filter")}
                </Button>

                <Box sx={{ display: { xs: "none", sm: "flex" } }}>
                  <Input
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    sx={{
                      width: "100%",
                      'input[type="search"]::-webkit-search-cancel-button': {
                        display: "none",
                      },
                    }}
                    placeholder="Search"
                    startDecorator={<RiSearch2Line size={IconSize} />}
                  />
                </Box>
              </Box>
              <Box sx={{ display: { xs: "flex", sm: "none" } }}>
                <Button
                  variant="outlined"
                  color="neutral"
                  onClick={() => toggleViewMode("grid")}
                  startDecorator={<RiGridFill size={IconSize} />}
                  sx={{
                    mr: 1,
                    fontSize: { xs: "xs", sm: "sm" },
                    width: { xs: "70px", sm: "auto" },
                    zIndex: 10,
                  }}
                >
                  {t("grid")}
                </Button>
                <Button
                  variant="outlined"
                  color="neutral"
                  onClick={() => toggleViewMode("list")}
                  startDecorator={<RiListCheck2 size={IconSize} />}
                  sx={{
                    fontSize: { xs: "xs", sm: "sm" },
                    width: { xs: "70px", sm: "auto" },
                    zIndex: 10,
                  }}
                >
                  {t("list")}
                </Button>
              </Box>
            </Box>

            <Box sx={{ display: { xs: "flex", sm: "none" } }}>
              <Input
                onChange={handleInputChange}
                sx={{ "--Input-focused:": 1, zIndex: 20, width: "100%" }}
                type="search"
                autoFocus={true}
                placeholder="Search"
                startDecorator={<RiSearch2Line />}
              />
            </Box>
          </Box>
        </Grid>
        <Grid
          sm={6}
          sx={{
            display: { xs: "none", sm: "flex" },
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <Box gap={1} sx={{ display: "flex", alignItems: "center" }}>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => toggleViewMode("grid")}
              startDecorator={<RiGridFill />}
              sx={{
                fontSize: { xs: "xs", sm: "sm" },
              }}
            >
              {t("grid")}
            </Button>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => toggleViewMode("list")}
              startDecorator={<RiListCheck2 />}
              sx={{ fontSize: { xs: "xs", sm: "sm" } }}
            >
              {t("list")}
            </Button>
          </Box>
        </Grid>
      </Grid>
      <FilterDrawer
        openFilter={openFilter}
        setOpenFilter={setOpenFilter}
        prefill={prefill}
        setPrefill={setPrefill}
        handleApplyFilters={handleApplyFilters}
      />
    </>
  );
};

export default FilterSection;
