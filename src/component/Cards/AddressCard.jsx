import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Chip, Grid, Typography, useTheme } from "@mui/joy";
import { RiBuildingFill, RiHome4Fill, RiMapPinFill } from "@remixicon/react";
import { capitalizeFirstLetter } from "@/helpers/functionHelpers";
import {
  selectDeliveryAddress,
  setDeliveryAddress,
} from "@/store/reducers/deliveryTipSlice";
import Delete from "../Models/DeleteUserAddressModal";
import EditUserAddressesModal from "../Models/EditUserAddressesModal";
import { useTranslation } from "react-i18next";

const AddressCard = ({ address, isCartPage = false, setCurrentStepIndex }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [isSelected, setIsSelected] = useState(false);

  const updateDeliveryAddressInRedux = () => {
    dispatch(setDeliveryAddress(address));
    setCurrentStepIndex(3);
  };

  const selectedAddress = useSelector(selectDeliveryAddress);

  useEffect(() => {
    if (!isCartPage) {
      return;
    }
    if (selectedAddress?.id == address.id) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [address, selectedAddress, isCartPage]);

  const getAddressIcon = (type) => {
    const iconColor = theme.palette.primary[500];
    switch (type) {
      case "home":
        return <RiHome4Fill color={iconColor} />;
      case "office":
        return <RiBuildingFill color={iconColor} />;
      default:
        return <RiMapPinFill color={iconColor} />;
    }
  };

  return (
    <Box
      p={2}
      className="boxShadow"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      gap={2}
      sx={{
        borderRadius: "md",
        backgroundColor: theme.palette.background.surface,
        width: "100%",
        border: isSelected ? "2px solid" : "none",
        borderColor: isSelected ? theme.palette.primary[500] : "none",
      }}
    >
      <Grid container width="100%" display="flex" gap={2}>
        <Grid xs={1}>{getAddressIcon(address.type)}</Grid>
        <Grid
          xs={10}
          display="flex"
          flexDirection="column"
          sx={{ whiteSpace: "nowrap" }}
        >
          <Box
            sx={{ display: "flex", justifyContent: "space-between" }}
            mb={0.5}
          >
            <Typography fontWeight={"xl"}>
              {capitalizeFirstLetter(address.type)}
            </Typography>
            {address.is_default == "1" && (
              <Chip color="warning">{t("default")}</Chip>
            )}
          </Box>
          <Typography sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
            {address.address.replace(/,/g, ",\u200B").replace(/ /g, "\u00A0")}
          </Typography>

          <Typography mt={1}>+{address.mobile}</Typography>
        </Grid>
      </Grid>
      <Box display="flex" alignItems="flex-end" gap={2} mx={3}>
        {!isCartPage ? (
          <>
            <EditUserAddressesModal buttonType="edit" address={address} />
            <Delete id={address.id} />
          </>
        ) : (
          <Button
            variant="plain"
            size="lg"
            sx={{ paddingY: 0.5 }}
            onClick={updateDeliveryAddressInRedux}
          >
            {t("deliver-here")}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default AddressCard;
