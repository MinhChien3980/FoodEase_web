import {
  Box,
  Button,
  Card,
  CardActions,
  Checkbox,
  Divider,
  FormHelperText,
  List,
  ListItem,
  ListItemDecorator,
  Radio,
  RadioGroup,
  Typography,
  useTheme,
} from "@mui/joy";
import { RiSecurePaymentLine, RiWallet2Line } from "@remixicon/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PaymentActions from "../Payments/PaymentActions";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import Image from "next/image";

const PaymentStepComponent = ({ setCurrentStepIndex, loading, setLoading }) => {
  const [paymentMethod, setPaymentMethod] = useState(null);

  const [disableWalletBtn, setDisableWalletBtn] = useState(true);

  const [isWalletUsed, setIsWalletUsed] = useState(false);
  const handleWalletChange = (event) => {
    setIsWalletUsed(event.target.checked);
    if (event.target.checked) {
      if (Number(balance) >= Number(totalPayableAmount)) {
        setPaymentMethod("wallet");
      } else {
        setPaymentMethod(null);
      }
    } else {
      setPaymentMethod(null);
    }
  };
  const options = [
    "CashOnDelivery",
    "RazorPay",
    "PayPal",
    "Stripe",
    "FlutterWave",
    "PayStack",
    "Midtrans",
  ];
  const handleOptionChange = (event) => {
    if (!loading) {
      const selectedPaymentMethod = event.target.value;
      setPaymentMethod(selectedPaymentMethod);
    }
  };
  const paymentSettings = useSelector((state) => state.settings.value)
    ?.paymentMethod?.payment_method;

  const settings = useSelector((state) => state.settings.value);
  const currency = settings?.system_settings[0]?.currency;

  const balanceString = useSelector(
    (state) => state.userSettings?.value?.balance
  );

  // Remove commas and convert the string to a number
  const balance = balanceString
    ? parseFloat(balanceString.replace(/,/g, ""))
    : 0;

  const cartData = useSelector((state) => state.cart?.data);
  const [isCodAllowed, setIsCodAllowed] = useState(false);

  const totalPayableAmount = useSelector(
    (state) => state.cart?.totalPayableAmount
  );

  useEffect(() => {
    const checkCodAllowed = () => {
      if (!cartData) return false;

      // Check if all products in cart have cod_allowed set to '1'
      return cartData?.every((item) => {
        return item?.product_details.every(
          (detail) => detail?.cod_allowed == "1"
        );
      });
    };

    setIsCodAllowed(checkCodAllowed());
  }, [cartData]);

  useEffect(() => {
    if (loading) {
      setDisableWalletBtn(true);
      return;
    }
    if (parseFloat(balance) > 0) {
      setDisableWalletBtn(false);
    } else {
      setDisableWalletBtn(true);
    }
  }, [balance, loading]);

  const { t } = useTranslation();

  const theme = useTheme();

  useEffect(() => {
    if (paymentMethod == "wallet") {
      if (Number(totalPayableAmount) > Number(balance)) {
        toast.error(
          "Insufficient balance in your wallet. Please recharge or select an alternative payment method to Pay Remaining Amount."
        );
        setPaymentMethod(null);
      }
    }
  }, [paymentMethod, balance, totalPayableAmount]);
  return (
    <Box
      sx={{ borderRadius: "sm" }}
      className="boxShadow"
      p={2}
      gap={2}
      display={"flex"}
      flexDirection={"column"}
      height={"100%"}
      width={"100%"}
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
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"start"}
          gap={1}
        >
          <RiSecurePaymentLine color={"primary"} />
          <Typography color={"primary"} fontSize={"md"} fontWeight={"lg"}>
            {t("payment-options")}
          </Typography>
        </Box>
      </CardActions>
      {/* Payment Options */}

      <Box width={"100%"}>
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "center",
            justifyItems: { xs: "center", sm: "start" },
            width: "100%",
            flexWrap: "wrap",
          }}
        >
          <Box
            display={"flex"}
            justifyContent={"center"}
            width={"100%"}
            height={"100%"}
            flexWrap="wrap"
            justifyItems={{ xs: "center", sm: "start" }}
          >
            <RadioGroup
              aria-label="Your plan"
              name="PaymentMethod"
              value={paymentMethod}
              onChange={handleOptionChange}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyItems: { xs: "center", sm: "start" },
                flexDirection: "row",
                gap: 2,
              }}
            >
              {/* Wallet Option */}
              <List
                sx={{
                  display: "flex",
                  height: "100px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ListItem
                  variant="outlined"
                  sx={{
                    boxShadow: "sm",
                    borderRadius: "sm",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.palette.background.surface,
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Checkbox
                      checked={isWalletUsed}
                      onChange={handleWalletChange}
                      disabled={disableWalletBtn}
                    />
                    <Box sx={{ ml: 2 }}>
                      <Typography endDecorator={<RiWallet2Line />}>
                        {t("use-wallet")}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "start",
                          width: "100%",
                        }}
                      >
                        <Typography sx={{ fontSize: "sm" }}>
                          {t("available-balance")}:
                        </Typography>
                        <Typography
                          textAlign={"end"}
                          ml={0.5}
                          sx={{
                            fontsize: "xs",
                            color: theme.palette.text.currency,
                          }}
                        >
                          {currency}
                          {balance}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </ListItem>
              </List>

              {/* Dynamic Payment Methods */}
              {(!isWalletUsed ||
                Number(balance) < Number(totalPayableAmount)) &&
                [
                  {
                    condition:
                      paymentSettings?.cod_method === "1" && isCodAllowed,
                    value: "cod",
                    label: "COD",
                    icon: (
                      <Image
                        src="/Payments/cod.png"
                        alt=""
                        height={50}
                        width={50}
                      />
                    ),
                  },
                  {
                    condition: paymentSettings?.razorpay_payment_method === "1",
                    value: "RazorPay",
                    label: "RazorPay",
                    icon: (
                      <Image
                        src="/Payments/razorpay.png"
                        alt=""
                        height={50}
                        width={50}
                      />
                    ),
                  },
                  {
                    condition: paymentSettings?.paypal_payment_method === "1",
                    value: "PayPal",
                    label: "PayPal",
                    icon: (
                      <Image
                        src="/Payments/paypal.png"
                        alt=""
                        height={50}
                        width={50}
                      />
                    ),
                  },
                  {
                    condition: paymentSettings?.stripe_payment_method === "1",
                    value: "Stripe",
                    label: "Stripe",
                    icon: (
                      <Image
                        src="/Payments/stripe.png"
                        alt=""
                        height={50}
                        width={50}
                      />
                    ),
                  },
                  {
                    condition:
                      paymentSettings?.flutterwave_payment_method === "1",
                    value: "FlutterWave",
                    label: "FlutterWave",
                    icon: (
                      <Image
                        src="/Payments/flutterwave.png"
                        alt=""
                        height={50}
                        width={50}
                      />
                    ),
                  },
                  {
                    condition: paymentSettings?.paystack_payment_method === "1",
                    value: "PayStack",
                    label: "PayStack",
                    icon: (
                      <Image
                        src="/Payments/paystack.png"
                        alt=""
                        height={50}
                        width={50}
                      />
                    ),
                  },
                  {
                    condition: paymentSettings?.midtrans_payment_method === "1",
                    value: "Midtrans",
                    label: "Midtrans",
                    icon: (
                      <Image
                        src="/Payments/midtrans.jpg"
                        alt=""
                        height={50}
                        width={50}
                      />
                    ),
                  },
                ]
                  .filter((method) => method.condition)
                  .map((method, index) => (
                    <List
                      key={index}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        height: "100px",
                        justifyContent: "center",
                      }}
                    >
                      <ListItem
                        variant="outlined"
                        sx={{
                          boxShadow: "sm",
                          borderRadius: "sm",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: theme.palette.background.surface,
                        }}
                      >
                        <ListItemDecorator>{method.icon}</ListItemDecorator>
                        <Radio
                          overlay
                          value={method.value}
                          label={
                            <Typography
                              textAlign={"center"}
                              sx={{
                                ml: 3,
                                color: "primary.main",
                                width: "100px !important",
                              }}
                            >
                              {method.label}
                            </Typography>
                          }
                          sx={{
                            flexDirection: "row-reverse",
                            width: "160px",
                            height: "100px",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          slotProps={{
                            action: ({ checked }) => ({
                              sx: (theme) => ({
                                ...(checked && {
                                  inset: -1,
                                  border: "2px solid",
                                  borderColor: theme.vars.palette.primary[500],
                                  borderRadius: "sm",
                                }),
                              }),
                            }),
                          }}
                        />
                      </ListItem>
                    </List>
                  ))}
            </RadioGroup>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {isWalletUsed && (
              <>
                <Typography mt={1} color={"primary"} sx={{ fontSize: "sm" }}>
                  {t("wallet-balance-will-be-used")}:
                  <Typography
                    component={"span"}
                    ml={0.5}
                    sx={{
                      color: theme.palette.text.currency,
                      fontWeight: "md",
                    }}
                  >
                    {currency}
                    {Math.min(
                      parseFloat(balance),
                      parseFloat(totalPayableAmount)
                    ).toFixed(2)}
                  </Typography>
                </Typography>
                <Typography
                  ml={0.5}
                  color={"primary"}
                  sx={{ fontSize: "sm", fontWeight: "sm" }}
                  display={paymentMethod == "wallet" ? "none" : "block"}
                >
                  {t("remaining-to-pay")}:
                  <Typography
                    component={"span"}
                    ml={0.5}
                    sx={{
                      color: theme.palette.text.currency,
                      fontWeight: "md",
                    }}
                  >
                    {currency}
                    {Math.max(
                      0,
                      parseFloat(totalPayableAmount) - parseFloat(balance)
                    ).toFixed(2)}
                  </Typography>
                </Typography>
              </>
            )}
          </Box>
        </CardActions>
      </Box>

      <Divider sx={{ my: 1 }} />
      {/* Selected Payment Action*/}
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        minHeight={"15vh"}
      >
        <PaymentActions
          paymentMethod={paymentMethod}
          setCurrentStepIndex={setCurrentStepIndex}
          loading={loading}
          setLoading={setLoading}
          is_wallet_used={isWalletUsed ? 1 : 0}
          wallet_balance_used={
            isWalletUsed
              ? Math.min(Number(balance), Number(totalPayableAmount))
              : 0
          }
        />
      </Box>
    </Box>
  );
};

export default PaymentStepComponent;
