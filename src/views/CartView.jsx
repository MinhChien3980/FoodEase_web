import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { formatePrice } from "@/helpers/functionHelpers";
const BreadCrumb = dynamic(() => import("@/component/BreadCrumps/BreadCrumb"), {
  ssr: false,
});
import {
  Box,
  Step,
  StepIndicator,
  stepClasses,
  Stepper,
  Typography,
  Button,
  useTheme,
  AvatarGroup,
  Avatar,
  Chip,
} from "@mui/joy";
import { stepIndicatorClasses } from "@mui/joy/StepIndicator";
import {
  RiBankCardLine,
  RiBuilding2Fill,
  RiBuilding2Line,
  RiCheckLine,
  RiHome8Line,
  RiHomeSmileLine,
  RiInformation2Line,
  RiMapPin2Line,
  RiShieldCheckLine,
  RiShoppingCartLine,
  RiSmartphoneLine,
} from "@remixicon/react";
import CartStepComponent from "@/component/Cart/CartStepComponent";
import Confetti from "react-confetti";
import AddressStepComponent from "@/component/Cart/AddressStepComponent";
import PaymentStepComponent from "@/component/Cart/PaymentStepComponent";
import CompletedStepComponent from "@/component/Cart/CompletedStepComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  setDeliveryAddress,
  setDeliveryType,
} from "@/store/reducers/deliveryTipSlice";
import { CardMedia, Fade, Popover, Tooltip } from "@mui/material";
import EmptyCartImage from "../../public/assets/images/empty.svg";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { setPromoCode } from "@/store/reducers/promoCodeSlice";
import ProfileNavigation from "@/component/Profile/ProfileNavigation";
import { selectDefaultAddress } from "@/helpers/functionHelpers";
import { updateUserSettings } from "@/events/actions";
import ProfileModal from "@/component/Models/ProfileModal";
import toast from "react-hot-toast";
import openLightbox from "@/component/ImageBox/ImageLightbox";

