import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { delete_address } from "@/interceptor/api";
import toast from "react-hot-toast";
import { deleteUserAddress } from "@/store/reducers/userAddressesSlice";
import { useTranslation } from "react-i18next";
import { Button, useTheme } from "@mui/joy";

const Delete = ({ id }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteAddress(id);
      toast.success("Address deleted successfully");
      dispatch(deleteUserAddress(id));
    } catch (error) {
      toast.error("Error deleting address: " + error.message);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      await delete_address(addressId);
    } catch (error) {
      throw new Error("Failed to delete address: " + error.message);
    }
  };
  const theme = useTheme();
  return (
    <>
      <Button
        variant="soft"
        onClick={handleClickOpen}
        sx={{
          color: theme.palette.danger,
        }}
      >
        {t("delete")}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this address?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Close
          </Button>
          <Button
            autoFocus
            onClick={handleDelete}
            color="error"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Delete;
