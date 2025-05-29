import {
  Box,
  Modal,
  Typography,
  IconButton,
  Textarea,
  Button,
  ModalDialog,
  ModalClose,
  Divider,
  Avatar,
} from "@mui/joy";
import { DialogTitle } from "@mui/joy";
import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";
import { toast } from "react-hot-toast";
import { give_rider_rating } from "@/interceptor/api";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/joy";
import { capitalizeFirstLetter } from "@/helpers/functionHelpers";
const RateRiderModal = ({
  rider_id,
  rider_image,
  rider_name,
  rateModal,
  setRateModal,
  orderId,
}) => {
  const { t } = useTranslation();
  console.log("riderID", rider_id);
  const [open, setOpen] = useState(rateModal);
  const handleClose = () => {
    setOpen(false);
    setRateModal(false);
  };
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const theme = useTheme();

  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleOrderRating = () => {
    give_rider_rating(rider_id, rating, comment, orderId).then((res) => {
      if (res.error) {
        return toast.error(
          "The Rating field must contain a number greater than 0."
        );
      } else {
        toast.success("Rider Rated Successfully");
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
      onClose={(e) => handleClose()}
    >
      <ModalDialog
        color="primary"
        variant="soft"
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
              {t("give-rider-rating")}
            </Typography>
          </DialogTitle>

          <Divider sx={{ marginTop: 1 }} />

          <Box sx={{ display: "flex", justifyContent: "start", gap: 4 }} mt={2}>
            <Avatar
              src={rider_image}
              alt={rider_name}
              sx={{ width: "100px", height: "100%" }}
            />
            <Typography
              sx={{ color: theme.palette.text.primary, fontSize: "xl" }}
            >
              {capitalizeFirstLetter(rider_name)}
            </Typography>
          </Box>

          <Box>
            <Box mt={1}>
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
                placeholder={t(
                  "Share-Your-Thoughts-or-views-regarding-this-Rider"
                )}
                value={comment}
                minRows={4}
                onChange={(e) => setComment(e.target.value)}
              />
            </Box>

            <Box mt={2}>
              <Button onClick={(e) => handleOrderRating()}>
                {t("give-rating")}
              </Button>
            </Box>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default RateRiderModal;
