import * as React from "react";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { Typography, useTheme } from "@mui/joy";
import { RiDeleteBin5Line, RiErrorWarningFill } from "@remixicon/react";

import { deleteUserAccount } from "@/events/actions";
import { useTranslation } from "react-i18next";

const DeleteAccountModal = () => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Typography
        component={Button}
        title={t("Delete")}
        variant="h6"
        mb={2}
        onClick={() => setOpen(true)}
        sx={{
          color: theme.palette.primary[500],
          backgroundColor: theme.palette.background.surface,
          "&:hover": {
            backgroundColor: "inherit",
          },
        }}
        fontSize={20}
        endDecorator={<RiDeleteBin5Line size={24} />}
      />
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <RiErrorWarningFill />
            {t("confirmation")}
          </DialogTitle>
          <Divider />
          <DialogContent>
            {t("Are-you-sure-you-want-to-delete-your-Account")}
          </DialogContent>
          <DialogActions>
            <Button
              variant="solid"
              color="danger"
              onClick={() => deleteUserAccount()}
              sx={{ borderRadius: "sm" }}
            >
              {t("Delete")}
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setOpen(false)}
            >
              {t("cancel")}
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
};

export default DeleteAccountModal;
