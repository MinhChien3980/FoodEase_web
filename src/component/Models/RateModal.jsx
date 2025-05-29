import {
  Box,
  Modal,
  Typography,
  IconButton,
  Textarea,
  Button,
  ModalDialog,
  ModalClose,
  TextField,
  Input,
  useTheme,
} from "@mui/joy";
import { DialogTitle } from "@mui/joy";
import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";
import { give_order_rating } from "@/interceptor/api";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import styled, { css } from "styled-components";

const RateModal = ({ order, rateModal, setRateModal }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [open, setOpen] = useState(rateModal);
  const handleClose = () => {
    setOpen(false);
    setRateModal(false);
  };
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState([]);

  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleFiles = (e) => {
    setFiles(e.target.files);
  };

  const handleOrderRating = () => {
    if (rating === 0) {
      toast.error("Rating should not be empty");
      return;
    }
    give_order_rating(
      order,
      rating,
      comment,
      files.length > 0 ? files : []
    ).then((res) => {
      if (res.error) {
        return toast.error(
          "The Rating field must contain a number greater than 0."
        );
      } else {
        toast.success("Order Rated Successfully");
        handleClose();
        return;
      }
    });
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      onClose={handleClose} // Removed unnecessary function wrapping
    >
      <ModalDialog
        color="primary"
        variant="soft"
        // sx={style} // Apply the style object here
        sx={{
          width: {
            sm: "100vh",
            md: "50vh",
            lg: "65vh",
          },
          backgroundColor: theme.palette.background.surface,
        }}
      >
        <ModalClose
          onClick={handleClose}
          sx={{
            backgroundColor: theme.palette.background.surface,
            color: theme.palette.text.primary,
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        />

        <Box>
          <DialogTitle
            display={"flex"}
            sx={{ px: 0, pt: 0 }}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography
              variant="h4"
              sx={{ color: theme.palette.text.primary }}
              fontWeight={"bold"}
            >
              {t("rate-restaurant")}
            </Typography>
          </DialogTitle>

          <Box mt={1}>
            <Box>
              <Typography
                variant="h6"
                sx={{ color: theme.palette.text.primary }}
              >
                {t("rate")}
              </Typography>
              <Rating onClick={handleRating} initialValue={rating} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ color: theme.palette.text.primary }}
              >
                {t("comment")}
              </Typography>
              <Textarea
                sx={{ p: 1 }}
                placeholder={t(
                  "Share-Your-Thoughts-or-views-regarding-this-order"
                )}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Box>
            <Box mt={1}>
              <Typography
                variant="h6"
                sx={{ color: theme.palette.text.primary }}
              >
                {t("images")}{" "}
              </Typography>
              <Input
                sx={{
                  p: 1,
                }}
                type="file"
                onChange={handleFiles}
                multiple
                accept="image/*"
              />
              {/* TextField gives error. */}
            </Box>
            <Box mt={2}>
              <Button onClick={handleOrderRating}> {t("give-rating")} </Button>
            </Box>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default RateModal;
