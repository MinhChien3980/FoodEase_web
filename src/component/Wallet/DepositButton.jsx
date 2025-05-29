import {
  Button,
  Modal,
  ModalDialog,
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Input,
  useTheme,
  IconButton,
  Box,
} from "@mui/joy";
import React, { useState } from "react";
import PayPal from "../PaymentGateway/PayPal";
import RazorPay from "../PaymentGateway/RazorPay";
import FlutterWave from "../PaymentGateway/FlutterWave";
import PayStack from "../PaymentGateway/PayStack";
import Stripe from "../PaymentGateway/Stripe";
import MidTrans from "../PaymentGateway/MidTrans";
import { useSelector } from "react-redux";
import { RiCloseLargeFill } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import PhonePe from "../PaymentGateway/PhonePe";

const DepositButton = ({ setDepositModal, depositModal, transactionsData }) => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const { t } = useTranslation();

  const settings = useSelector((state) => state.settings.value);
  const currency = settings?.system_settings[0]?.currency;
  const paymentSettings = useSelector((state) => state.settings.value)
    ?.paymentMethod?.payment_method;

  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setDepositModal(false);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && /^[0-9]*$/.test(value))) {
      setAmount(value);
    }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setLoading(false);
  };

  const handleResetWallet = () => {
    setLoading(false);
    setPaymentMethod("");
    setAmount("");
  };

  const userData = useSelector((state) => state.userSettings?.value);

  const theme = useTheme();

  const renderPaymentGateway = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount greater than 0.");
      return setPaymentMethod("");
    }

    switch (paymentMethod) {
      case "PayPal":
        return (
          <PayPal
            userData={userData}
            final_total={amount}
            type={"wallet"}
            handleClose={(e) => handleClose(e)}
            transactionsData={transactionsData}
            loading={loading}
            setLoading={setLoading}
            handleResetWallet={handleResetWallet}
          />
        );
      case "RazorPay":
        return (
          <RazorPay
            userData={userData}
            final_total={amount}
            type={"wallet"}
            handleClose={(e) => handleClose(e)}
            transactionsData={transactionsData}
            loading={loading}
            setLoading={setLoading}
            handleResetWallet={handleResetWallet}
          />
        );
      case "Stripe":
        return (
          <Stripe
            userData={userData}
            final_total={amount}
            type={"wallet"}
            handleClose={(e) => handleClose(e)}
            transactionsData={transactionsData}
            loading={loading}
            setLoading={setLoading}
            handleResetWallet={handleResetWallet}
            wallet_amount={amount}
          />
        );
      case "FlutterWave":
        return (
          <FlutterWave
            userData={userData}
            final_total={amount}
            type={"wallet"}
            handleClose={(e) => handleClose(e)}
            transactionsData={transactionsData}
            loading={loading}
            setLoading={setLoading}
            handleResetWallet={handleResetWallet}
          />
        );
      case "PayStack":
        return (
          <PayStack
            userData={userData}
            final_total={amount}
            type={"wallet"}
            handleClose={(e) => handleClose(e)}
            transactionsData={transactionsData}
            loading={loading}
            setLoading={setLoading}
            handleResetWallet={handleResetWallet}
          />
        );
      case "midtrans":
        return (
          <MidTrans
            userData={userData}
            final_total={amount}
            type={"wallet"}
            handleClose={(e) => handleClose(e)}
            transactionsData={transactionsData}
            loading={loading}
            setLoading={setLoading}
            handleResetWallet={handleResetWallet}
          />
        );

      case "phonepe":
        return (
          <PhonePe
            userData={userData}
            final_total={amount}
            type={"wallet"}
            handleClose={(e) => handleClose(e)}
            transactionsData={transactionsData}
            loading={loading}
            setLoading={setLoading}
            handleResetWallet={handleResetWallet}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        open={depositModal}
        onClose={handleClose}
        aria-labelledby="modal-title"
        sx={{ overflowY: "auto" }}
      >
        <ModalDialog
          sx={{ width: 500, overflowY: "auto", overflowX: "hidden" }}
        >
          <Box sx={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                id="modal-title"
                component="h2"
                sx={{ fontSize: "lg" }}
              >
                {t("deposit-amount")}
              </Typography>
              <IconButton onClick={handleClose}>
                <RiCloseLargeFill size={20} />
              </IconButton>
            </Box>

            <Input
              placeholder={t("enter-the-amount")}
              type="number"
              value={amount}
              onChange={handleAmountChange}
              startDecorator={
                <Typography sx={{ color: theme.palette.text.currency }}>
                  {currency}
                </Typography>
              }
              sx={{
                mt: 0.5,
                color: theme.palette.text.currency,
                "& input::placeholder": {
                  color: theme.palette.text.primary,
                },
              }}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
            />
            <FormControl>
              <FormLabel>{t("payment-options")}</FormLabel>
              <RadioGroup
                name="payment-method"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                {paymentSettings?.paypal_payment_method == 1 && (
                  <Radio value="PayPal" label="PayPal" />
                )}
                {paymentSettings?.razorpay_payment_method == 1 && (
                  <Radio value="RazorPay" label="RazorPay" />
                )}
                {paymentSettings?.stripe_payment_method == 1 && (
                  <Radio value="Stripe" label="Stripe" />
                )}
                {paymentSettings?.flutterwave_payment_method == 1 && (
                  <Radio value="FlutterWave" label="FlutterWave" />
                )}
                {paymentSettings?.paystack_payment_method == 1 && (
                  <Radio value="PayStack" label="PayStack" />
                )}
                {paymentSettings?.midtrans_payment_method == 1 && (
                  <Radio value="midtrans" label="Midtrans" />
                )}
              </RadioGroup>
            </FormControl>
            {paymentMethod && renderPaymentGateway()}
          </Box>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default DepositButton;
