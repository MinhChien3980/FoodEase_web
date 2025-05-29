import React, { useState } from "react";
import { update_order_status } from "@/interceptor/api";
import toast from "react-hot-toast";
import * as fbq from "@/lib/fpixel";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
  ModalDialog,
  Textarea,
} from "@mui/joy";

const CancelOrderModal = ({
  cancelOrderModal,
  setCancelOrderModal,
  orderId,
  setActiveStatus,
}) => {
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");

  const handleReasonChange = (event) => {
    setReason(event.target.value);
    if (event.target.value.trim() !== "") {
      setReasonError("");
    }
  };

  const handleCancelOrder = async () => {
    if (reason.trim() === "") {
      setReasonError("Please provide a reason for cancellation.");
      toast.error("Please provide a reason for cancellation.");
      return;
    }

    try {
      const response = await update_order_status("cancelled", orderId, reason);
      if (!response.error) {
        toast.success(response.message);
        setCancelOrderModal(false);
        setActiveStatus("cancelled");
        fbq.customEvent("cancel-order", { orderId, reason });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while cancelling the order.");
    }
  };

  return (
    <Modal open={cancelOrderModal} onClose={() => setCancelOrderModal(false)}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>Confirmation</DialogTitle>
        <Divider />
        <DialogContent>
          <Box>Are you sure you want to cancel this order?</Box>
          <Box marginTop={2}>
            <Textarea
              fullWidth
              autoFocus
              placeholder="Reason for cancellation"
              value={reason}
              onChange={handleReasonChange}
              minRows={3}
              error={!!reasonError}
              helperText={reasonError}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="solid"
            color="danger"
            onClick={() => setCancelOrderModal(false)}
          >
            Cancel
          </Button>
          <Button variant="plain" color="neutral" onClick={handleCancelOrder}>
            Confirm
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export default CancelOrderModal;
