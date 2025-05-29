import { capitalizeFirstLetter, formatePrice } from "@/helpers/functionHelpers";
import { Box, Button, Chip, Grid, Typography, useTheme } from "@mui/joy";
import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSelector } from "react-redux";
import FoodType from "../FoodType/FoodType";
import { updateUserCart } from "@/events/actions";
import OrderDetailsModel from "../Models/OrderDetailsModel";
import { RiStarSmileLine } from "@remixicon/react";
import RateRiderModal from "../Models/RateRiderModal";
import RateProductModal from "../Models/RateProductModal";
import RateModal from "../Models/RateModal";
import { re_order, update_order_status } from "@/interceptor/api";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import LiveTrackingModal from "../Models/LiveTrackingModal";
import CancelOrderModal from "../Models/CancelOrderModal";
import Link from "next/link";
import openLightbox from "@/component/ImageBox/ImageLightbox";

const OrderCard = ({ order, status }) => {
  const { order_items = {}, total_payable, active_status, id, address } = order;
  const settings = useSelector((state) => state.settings.value);
  const [activeStatus, setActiveStatus] = useState(active_status);

  const theme = useTheme();
  /////////////////////////////////////////////////////////////////////
  const cancelable_till = order_items?.[0]?.cancelable_till;
  var cancellable_index = status.indexOf(cancelable_till);
  var active_index = status.indexOf(activeStatus);

  const [rateModal, setRateModal] = useState(false);
  const [orderID, setOrderID] = useState(id);

  const [productRateModal, setProductRateModal] = useState(false);
  const [productID, setProductID] = useState(0);

  const [riderRateModal, setRiderRateModal] = useState(false);
  const [riderID, setRiderID] = useState(0);
  const [orderDetailModal, setOrderDetailModal] = useState(false);
  const [OrderCancelModalState, setOrderCancelModal] = useState(false);

  const { t } = useTranslation();

  const ReOrder = async (order_id) => {
    const response = await re_order(order_id);
    if (response.error) {
      toast.error(response.message);
      return;
    } else {
      updateUserCart();
      toast.success(response.message);
    }
  };

  return (
    <Grid
      container
      display={"flex"}
      justifyContent={"space-between"}
      width={"100%"}
      mt={4}
      p={2}
      sx={{ boxShadow: "lg" }}
      borderRadius={"md"}
      spacing={2}
    >
      <Grid xs={12} sm={3} md={5} lg={4}>
        <Box
          sx={{
            "&:hover": {
              cursor: "pointer",
            },
          }}
        >
          <LazyLoadImage
            className="lazy-load-componet borderRadiusXs"
            src={order_items?.[0]?.partner_details?.[0]?.partner_profile}
            srcSet={`${order_items?.[0]?.partner_details?.[0]?.partner_profile} 2x`}
            loading="lazy"
            effect="blur"
            alt={order_items?.[0]?.name}
            onClick={() => {
              openLightbox([
                {
                  src: order_items?.[0]?.partner_details?.[0]?.partner_profile,
                  alt: order_items?.[0]?.name,
                  title: `Order # ${order_items?.[0]?.order_id}`,
                },
              ]);
            }}
          />
        </Box>
      </Grid>

      <Grid xs={12} sm={4} md={5} lg={6}>
        <Box display="flex" justifyContent="space-between">
          <Box flex={1}>
            <Typography fontWeight="bold" sx={{ fontSize: "xs" }}>
              # {order_items?.[0]?.order_id}
            </Typography>
            <Typography
              component={Link}
              href={`/restaurants/${order_items?.[0]?.partner_details?.[0]?.slug}`}
              fontWeight="bold"
              sx={{ fontSize: { xs: "md", lg: "lg" } }}
            >
              {order_items?.[0]?.partner_details?.[0]?.partner_name}
            </Typography>
            {order?.order_items?.map((order_data, index) => {
              const { product_name, quantity } = order_data;
              return (
                <Typography
                  variant="subtitle1"
                  component={Box}
                  key={index}
                  textAlign="start"
                  sx={{
                    display: "flex",
                    alignItems: "start",
                    fontSize: { xs: "sm", lg: "md" },
                    fontWeight: "xs",
                    color: theme.palette.text.primary,
                  }}
                  startDecorator={
                    <Box pt={0.5}>
                      <FoodType
                        size={16}
                        foodIndicator={
                          order_items?.[0]?.partner_details?.[0]
                            ?.partner_indicator
                        }
                      />
                    </Box>
                  }
                >
                  <span color={theme.palette.common.black}>
                    {quantity} × {product_name}
                  </span>
                </Typography>
              );
            })}
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: "sm", lg: "md" } }}
            >
              {order_items?.[0]?.date_added}
            </Typography>
          </Box>
        </Box>
      </Grid>

      <Grid xs={12} sm={3} md={2} lg={2}>
        <Chip
          color={
            activeStatus === "preparing"
              ? "primary"
              : activeStatus === "pending" || activeStatus === "awaiting"
              ? "warning"
              : activeStatus === "delivered"
              ? "success"
              : activeStatus === "out_for_delivery"
              ? "neutral"
              : activeStatus === "cancelled"
              ? "danger"
              : "default"
          }
          sx={{
            fontWeight: "bold",
            minWidth: "80px",
            textAlign: "center",
          }}
          variant="outlined"
        >
          {t(activeStatus)}
        </Chip>
      </Grid>

      <Box className="solid-border" mt={2} />
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        alignItems={"center"}
      >
        <Box>
          <Typography
            level="body1"
            sx={{ color: theme.palette.text.primary, fontWeight: "md" }}
          >
            {t("total-pay")}
          </Typography>
        </Box>
        <Box textAlign="end">
          <Typography
            level="body1"
            sx={{ color: theme.palette.text.currency, fontWeight: "lg" }}
          >
            {formatePrice(total_payable)}
          </Typography>
        </Box>
      </Box>

      <Box className="solid-border" mt={2} />

      <Box
        display={"flex"}
        gap={{ xs: 2, md: 1 }}
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent={{ xs: "center", md: "flex-start" }}
        width="100%"
      >
        <Button
          variant="outlined"
          onClick={(e) => {
            setOrderDetailModal(true);
          }}
        >
          {t("order-details")}
        </Button>
        {activeStatus != "cancelled" && (
          <>
            {order_items?.[0]?.is_cancelable == "1" &&
            active_index <= cancellable_index ? (
              <Button
                variant="outlined"
                color="danger"
                onClick={() => setOrderCancelModal(true)}
              >
                {t("cancel-order")}
              </Button>
            ) : null}
          </>
        )}
        {activeStatus == "delivered" && (
          <Box
            display={"flex"}
            maxWidth={"100%"}
            gap={{ xs: 2, md: 1 }}
            flexDirection={{ xs: "column", md: "row" }}
          >
            {orderID && (
              <Button
                variant="outlined"
                onClick={(e) => {
                  setRateModal(true);
                  setOrderID(id);
                }}
                startIcon={<RiStarSmileLine color="primary" />}
              >
                {t("rate-restaurant")}
              </Button>
            )}
            {orderID && (
              <Button
                variant="outlined"
                onClick={(e) => {
                  ReOrder(orderID);
                }}
                startIcon={<RiStarSmileLine color="primary" />}
              >
                {t("re-order")}
              </Button>
            )}
            {order?.order_product_rating == "" && (
              <Button
                variant="outlined"
                onClick={(e) => {
                  setProductRateModal(true);
                  setProductID(order_items[0]?.product_id);
                }}
                startIcon={<RiStarSmileLine color="primary" />}
              >
                {t("rate-product")}
              </Button>
            )}

            {order.rider_id && order.order_rider_rating == "" && (
              <Button
                variant="outlined"
                onClick={(e) => {
                  setRiderRateModal(true);
                  setRiderID(order.rider_id);
                }}
                startIcon={<RiStarSmileLine color="primary" />}
              >
                {t("rate-rider")}
              </Button>
            )}
          </Box>
        )}
        {activeStatus == "out_for_delivery" && (
          <LiveTrackingModal order_id={orderID} order={order} />
        )}
      </Box>

      {orderDetailModal == true ? (
        <OrderDetailsModel
          order={order}
          orderDetailModal={orderDetailModal}
          setOrderDetailModal={setOrderDetailModal}
        />
      ) : (
        ""
      )}

      {rateModal === true ? (
        <RateModal
          order={orderID}
          rateModal={rateModal}
          setRateModal={setRateModal}
        />
      ) : (
        ""
      )}

      {productRateModal === true ? (
        <RateProductModal
          order_items={order_items}
          order_id={orderID}
          rateModal={productRateModal}
          setRateModal={setProductRateModal}
        />
      ) : (
        ""
      )}

      {riderRateModal === true ? (
        <RateRiderModal
          orderId={id}
          rider_id={riderID}
          rider_image={order.rider_image}
          rider_name={order.rider_name}
          rateModal={riderRateModal}
          setRateModal={setRiderRateModal}
        />
      ) : (
        ""
      )}
      <CancelOrderModal
        cancelOrderModal={OrderCancelModalState}
        setCancelOrderModal={setOrderCancelModal}
        orderId={id}
        setActiveStatus={setActiveStatus}
      />
    </Grid>
  );
};

export default OrderCard;
