import { capitalizeFirstLetter, formatePrice } from "@/helpers/functionHelpers";
import {
  Button,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
  useTheme,
  Divider,
  Grid,
  Box,
  Avatar,
} from "@mui/joy";
import {
  RiDownload2Line,
  RiDownloadCloudFill,
  RiEBike2Line,
  RiStarFill,
} from "@remixicon/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { LazyLoadImage } from "react-lazy-load-image-component";

const OrderDetailsModal = ({
  order,
  orderDetailModal,
  setOrderDetailModal,
  product_name,
  quantity,
}) => {
  const { order_items, total_payable, active_status, id, address } = order;
  const { t } = useTranslation();

  const [open, setOpen] = useState(orderDetailModal);
  const theme = useTheme();
  const handleClose = () => {
    setOpen(false);
    setOrderDetailModal(false);
  };

  const downloadInvoice = () => {
    let invoiceHtml = order.thermal_invoice_html;

    // Remove unnecessary external links (or inline critical styles)
    // You can replace this with necessary styles
    invoiceHtml = invoiceHtml.replace(
      /<link rel="stylesheet".*?>/g,
      "<style>/* Inline critical styles here */</style>"
    );

    // Create a temporary container for the invoice HTML
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = invoiceHtml;

    // Set options for html2pdf
    const options = {
      margin: 10,
      filename: "invoice.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] }, // Enable automatic page breaks
    };

    // Use html2pdf to generate and download the PDF
    html2pdf()
      .from(tempContainer)
      .set(options)
      .save()
      .then(() => {
        // Clean up: remove the temporary container
        tempContainer.remove();
      });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        backdropFilter: "opacity(1)",
        bgcolor: theme.palette.background.default,
        width: "100%",
      }}
    >
      <ModalDialog
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          margin: "auto",
          overflowY: "auto",
          maxWidth: "600px",
          width: {
            xs: "90vw",
            sm: "80vw",
          },
        }}
      >
        <ModalClose />
        <Typography
          id="modal-title"
          level="h5"
          mb={1}
          sx={{ color: theme.palette.primary[500], fontWeight: "500" }}
        >
          {t("order-summary")}
        </Typography>
        <Divider sx={{ my: 0 }} />

        <Grid container spacing={2}>
          <Grid
            xs={3}
            sm={2}
            md={2}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <LazyLoadImage
              src={order_items[0].partner_details[0].partner_profile}
              srcSet={`${order_items[0].partner_details[0].partner_profile} 2x`}
              loading="lazy"
              effect="blur"
              width={"70px"}
              height={"70px"}
              className="object-fit"
              alt={order_items[0].name}
            />
          </Grid>
          <Grid xs={7} sm={8}>
            <Box mb={2}>
              <Box display="flex" flexDirection="column">
                <Typography fontWeight="xl">
                  {order_items[0].partner_details[0].partner_name}
                </Typography>
                <Typography
                  variant="body3"
                  component="p"
                  sx={{ color: "var(--light-color--)" }}
                >
                  {order &&
                    order.order_items[0].partner_details[0].partner_address}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid
            xs={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "end",
              height: "100%",
            }}
          >
            <Button
              onClick={downloadInvoice}
              title="Download"
              sx={{
                width: "auto",
                height: "auto",
                padding: 1,
                backgroundColor: theme.palette.background.surface,
                "&:hover": {
                  backgroundColor: "inherit",
                },
              }}
              startDecorator={
                <RiDownload2Line size={24} color={theme.palette.text.primary} />
              }
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid xs={12}>
            {order &&
              order.order_items.map((order_data, index) => {
                return (
                  <Box key={index} mb={2}>
                    <Typography
                      variant="body2"
                      component="p"
                      sx={{ fontWeight: 600 }}
                    >
                      {order_data.product_name}
                    </Typography>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      gap={{ xs: 1, sm: 0 }}
                    >
                      <Typography variant="body2" component="p">
                        <span>{order_data.quantity}</span> ×{" "}
                        {formatePrice(order_data.price)}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        sx={{ color: theme.palette.text.currency }}
                      >
                        {formatePrice(order_data.sub_total)}
                      </Typography>
                    </Box>

                    {order_data.add_ons.length > 0 && (
                      <>
                        <Typography
                          variant="body2"
                          component="p"
                          sx={{ fontWeight: 600 }}
                        >
                          Addons
                        </Typography>

                        {order_data.add_ons.map((addon, index) => {
                          return (
                            <Box
                              key={index} // Add a key prop when mapping to components
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              gap={{ xs: 1, sm: 0 }}
                            >
                              <Typography
                                variant="body2"
                                component="p"
                                fontWeight={500}
                                sx={{ color: theme.palette.text.currency }}
                              >
                                {addon.title}
                                <Typography
                                  variant="body2"
                                  component="span"
                                  textAlign={"start"}
                                >
                                  {addon.quantity} × {addon.qty}
                                </Typography>
                              </Typography>

                              <Typography
                                variant="body2"
                                fontWeight={500}
                                sx={{ color: theme.palette.text.currency }}
                              >
                                {formatePrice(addon.price)}
                              </Typography>
                            </Box>
                          );
                        })}
                      </>
                    )}

                    <Divider sx={{ my: 1 }} />
                  </Box>
                );
              })}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography
                level="h4"
                fontWeight={"xl"}
                fontSize={"md"}
                textAlign={"start"}
              >
                {t("total")}
              </Typography>
              <Typography
                level="h4"
                fontSize={16}
                textAlign={"end"}
                sx={{ fontWeight: 600 }}
              >
                {formatePrice(order && order.total)}
              </Typography>
            </Box>

            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography variant="body2" component="p" textAlign={"start"}>
                {t("taxes-and-charges")}
              </Typography>
              <Typography variant="body1" component="p" textAlign={"end"}>
                + {formatePrice(order && order.tax_amount)}
              </Typography>
            </Box>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography variant="body2" component="p" textAlign={"start"}>
                {t("delivery-charges")}
              </Typography>
              <Typography variant="body1" component="p" textAlign={"end"}>
                + {formatePrice(order && order.delivery_charge)}
              </Typography>
            </Box>
            <Box
              display={
                order.delivery_tip === "0" || order.delivery_tip === ""
                  ? "none"
                  : "flex"
              }
              justifyContent={"space-between"}
            >
              <Typography variant="body2" component="p" textAlign={"start"}>
                {t("Tip-Delivery-Boy")}
              </Typography>
              <Typography variant="body1" component="p" textAlign={"end"}>
                + {formatePrice(order && order.delivery_tip)}
              </Typography>
            </Box>
            <Box
              display={
                order.promo_discount === "0" || order.promo_discount === ""
                  ? "none"
                  : "flex"
              }
              justifyContent={"space-between"}
            >
              <Typography variant="body2" component="p" textAlign={"start"}>
                {t("promoCode-discount")}
              </Typography>
              <Typography
                variant="body1"
                component="p"
                textAlign={"end"}
                color="danger"
              >
                -{formatePrice(order && order.promo_discount)}
              </Typography>
            </Box>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography
                fontWeight={600}
                variant="body1"
                component="p"
                textAlign={"start"}
              >
                {t("total-pay")}
              </Typography>
              <Typography
                fontWeight={600}
                variant="body1"
                component="p"
                className="values"
                textAlign={"end"}
              >
                {formatePrice(order && order.total_payable)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 0 }} />
        <Grid container>
          <Grid xs={12}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography
                textAlign={"start"}
                fontWeight={"xl"}
                level="h4"
                fontSize={"lg"}
              >
                {t("grand-total")}
              </Typography>
              <Typography
                textAlign={"end"}
                fontWeight={"xl"}
                level="h4"
                fontSize={"lg"}
              >
                {formatePrice(order && order.total_payable)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {order.rider_id != "" && <Divider sx={{ my: 0 }} />}

        {order.rider_id != "" && (
          <>
            <Grid container>
              <Grid xs={12}>
                <Typography
                  startDecorator={
                    <RiEBike2Line color={theme.palette.text.primary} />
                  }
                  sx={{ fontWeight: "xl", fontSize: "lg" }}
                  mb={2}
                >
                  {t("your-partner-text")}
                </Typography>
              </Grid>
              <Grid xs={4} display={"flex"} justifyContent={"start"} gap={2}>
                <Avatar src={order.rider_image} size="lg" />
                <Typography
                  sx={{ color: theme.palette.text.primary, fontSize: "md" }}
                >
                  {capitalizeFirstLetter(order.rider_name)}
                </Typography>
              </Grid>
              <Grid xs={8} display={"flex"} justifyContent={"end"}>
                {order.rider_rating && (
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"end"}
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    <RiStarFill
                      color={theme.palette.warning[400]}
                      sx={{
                        fontSize: { xs: "1rem", sm: "1.25rem" },
                      }}
                    />
                    <Typography
                      sx={{
                        px: { xs: 0.5, sm: 1 },
                        fontSize: "inherit",
                      }}
                    >
                      {order.rider_rating ?? 0}
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </>
        )}
        <Divider sx={{ my: 0 }} />
        <Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            gap={{ xs: 1, sm: 0 }}
          >
            <Typography variant="body1">{t("order_id")}</Typography>
            <Typography variant="body2" component="p">
              # {order && order.order_items[0].order_id}
            </Typography>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            gap={{ xs: 1, sm: 0 }}
          >
            <Typography variant="body1" component="p">
              {t("OTP")}
            </Typography>
            <Typography variant="body2" component="p">
              {order && order.otp}
            </Typography>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            gap={{ xs: 1, sm: 0 }}
          >
            <Typography variant="body1" component="p">
              {t("payment")}
            </Typography>
            <Typography variant="body2" component="p">
              {t("paid-using")} {order && order.payment_method}
            </Typography>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            gap={{ xs: 1, sm: 0 }}
          >
            <Typography variant="body1" component="p">
              {t("date")}
            </Typography>
            <Typography variant="body2" component="p">
              {order && order.date_added}
            </Typography>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            gap={{ xs: 1, sm: 0 }}
          >
            <Typography variant="body1" component="p">
              {t("phone-number")}
            </Typography>
            <Typography variant="body2" component="p">
              {order && order.mobile.substring(0, 7)}×××
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" component="p">
                {t("deliver-to")}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" component="p">
                {order && order.address}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Button sx={{ width: "100%" }} onClick={handleClose}>
          {t("close")}
        </Button>
      </ModalDialog>
    </Modal>
  );
};

export default OrderDetailsModal;