const CartView = () => {
  const Cart = useSelector((state) => state.cart?.data);
  const theme = useTheme();
  const [currentStepIndex, setCurrentStepIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [deliveryType, setDeliveryType2] = useState("Delivery");
  const [areAllAvailable, setAllAvailable] = useState(true);
  const [areAllInStock, setAllInStock] = useState(true);

  const userData = useSelector((state) => state.userSettings?.value);
  const dispatch = useDispatch();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const areAllProductsAvailable = () => {
    // Get current time in "HH:mm:ss" format
    const currentTime = new Date().toTimeString().split(" ")[0];

    // Check if there are any products in the cart
    if (!Cart || Cart.length === 0) {
      return false; // No products in the cart
    }

    // Loop through each product in the cart
    for (const item of Cart) {
      const productDetails = item.product_details;

      // Check if the first object in the product_details array has start_time and end_time
      if (productDetails && productDetails.length > 0) {
        const { start_time, end_time } = productDetails[0];

        // If product is available all the time
        if (start_time === "00:00:00" && end_time === "00:00:00") {
          continue; // This product is always available, check next product
        }

        // If product has specific start and end times, check if it's available now
        if (currentTime < start_time || currentTime > end_time) {
          return false; // Product is not available now
        }
      }
    }

    // If all products are available at the current time, return true
    return true;
  };
  const checkAllInStock = () => {
    // Check if there are any products in the cart
    if (!Cart || Cart.length === 0) {
      return false; // No products in the cart
    }

    // Loop through each product in the cart
    for (const item of Cart) {
      const productDetails = item.product_details;

      // Check if the first object in the product_details array has stock information
      if (productDetails && productDetails.length > 0) {
        const { stock } = productDetails[0];

        // If any product is out of stock (stock <= 0), return false
        if (Number(stock) <= 0) {
          return false;
        }
      }
    }

    // If all products are in stock, return true
    return true;
  };
  // Usage

  useEffect(() => {
    const allAvailable = areAllProductsAvailable();
    const AllInStock = checkAllInStock();
    setAllAvailable(allAvailable);
    setAllInStock(AllInStock);
  }, [Cart]);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const deliveryAddress = useSelector(
    (state) => state.deliveryHelper.deliveryAddress
  );

  useEffect(() => {
    dispatch(setDeliveryAddress()); // eslint-disable-next-line
    dispatch(setDeliveryType(deliveryType)); // eslint-disable-next-line
  }, [deliveryType]);

  useEffect(() => {
    if (currentStepIndex == 3) {
      updateUserSettings();
    }
  }, [currentStepIndex]);

  useEffect(() => {
    selectDefaultAddress();
  }, []);

  const handleDeliveryTypeChange = useCallback(
    (selectedDeliveryType) => {
      setDeliveryType2(selectedDeliveryType);
      dispatch(setDeliveryType(selectedDeliveryType));
    },
    [dispatch]
  );
  const handleNext = () => {
    if (userData.mobile == "") {
      toast.error("Please Add Mobile Number for Order");
      setOpenProfileModal(true);
      return;
    }
    if (deliveryType == "Self-PickUp" && currentStepIndex == 1) {
      setCurrentStepIndex(currentStepIndex + 2);
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (deliveryType == "Self-PickUp" && currentStepIndex == 3) {
      setCurrentStepIndex(currentStepIndex - 2);
    } else {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  useEffect(() => {
    if (Cart.length == 0) {
      dispatch(setPromoCode([]));
    }
  }, [Cart, dispatch]);

  const { t } = useTranslation();
  const MAX_AVATARS = 3;
  const avatarsToShow = Cart.slice(0, MAX_AVATARS);
  const surplus = Cart.length > MAX_AVATARS ? Cart.length - MAX_AVATARS : 0;
  let totalPayableAmount = useSelector(
    (state) => state.cart.totalPayableAmount
  );
  return (
    <Box display={"flex"} flexDirection={"column"} gap={2}>
      <BreadCrumb />
      {Cart?.length > 0 ? (
        <>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <AvatarGroup component={"div"}>
              {avatarsToShow.map((avatar, index) => (
                <Tooltip
                  key={avatar.id}
                  title={avatar.name}
                  onClick={() => {
                    const transformedAvatars = avatarsToShow.map((avatar) => ({
                      src: avatar.image,
                      alt: avatar.name,
                      title: avatar.name,
                    }));
                    console.log(transformedAvatars);
                    openLightbox(transformedAvatars, index, true);
                  }}
                >
                  <Avatar
                    key={avatar.id}
                    src={avatar.image}
                    alt=""
                    sx={{
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  />
                </Tooltip>
              ))}

              {!!surplus && <Avatar>+{surplus}</Avatar>}
            </AvatarGroup>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: "xl",
                  fontSize: "md",
                }}
              >
                {t("total-payable")}:
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.text.currency,
                  fontWeight: "xl",
                  fontSize: "md",
                }}
              >
                {formatePrice(totalPayableAmount)}
              </Typography>
            </Box>
          </Box>
          <Stepper
            size="md"
            sx={{
              width: "100%",
              "--StepIndicator-size": "2.5rem",
              "--Step-connectorInset": "0px",
              [`& .${stepIndicatorClasses.root}`]: {
                borderWidth: 3,
              },
              [`& .${stepClasses.root}::after`]: {
                height: 3,
              },
              [`& .${stepClasses.completed}`]: {
                [`& .${stepIndicatorClasses.root}`]: {
                  borderColor: "primary.300",
                  color: "primary.300",
                },
                "&::after": {
                  bgcolor: "primary.300",
                },
              },
              [`& .${stepClasses.active}`]: {
                [`& .${stepIndicatorClasses.root}`]: {
                  borderColor: "currentColor",
                },
              },
              [`& .${stepClasses.disabled} *`]: {
                color: "neutral.outlinedDisabledColor",
              },
            }}
          >
            {/* Render steps */}
            <Step
              completed={currentStepIndex + 1 > 1}
              orientation="vertical"
              indicator={
                <StepIndicator
                  variant="outlined"
                  color={currentStepIndex + 1 > 1 ? "primary" : "neutral"}
                >
                  {currentStepIndex > 1 ? (
                    <RiCheckLine />
                  ) : (
                    <RiShoppingCartLine />
                  )}
                </StepIndicator>
              }
            >
              <Typography
                sx={{
                  textTransform: "none",
                  fontWeight: "lg",
                  fontSize: "0.75rem",
                  letterSpacing: "0.5px",
                }}
              >
                {t("cart")}
              </Typography>
            </Step>
            <Step
              orientation="vertical"
              completed={currentStepIndex + 1 > 2}
              indicator={
                <StepIndicator
                  variant="outlined"
                  color={currentStepIndex + 1 > 2 ? "primary" : "neutral"}
                >
                  {currentStepIndex > 2 ? <RiCheckLine /> : <RiHome8Line />}
                </StepIndicator>
              }
              sx={{ display: deliveryType === "Self-PickUp" ? "none" : {} }}
            >
              <Typography
                sx={{
                  textTransform: "none",
                  fontWeight: "lg",
                  fontSize: "0.75rem",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                }}
                endDecorator={
                  <RiInformation2Line onClick={handlePopoverOpen} />
                }
              >
                {t("address")}
              </Typography>
              {deliveryAddress && (
                <Popover
                  className="cursor"
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handlePopoverClose}
                  TransitionComponent={Fade}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <Box p={2} py={1}>
                    <Typography
                      color="textPrimary"
                      startDecorator={<RiMapPin2Line />}
                      mb={1}
                    >
                      {deliveryAddress.address}
                    </Typography>

                    <Typography
                      color="textPrimary"
                      startDecorator={<RiBuilding2Line />}
                      mb={1}
                    >
                      {deliveryAddress.city}
                    </Typography>
                    <Typography
                      color="textPrimary"
                      startDecorator={<RiSmartphoneLine />}
                      mb={1}
                    >
                      {deliveryAddress.mobile}
                    </Typography>
                    <Typography
                      color="textPrimary"
                      startDecorator={<RiHomeSmileLine />}
                      mb={1}
                    >
                      {deliveryAddress.type}
                    </Typography>
                    {/* Add more fields as needed */}
                  </Box>
                </Popover>
              )}
            </Step>

            <Step
              orientation="vertical"
              completed={currentStepIndex + 1 > 3}
              indicator={
                <StepIndicator
                  variant="outlined"
                  color={currentStepIndex + 1 > 3 ? "primary" : "neutral"}
                >
                  {currentStepIndex > 3 ? <RiCheckLine /> : <RiBankCardLine />}
                </StepIndicator>
              }
            >
              <Typography
                sx={{
                  textTransform: "none",
                  fontWeight: "lg",
                  fontSize: "0.75rem",
                  letterSpacing: "0.5px",
                }}
              >
                {t("payment&billing")}
              </Typography>
            </Step>
            <Step
              orientation="vertical"
              completed={currentStepIndex + 1 > 4}
              indicator={
                <StepIndicator
                  variant="outlined"
                  color={currentStepIndex + 1 > 4 ? "primary" : "neutral"}
                >
                  {currentStepIndex > 4 ? (
                    <RiCheckLine />
                  ) : (
                    <RiShieldCheckLine />
                  )}
                </StepIndicator>
              }
            >
              <Typography
                sx={{
                  textTransform: "none",
                  fontWeight: "lg",
                  fontSize: "0.75rem",
                  letterSpacing: "0.5px",
                }}
              >
                {t("completed")}
              </Typography>
            </Step>
          </Stepper>
          <Box
            display={currentStepIndex == 1 ? {} : "none"}
            alignItems={"center"}
            minHeight={"60vh"}
          >
            <CartStepComponent
              onDeliveryTypeChange={handleDeliveryTypeChange}
            />
          </Box>
          <Box
            display={currentStepIndex === 2 ? {} : "none"}
            alignItems={"center"}
            minHeight={"60vh"}
          >
            <AddressStepComponent setCurrentStepIndex={setCurrentStepIndex} />
          </Box>
          <Box
            display={currentStepIndex === 3 ? {} : "none"}
            alignItems={"center"}
            minHeight={"60vh"}
          >
            <PaymentStepComponent
              setCurrentStepIndex={setCurrentStepIndex}
              loading={loading}
              setLoading={setLoading}
            />
          </Box>
          <Box
            display={currentStepIndex === 4 ? "flex" : "none"}
            alignItems={"center"}
            justifyContent={"center"}
            minHeight={"60vh"}
          >
            <CompletedStepComponent />
          </Box>
          {currentStepIndex < 4 && (
            <>
              {areAllAvailable ? (
                <>
                  {areAllInStock ? (
                    <Box display={"flex"} gap={2} flex="1" mb={2}>
                      <Button
                        variant="solid"
                        flexgrow="1"
                        sx={{ width: "100px" }}
                        onClick={handlePrevious}
                        disabled={loading ? true : currentStepIndex === 1}
                      >
                        {t("Previous")}
                      </Button>
                      <Button
                        variant="solid"
                        flexgrow="1"
                        sx={{ width: "100px" }}
                        onClick={handleNext}
                        disabled={loading ? true : currentStepIndex >= 2}
                      >
                        {t("Next")}
                      </Button>
                    </Box>
                  ) : (
                    <Chip
                      variant="soft"
                      color="warning"
                      size="lg"
                      sx={{
                        borderRadius: "8px", // Rounded corners for a smooth look
                        fontSize: "14px", // Slightly larger font for readability
                        padding: "8px 16px", // Add some padding for spacing
                        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                        marginY: 2,
                      }}
                    >
                      Some products are not In Stock at this time. Please check
                      back later.
                    </Chip>
                  )}
                </>
              ) : (
                <Box
                  my={2}
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "start",
                  }}
                >
                  <Chip
                    variant="soft"
                    color="warning"
                    size="lg"
                    sx={{
                      borderRadius: "8px", // Rounded corners for a smooth look
                      fontSize: "14px", // Slightly larger font for readability
                      padding: "8px 16px", // Add some padding for spacing
                      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                    }}
                  >
                    Some products are not available at this time. Please check
                    back later.
                  </Chip>
                </Box>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <Box
            display="flex"
            flexDirection={"column"}
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
            my={2}
          >
            <Box sx={{ width: { xs: "100%", lg: "80%", xl: "60%" } }} mb={2}>
              <ProfileNavigation />
            </Box>
            <CardMedia
              component="img"
              image="/assets/images/emptyCartIcon.svg"
              alt="Empty Cart"
              sx={{ width: "30vw", maxWidth: "200px" }}
            />
            <Typography
              component={"h1"}
              sx={{ fontWeight: "xl2", fontSize: { xs: "lg", md: "xl2" } }}
            >
              {t("no-order-yet")}
            </Typography>
            <Typography
              fontWeight={"sm"}
              sx={{ fontSize: { xs: "sm", md: "md" } }}
            >
              {t("Looks-like-you-haven't-made-your-choice-yet")}
            </Typography>

            <Button
              onClick={() => router.push("/products")}
              sx={{ marginY: 2 }}
            >
              {t("Browse-Menu")}
            </Button>
          </Box>
        </>
      )}
      {currentStepIndex === 4 && <Confetti />}{" "}
      <ProfileModal open={openProfileModal} setOpen={setOpenProfileModal} />
    </Box>
  );
};

export default CartView;
