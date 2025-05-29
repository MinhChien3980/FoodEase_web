import {
  Box,
  Modal,
  Typography,
  Textarea,
  Button,
  ModalDialog,
  ModalClose,
  Card,
  CardContent,
  Stack,
  Avatar,
  IconButton,
} from "@mui/joy";
import { DialogTitle } from "@mui/joy";
import React, { useState, useEffect } from "react";
import { Rating } from "react-simple-star-rating";
import { give_product_rating } from "@/interceptor/api";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/joy";
import { RiCloseLine, RiExportLine } from "@remixicon/react";

const FileUploadButton = ({ onChange, label }) => (
  <Button
    component="label"
    startDecorator={<RiExportLine />}
    variant="outlined"
    color="primary"
    sx={{ marginTop: 2 }}
  >
    {label}
    <input type="file" hidden multiple accept="image/*" onChange={onChange} />
  </Button>
);

const RateProductModal = ({
  order_items,
  order_id,
  rateModal,
  setRateModal,
}) => {
  const [open, setOpen] = useState(rateModal);
  const handleClose = () => {
    setOpen(false);
    setRateModal(false);
  };
  const theme = useTheme();
  const [productRatings, setProductRatings] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (order_items) {
      setProductRatings(
        order_items.map((item) => ({
          product_id: item.product_id,
          rating: 0,
          comment: "",
          images: [],
          imagePreviewUrls: [],
          product_name: item.product_name,
          image: item.image,
        }))
      );
    }
  }, [order_items]);

  const handleRating = (rate, index) => {
    setProductRatings((prev) =>
      prev.map((item, i) => (i === index ? { ...item, rating: rate } : item))
    );
  };

  const handleComment = (comment, index) => {
    setProductRatings((prev) =>
      prev.map((item, i) => (i === index ? { ...item, comment } : item))
    );
  };

  const handleFiles = (files, index) => {
    const newImages = Array.from(files);
    const newImagePreviewUrls = newImages.map((file) =>
      URL.createObjectURL(file)
    );

    setProductRatings((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              images: [...item.images, ...newImages],
              imagePreviewUrls: [
                ...item.imagePreviewUrls,
                ...newImagePreviewUrls,
              ],
            }
          : item
      )
    );
  };

  const removeImage = (productIndex, imageIndex) => {
    setProductRatings((prev) =>
      prev.map((item, i) =>
        i === productIndex
          ? {
              ...item,
              images: item.images.filter((_, idx) => idx !== imageIndex),
              imagePreviewUrls: item.imagePreviewUrls.filter(
                (_, idx) => idx !== imageIndex
              ),
            }
          : item
      )
    );
  };

  const handleOrderRating = () => {
    const hasEmptyRating = productRatings.some(
      (product) => product.rating === 0
    );

    if (hasEmptyRating) {
      // Show toast message and return early if any rating is 0
      toast.error("Rating should not be empty");
      return;
    }

    const formData = new FormData();
    formData.append("order_id", order_id);

    productRatings.forEach((product, index) => {
      formData.append(
        `product_rating_data[${index}][product_id]`,
        product.product_id
      );
      formData.append(`product_rating_data[${index}][rating]`, product.rating);
      if (product.comment) {
        formData.append(
          `product_rating_data[${index}][comment]`,
          product.comment
        );
      }
      product.images.forEach((image, imageIndex) => {
        formData.append(
          `product_rating_data[${index}][images][${imageIndex}]`,
          image
        );
      });
    });

    give_product_rating(formData).then((res) => {
      if (res.error === true) {
        return toast.error(res.message);
      } else {
        toast.success("Products Rated Successfully");
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
      onClose={handleClose}
    >
      <ModalDialog
        color="primary"
        variant="soft"
        sx={{
          width: {
            sm: "100vh",
            md: "70vh",
            lg: "80vh",
          },
          maxHeight: "90vh",
          minHeight: "90vh",
          overflowY: "auto",
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
              {t("rate-products")}
            </Typography>
          </DialogTitle>

          <Stack spacing={2} mt={2}>
            {productRatings.map((product, index) => (
              <Card key={product.product_id}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      src={product.image}
                      alt={product.product_name}
                      size="lg"
                      sx={{
                        objectFit: "cover",
                        objectPosition: "center",
                        width: 80,
                        height: 80,
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                      }}
                    />
                    <Typography
                      ml={2}
                      sx={{
                        fontWeight: "xl",
                        textAlign: "top",
                        fontSize: { xs: "sm", md: "md" },
                      }}
                    >
                      {product.product_name}
                    </Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle1">{t("rate")}</Typography>
                    <Rating
                      onClick={(rate) => handleRating(rate, index)}
                      initialValue={product.rating}
                    />
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle1">{t("comment")}</Typography>
                    <Textarea
                      placeholder={t("share-your-thoughts")}
                      value={product.comment}
                      minRows={2}
                      onChange={(e) => handleComment(e.target.value, index)}
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1">{t("images")}</Typography>
                    <FileUploadButton
                      label={t("upload-images")}
                      onChange={(e) => handleFiles(e.target.files, index)}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 4,
                        mt: 4,
                        width: "100%",
                      }}
                    >
                      {product.imagePreviewUrls.map((url, imgIndex) => (
                        <Box key={imgIndex} sx={{ position: "relative" }}>
                          <Box
                            component={"img"}
                            src={url}
                            alt={`Preview ${imgIndex}`}
                            sx={{
                              width: 100,
                              height: 100,
                              objectFit: "cover",
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => removeImage(index, imgIndex)}
                            sx={{
                              position: "absolute",
                              top: -12,
                              right: -12,
                              backgroundColor: theme.palette.primary[100],
                              "&:hover": {
                                backgroundColor: theme.palette.primary[200],
                              },
                            }}
                          >
                            <RiCloseLine />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>

          <Box mt={2}>
            <Button onClick={handleOrderRating} fullWidth>
              {t("give-rating")}
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default RateProductModal;
