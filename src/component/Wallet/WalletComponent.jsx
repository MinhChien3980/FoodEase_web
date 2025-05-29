import { Box, CardContent, Grid, Typography, useTheme, Button } from "@mui/joy";
import {
  RiWallet3Fill,
  RiCornerRightDownLine,
  RiCornerRightUpLine,
} from "@remixicon/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import WithdrawButton from "./WithdrawButton";
import DepositButton from "./DepositButton";
import { formatePrice } from "@/helpers/functionHelpers";

const WalletComponent = ({ transactionsData }) => {
  const userData = useSelector((state) => state.userSettings?.value);
  const settings = useSelector((state) => state.settings.value);
  const theme = useTheme();
  const { t } = useTranslation();
  const iconColor = theme.palette.common.black;

  const [withdrawModal, setWithDrawModal] = useState(false);
  const [depositModal, setDepositModal] = useState(false);

  const HandleModal = (type) => {
    if (type == "deposit") {
      setDepositModal(true);
    } else {
      setWithDrawModal(true);
    }
  };

  const ActionButton = ({ label, type }) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      gap={1}
    >
      <Button
        onClick={() => HandleModal(type)}
        sx={{
          borderRadius: "50%",
          width: 74,
          height: 74,
          bgcolor: theme.palette.primary[100],
          display: "flex",
          justifyContent: "center",
          padding: 1,
          alignItems: "center",
          "&:hover": {
            backgroundColor: theme.palette.primary[200],
          },
          "& > svg": {
            transform: "translateX(4px)",
          },
        }}
      >
        <RiWallet3Fill color={iconColor} size={48} />
        {type == "deposit" ? (
          <RiCornerRightDownLine color={iconColor} size={48} />
        ) : (
          <RiCornerRightUpLine color={iconColor} size={48} />
        )}
      </Button>
      <Typography textAlign="center">{label}</Typography>
    </Box>
  );

  return (
    <Box
      className="boxShadow"
      sx={{
        borderRadius: "md",
        width: "100%",
        padding: 3,
        backgroundColor: theme.palette.background.surface,
      }}
    >
      <CardContent
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "start",
        }}
      >
        <Typography
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "start" },
            fontSize: "lg",
            fontWeight: "lg",
            color: theme.palette.text.primary,
          }}
        >
          {t("Wallet")} {t("Balance")}
        </Typography>
      </CardContent>

      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: { xs: "center", sm: "end" },
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
        }}
        mt={{ xs: 2, sm: 0 }}
      >
        <Grid xs={6}>
          <Typography
            textAlign={{ xs: "center", sm: "start" }}
            sx={{
              fontSize: { xs: "xl2", sm: "xl4" },
              fontWeight: "xl",
              color: theme.palette.text.currency,
            }}
          >
            {formatePrice(userData?.balance)}
          </Typography>
        </Grid>
        <Grid
          xs={6}
          sx={{ display: "flex", justifyContent: { xs: "center", sm: "end" } }}
          gap={4}
          mt={{ xs: 2, sm: 0 }}
        >
          <ActionButton label={t("withdraw")} type={"withdraw"} />
          <ActionButton label={t("deposit")} type={"deposit"} />
        </Grid>
      </Grid>

      <WithdrawButton
        withdrawModal={withdrawModal}
        setWithDrawModal={setWithDrawModal}
      />
      <DepositButton
        transactionsData={transactionsData}
        depositModal={depositModal}
        setDepositModal={setDepositModal}
      />
    </Box>
  );
};

export default WalletComponent;
