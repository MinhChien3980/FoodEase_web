import React from "react";
import {
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from "@mui/joy";
import { RiCloseFill, RiErrorWarningFill } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { keyframes, css } from "@emotion/react";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

const showAnimation = keyframes`
  0% {
    transform: scale(0.7) translate(-50%, -50%);
    opacity: 0;
    transform-origin: center;
  }
  40% {
    transform: scale(1.05) translate(-50%, -50%);
    opacity: 1;
    transform-origin: center;
  }
  70% {
    transform: scale(0.95) translate(-50%, -50%);
    transform-origin: center;
  }
  85% {
    transform: scale(1) translate(-50%, -50%);
    transform-origin: center;
  }
  100% {
    transform: scale(1) translate(-50%, -50%);
    opacity: 1;
    transform-origin: center;
  }
`;

const modalStyle = css`
  animation: ${showAnimation} 0.5s ease-out forwards;
  display: flex;
  justify-content: center;
  align-items: center;
  width: "100%";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center;
`;

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: "grey.500",
  position: "absolute",
  boxShadow: theme.shadows[2],
  transform: "translate(10px, -10px)",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: "transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out",
  "&:hover": {
    transform: "translate(7px, -5px)",
  },
  maxBlockSize: 32,
}));
const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  content,
  confirmBtnText,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-modal"
      aria-describedby="confirm-modal-description"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }} // Center the modal using flexbox
    >
      <ModalDialog variant="outlined" role="alertdialog" sx={modalStyle}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <RiErrorWarningFill size={32} />
          {t("confirmation")}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <CustomCloseButton onClick={onClose}>
            <RiCloseFill />
          </CustomCloseButton>
          {content}
        </DialogContent>
        <DialogActions>
          <Button variant="solid" color="danger" onClick={onConfirm}>
            {confirmBtnText}
          </Button>
          <Button variant="outlined" color="neutral" onClick={onClose}>
            {t("cancel")}
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export default ConfirmModal;
