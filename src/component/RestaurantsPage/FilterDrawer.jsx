"use client";
import {
  AspectRatio,
  Box,
  Button,
  Card,
  Checkbox,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  FormLabel,
  List,
  ListItem,
  ListItemDecorator,
  ModalClose,
  Radio,
  RadioGroup,
  Sheet,
  Slider,
  Stack,
  Typography,
  useTheme,
} from "@mui/joy";
import React, { useEffect, useState } from "react";
import FoodType from "../FoodType/FoodType";
import { RiCheckFill, RiRestaurant2Line } from "@remixicon/react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { formatePrice } from "@/helpers/functionHelpers";

const FilterDrawer = ({
  openFilter,
  setOpenFilter,
  prefill,
  setPrefill,
  handleApplyFilters,
}) => {
  const [priceRange, setPriceRange] = useState([
    Number(prefill.min_price) || 0,
    Number(prefill.max_price) || 5000,
  ]);

  const handleRangeChange = (_, newValue) => {
    setPrefill((prev) => ({
      ...prev,
      min_price: newValue[0],
      max_price: newValue[1],
    }));
  };

  const handleFoodTypeChange = (event) => {
    const value = event.target.value;

    setPrefill((prev) => ({
      ...prev,
      vegetarian: value,
    }));
  };

  const handleTopRatedChange = (event) => {
    setPrefill((prev) => ({
      ...prev,
      top_rated_foods: event.target.checked ? 1 : 0,
    }));
  };

  const handleOrderChange = (event) => {
    setPrefill((prev) => ({
      ...prev,
      order: event.target.value,
    }));
  };

  useEffect(() => {
    setPriceRange([
      Number(prefill.min_price) || 0,
      Number(prefill.max_price) || 5000,
    ]);
  }, [prefill.min_price, prefill.max_price]);

  const theme = useTheme();
  const settings = useSelector((state) => state.settings.value);

  const { t } = useTranslation();

  return (
    <Drawer
      size="lg"
      variant="plain"
      open={openFilter}
      onClose={() => setOpenFilter(false)}
      slotProps={{
        content: {
          sx: {
            bgcolor: "transparent",
            p: { md: 3, sm: 0, xs:3 },
            boxShadow: "none",
            maxWidth: "500px",
          },
        },
      }}
    >
      <Sheet
        sx={{
          borderRadius: "md",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100%",
          overflow: "auto",
        }}
      >
        <DialogTitle>{t("filter")}</DialogTitle>
        <ModalClose />
        <Divider sx={{ mt: "auto" }} />
        <DialogContent sx={{ gap: 2 }}>
          {/* Food Type */}
          <FormControl>
            <FormLabel sx={{ typography: "title-md", fontWeight: "bold" }}>
              {t("food-type")}
            </FormLabel>
            <RadioGroup
              aria-label="Food type"
              name="food-type"
              value={prefill.vegetarian}
              onChange={handleFoodTypeChange}
              sx={(theme) => ({
                gap: 2,
                display: "flex",
                flexDirection: "column",
                paddingRight: { xs: 2, md: 0 },
                [theme.breakpoints.up("sm")]: {
                  flexDirection: "row",
                },
              })}
            >
              {[
                {
                  value: 1,
                  label: t("veg"),
                  icon: <FoodType foodIndicator="1" size={24} />,
                },
                {
                  value: 2,
                  label: t("non-veg"),
                  icon: <FoodType foodIndicator="2" size={24} />,
                },
                {
                  value: 3,
                  label: t("both"),
                  icon: <RiRestaurant2Line size={24} />,
                },
              ].map(({ label, icon, value }) => (
                <Sheet
                  key={label}
                  variant="outlined"
                  sx={(theme) => ({
                    borderRadius: "md",
                    boxShadow: "sm",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    mb: 1,
                    [theme.breakpoints.up("sm")]: {
                      mb: 0,
                      flex: 1,
                    },
                  })}
                >
                  <Radio
                    value={value}
                    label={label}
                    overlay
                    sx={{
                      flexGrow: 1,
                      flexDirection: "row-reverse",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                    }}
                    slotProps={{
                      action: ({ checked }) => ({
                        sx: (theme) => ({
                          ...(checked && {
                            inset: -1,
                            border: "2px solid",
                            borderColor: theme.vars.palette.primary[500],
                          }),
                        }),
                      }),

                      radio: {
                        sx: {
                          display: "inline-flex",
                          "& svg": {
                            fontSize: "1.25rem",
                          },
                        },
                      },
                    }}
                  >
                    <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
                      {icon}
                    </Box>
                  </Radio>
                </Sheet>
              ))}
            </RadioGroup>
          </FormControl>

          {/* Price Range */}
          <FormControl>
            <FormLabel sx={{ typography: "title-md", fontWeight: "bold" }}>
              {t("price-range")}
            </FormLabel>
            <Box sx={{ width: "100%" }} px={4}>
              <Slider
                sx={{ marginTop: 2, width: "100%" }}
                min={0}
                max={5000}
                onChange={(e, newValue) => {
                  setPriceRange(newValue);
                  handleRangeChange(e, newValue);
                }}
                variant="solid"
                valueLabelDisplay="on"
                value={priceRange}
              />
              <List
                orientation="horizontal"
                size="sm"
                sx={{
                  "--List-gap": "12px",
                  "--ListItem-radius": "8px",
                }}
              >
                <Card
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 1,
                  }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "center" }}
                    gap={1}
                    px={2}
                  >
                    <Typography sx={{ color: theme.palette.text.currency }}>
                      {formatePrice(prefill.min_price)}
                    </Typography>
                    <Typography>-</Typography>
                    <Typography sx={{ color: theme.palette.text.currency }}>
                      {formatePrice(prefill.max_price)}
                    </Typography>
                  </Box>
                </Card>
              </List>
            </Box>
          </FormControl>
          {/* Other Options */}

          <FormControl className="flexProperties">
            <FormLabel sx={{ typography: "title-md", fontWeight: "bold" }}>
              {"Sort By"}
            </FormLabel>
            <RadioGroup
              aria-label="Order"
              name="order"
              value={prefill.order}
              onChange={handleOrderChange}
              sx={{
                gap: 2,
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Sheet
                variant="outlined"
                sx={{
                  borderRadius: "md",
                  boxShadow: "sm",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Radio
                  value="ASC"
                  label={t("Price-Low-To-High")}
                  overlay
                  sx={{
                    flexGrow: 1,
                    flexDirection: "row-reverse",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                  }}
                  slotProps={{
                    action: ({ checked }) => ({
                      sx: (theme) => ({
                        ...(checked && {
                          inset: -1,
                          border: "2px solid",
                          borderColor: theme.vars.palette.primary[500],
                        }),
                      }),
                    }),
                    radio: {
                      sx: {
                        display: "inline-flex",
                        "& svg": {
                          fontSize: "1.25rem",
                        },
                      },
                    },
                  }}
                />
              </Sheet>
              <Sheet
                variant="outlined"
                sx={{
                  borderRadius: "md",
                  boxShadow: "sm",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Radio
                  value="DESC"
                  label={t("Price-High-To-Low")}
                  overlay
                  sx={{
                    flexGrow: 1,
                    flexDirection: "row-reverse",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                  }}
                  slotProps={{
                    action: ({ checked }) => ({
                      sx: (theme) => ({
                        ...(checked && {
                          inset: -1,
                          border: "2px solid",
                          borderColor: theme.vars.palette.primary[500],
                        }),
                      }),
                    }),
                    radio: {
                      sx: {
                        display: "inline-flex",
                        "& svg": {
                          fontSize: "1.25rem",
                        },
                      },
                    },
                  }}
                />
              </Sheet>
            </RadioGroup>
          </FormControl>
          {/* Top Rated */}
          <FormControl>
            <FormLabel sx={{ typography: "title-md", fontWeight: "bold" }}>
              {t("other")}
            </FormLabel>
            <List
              orientation="horizontal"
              size="sm"
              sx={{
                "--List-gap": "12px",
                "--ListItem-radius": "20px",
              }}
            >
              <ListItem>
                <AspectRatio
                  variant={prefill.top_rated_foods === 1 ? "solid" : "outlined"}
                  color={prefill.top_rated_foods === 1 ? "primary" : "neutral"}
                  ratio={1}
                  sx={{ width: 20, borderRadius: 20, ml: -0.5, mr: 0.75 }}
                >
                  <div>{prefill.top_rated_foods === 1 && <RiCheckFill />}</div>
                </AspectRatio>
                <Checkbox
                  size="sm"
                  color="neutral"
                  disableIcon
                  overlay
                  label={t("Top-Rated")}
                  variant="outlined"
                  checked={prefill.top_rated_foods === 1}
                  onChange={handleTopRatedChange}
                  slotProps={{
                    action: {
                      sx: {
                        "&:hover": {
                          bgcolor: "transparent",
                        },
                      },
                    },
                  }}
                />
              </ListItem>
            </List>
          </FormControl>

          {/* Buttons */}
          <Divider sx={{ mt: "auto" }} />
          <Stack
            direction="row"
            justifyContent="space-between"
            useFlexGap
            spacing={1}
          >
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => {
                setPrefill({
                  order: "",
                  top_rated_foods: 0,
                  min_price: 0,
                  max_price: "",
                  vegetarian: 3,
                });
              }}
            >
              {t("clear")}
            </Button>
            <Button
              onClick={() => {
                setOpenFilter(false), handleApplyFilters();
              }}
            >
              {t("show-products")}
            </Button>
          </Stack>
        </DialogContent>
      </Sheet>
    </Drawer>
  );
};

export default FilterDrawer;
