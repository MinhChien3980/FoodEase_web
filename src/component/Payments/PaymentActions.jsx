import { Box } from "@mui/joy";
import React from "react";
import CODPayment from "./CODPayment";
import OnlineMethod from "./OnlineMethod";
import WalletPayment from "./WalletPayment";

const PaymentActions = ({
  paymentMethod,
  setCurrentStepIndex,
  loading,
  setLoading,
  is_wallet_used,
  wallet_balance_used,
}) => {
  return (
    <Box width={"100%"}>
      {paymentMethod == "wallet" && (
        <WalletPayment
          setCurrentStepIndex={setCurrentStepIndex}
          loading={loading}
          setLoading={setLoading}
        />
      )}

      {paymentMethod == "cod" && (
        <CODPayment
          setCurrentStepIndex={setCurrentStepIndex}
          loading={loading}
          setLoading={setLoading}
          is_wallet_used={is_wallet_used}
          wallet_balance_used={wallet_balance_used}
        />
      )}
      {paymentMethod !== "cod" && (
        <OnlineMethod
          setCurrentStepIndex={setCurrentStepIndex}
          paymentMethod={paymentMethod}
          loading={loading}
          setLoading={setLoading}
          is_wallet_used={is_wallet_used}
          wallet_balance_used={wallet_balance_used}
        />
      )}
    </Box>
  );
};

export default PaymentActions;
