import { formatePrice } from "@/helpers/functionHelpers";
import { setTipAmount } from "@/store/reducers/deliveryTipSlice";
import {
  Box,
  Button,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Grid,
  Input,
  Radio,
  RadioGroup,
  Typography,
  useTheme,
} from "@mui/joy";
import { RiCheckLine, RiHandCoinLine } from "@remixicon/react";
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

const TipComponent = ({ deliveryType }) => {
  const theme = useTheme();
  const settings = useSelector((state) => state.settings.value);
  const currencySymbol = settings?.system_settings[0]?.currency;
  const [tip, setTip] = useState(0);
  const [tipType, setTipType] = useState("");
  const [customTipInputValue, setCustomTipInputValue] = useState("");
  const customInputRef = useRef(null);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const clearTipHandler = () => {
    setTip(0);
    setTipType("");
    setCustomTipInputValue("");
    dispatch(setTipAmount(0));
  };

  useEffect(() => {
    dispatch(setTipAmount(tip));
  }, [tip, dispatch]);

  useEffect(() => {
    if (tipType === "Other" && customInputRef.current) {
      customInputRef.current.focus();
    }
  }, [tipType]);

  const handleCustomTipChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setCustomTipInputValue(value);
    }
  };

  const handleCustomTipKeyDown = (e) => {
    if (e.key === "Enter") {
      const tipValue = parseInt(customTipInputValue, 10) || 0;
      setTip(tipValue);
    }
  };

  const handleAddTipClick = () => {
    const tipValue = parseInt(customTipInputValue, 10) || 0;
    setTip(tipValue);
  };

  return (
    <>
      {deliveryType === "Delivery" && (
        <Grid xs={12} width={"100%"}>
          <Box
            sx={{
              borderRadius: "sm",
              backgroundColor: theme.palette.background.surface,
            }}
            className="boxShadow"
            p={2}
          >
            <CardActions
              orientation="horizontal"
              sx={{
                pt: 0,
                pb: 0,
                px: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"100%"}
                gap={1}
              >
                <Box sx={{ display: "flex", gap: 1 }}>
                  <RiHandCoinLine
                    color={
                      theme.palette.mode === "light"
                        ? theme.palette.text.menuText
                        : theme.palette.text.currency
                    }
                  />
                  <Typography
                    textColor={
                      theme.palette.mode === "light"
                        ? "text.menuText"
                        : "text.secondary"
                    }
                    sx={{ fontSize: { xs: "sm", md: "md" } }}
                    fontWeight={"lg"}
                  >
                    {t("Tip-Delivery-Boy")}
                  </Typography>
                </Box>

                <Typography
                  onClick={clearTipHandler}
                  sx={{
                    fontSize: {
                      xs: "sm",
                      md: "md",
                      cursor: "pointer",
                    },
                  }}
                  fontWeight={"lg"}
                  textColor={"danger.solidBg"}
                >
                  {t("clear-tip")}
                </Typography>
              </Box>
            </CardActions>

            <CardContent orientation="vertical" sx={{ px: { md: 4, xs: 2 } }}>
              <Divider sx={{ my: 1, width: "100%" }} />
              <Box>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <RadioGroup
                    name="best-movie"
                    aria-labelledby="best-movie"
                    orientation="horizontal"
                    sx={{ flexWrap: "wrap", gap: 1 }}
                  >
                    {[5, 10, 15, 20, "Other"].map((name) => {
                      const checked = tipType === name;
                      return (
                        <Chip
                          key={name}
                          variant="plain"
                          color={checked ? "primary" : "neutral"}
                          sx={{
                            borderRadius: "sm",
                            px: 2,
                          }}
                          startDecorator={checked && <RiCheckLine />}
                        >
                          <Radio
                            variant="outlined"
                            size="lg"
                            color={checked ? "primary" : "neutral"}
                            disableIcon
                            overlay
                            label={name !== "Other" ? formatePrice(name) : name}
                            value={name}
                            checked={checked}
                            onChange={(event) => {
                              if (event.target.checked) {
                                setTipType(name);
                                if (name === "Other") {
                                  setCustomTipInputValue("");
                                  setTip(0);
                                } else {
                                  setTip(name);
                                }
                              }
                            }}
                          />
                        </Chip>
                      );
                    })}
                  </RadioGroup>
                </Box>
                {tipType === "Other" && (
                  <Box mt={4}>
                    <Input
                      ref={customInputRef}
                      size="lg"
                      type="number"
                      startDecorator={currencySymbol}
                      endDecorator={
                        <Button
                          onClick={handleAddTipClick}
                          sx={{ maxWidth: "fit-content" }}
                        >
                          {t("add-tip")}
                        </Button>
                      }
                      value={customTipInputValue}
                      onChange={handleCustomTipChange}
                      onKeyDown={handleCustomTipKeyDown}
                      inputProps={{
                        min: 0,
                        step: 1,
                      }}
                    />
                  </Box>
                )}
              </Box>
            </CardContent>
          </Box>
        </Grid>
      )}
    </>
  );
};

export default TipComponent;
