import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemDecorator,
  Radio,
  RadioGroup,
} from "@mui/joy";
import { RiStore3Line, RiTruckLine } from "@remixicon/react";
import { useMediaQuery } from "@mui/material";
import CartItems from "./CartItems";
import CartBillDetails from "./CartBillDetails";
import CartSideSection from "./CartSideSection";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const CartStepComponent = ({ onDeliveryTypeChange }) => {
  const options = ["Delivery", "Self-PickUp"];
  const defaultValue = options[0];
  const { t } = useTranslation();
  const [deliveryType, setDeliveryType] = useState(defaultValue);
  const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const [displayDeliveryOptions, setDisplayDeliveryOptions] = useState({
    delivery: true,
    selfPickUp: true,
  });

  const [partnerPermission, setPartnerPermission] = useState();

  const Cart = useSelector((state) => state.cart?.data);
  useEffect(() => {
    let partnerPermission =
      Cart?.[0]?.product_details?.[0]?.partner_details?.[0]?.permissions;
    setPartnerPermission(partnerPermission);
  }, [Cart]);

  useEffect(() => {
    if (partnerPermission) {
      if (
        partnerPermission.delivery_orders == "1" &&
        partnerPermission.self_pickup === "1"
      ) {
        setDisplayDeliveryOptions({ delivery: true, selfPickUp: true });
      } else if (
        partnerPermission.delivery_orders === "1" &&
        partnerPermission.self_pickup === "0"
      ) {
        setDisplayDeliveryOptions({ delivery: true, selfPickUp: false });
        setDeliveryType("Delivery");
        onDeliveryTypeChange("Delivery");
      } else if (
        partnerPermission.delivery_orders === "0" &&
        partnerPermission.self_pickup === "1"
      ) {
        setDisplayDeliveryOptions({ delivery: false, selfPickUp: true });
        setDeliveryType("Self-PickUp");
        onDeliveryTypeChange("Self-PickUp");
      } else {
        setDisplayDeliveryOptions({ delivery: true, selfPickUp: true });
      }
    }
  }, [partnerPermission, onDeliveryTypeChange]);

  const handleOptionChange = (event) => {
    const selectedDeliveryType = event.target.value;
    setDeliveryType(selectedDeliveryType);
    onDeliveryTypeChange(selectedDeliveryType);
  };

  return (
    <Box display={"flex"} flexDirection={"column"} width={"100%"} gap={2}>
      <Box
        sx={{
          width: "100%",
          justifyContent: { xs: "center", sm: "start" },
        }}
      >
        <RadioGroup
          aria-label="Your plan"
          name="deliveryMethod"
          value={deliveryType}
          onChange={handleOptionChange}
        >
          <List
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 0 },
              alignItems: "center",
            }}
          >
            {options.map((item, index) => {
              const isDisabled =
                item === "Delivery"
                  ? !displayDeliveryOptions.delivery
                  : !displayDeliveryOptions.selfPickUp;

              return (
                <ListItem
                  variant="outlined"
                  key={item}
                  sx={{
                    boxShadow: "sm",
                    borderRadius: "xl",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 1,
                    fontSize: "xs",
                    display: isDisabled ? "none" : "flex",
                  }}
                >
                  <ListItemDecorator>
                    {
                      [
                        <RiTruckLine key={index} />,
                        <RiStore3Line key={index} />,
                      ][index]
                    }
                  </ListItemDecorator>
                  <Radio
                    overlay
                    value={item}
                    label={t(item)}
                    disabled={isDisabled}
                    sx={{
                      flexDirection: "row-reverse",
                      fontSize: { xs: "sm", sm: "md" },
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
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </RadioGroup>
      </Box>

      <Grid container spacing={2} width={"100%"}>
        <Grid xs={12} lg={6} padding={0}>
          <Box display={"flex"} flexDirection={"column"} gap={0}>
            <Box
              // sx={{ display: { xs: "none", lg: "block" } }}
              p={1}
              width={"100%"}
            >
              <CartItems />
            </Box>
            {isLargeScreen && (
              <Box
                sx={{ display: { xs: "none", lg: "block" } }}
                p={0}
                width={"100%"}
              >
                <CartBillDetails />
              </Box>
            )}
          </Box>
        </Grid>

        <Grid xs={12} lg={6} padding={1}>
          <Box display={"flex"} flexDirection={"column"} gap={2}>
            <CartSideSection deliveryType={deliveryType} />
          </Box>
        </Grid>

        {!isLargeScreen && (
          <Grid xs={12} sx={{ display: { xs: "block", lg: "none" } }}>
            <CartBillDetails />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CartStepComponent;
