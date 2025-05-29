import React, { useState } from "react";
import {
  Button,
  Modal,
  Box,
  Input,
  Typography,
  FormControl,
  FormLabel,
  IconButton,
  useTheme,
  ModalDialog,
  Textarea,
} from "@mui/joy";
import { RiCloseLargeFill } from "@remixicon/react";
import { useSelector } from "react-redux";
import { send_withdraw_request } from "@/interceptor/api";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { updateUserSettings } from "@/events/actions";

const WithdrawButton = ({ withdrawModal, setWithDrawModal }) => {
  const settings = useSelector((state) => state.settings.value);
  const currency = settings?.system_settings[0]?.currency;
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const inputRef = React.useRef(null);

  const { t } = useTranslation();
  const theme = useTheme();

  const handleCloseModal = () => {
    setWithDrawModal(false);
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount greater than 0.");
      return;
    }

    if (!address) {
      toast.error("Please enter a valid address.");
      return;
    }

    const res = await send_withdraw_request(amount, address);
    if (res.error) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
      setAddress();
      setAmount();
      updateUserSettings();
    }
    handleCloseModal();
  };

  return (
    <>
      <Modal open={withdrawModal} onClose={handleCloseModal}>
        <ModalDialog sx={{ width: 500 }}>
          <Box
            sx={{
              borderRadius: "md",
              outline: "none",
            }}
          >
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
                {t("withdraw")}
              </Typography>
              <IconButton onClick={handleCloseModal}>
                <RiCloseLargeFill size={20} />
              </IconButton>
            </Box>
            <FormControl margin="normal" sx={{ mt: 2 }}>
              <FormLabel>{t("amount")}</FormLabel>
              <Input
                placeholder={t("enter-the-amount")}
                value={amount}
                type="number"
                onChange={(e) => setAmount(e.target.value)}
                slotProps={{
                  input: {
                    ref: inputRef,
                    min: 0,
                    step: 1,
                  },
                }}
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
              />
            </FormControl>
            <FormControl margin="normal" sx={{ mt: 2, width: "100" }}>
              <FormLabel>
                {t("Bank-Account")} / {t("Crypto")} / {t("Wallet-Address")}
              </FormLabel>
              <Textarea
                minRows={3}
                placeholder={t("Enter-Payment-Address")}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                sx={{ mt: 0.5 }}
              />
              <Button onClick={handleWithdraw} sx={{ mt: 2, width: "100%" }}>
                {t("send-withdraw-request")}
              </Button>
            </FormControl>
          </Box>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default WithdrawButton;
