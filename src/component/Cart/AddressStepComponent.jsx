import { Box } from "@mui/joy";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import AddressCard from "../Cards/AddressCard";
import EditUserAddressesModal from "../Models/EditUserAddressesModal";

const AddressStepComponent = ({ setCurrentStepIndex }) => {
  const Addresses = useSelector((state) => state.userAddresses.value);

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="flex-start"
      gap={2}
      className="address-container"
    >
      {Addresses?.map((address, index) => (
        <AddressCard
          key={index}
          address={address}
          isCartPage={true}
          setCurrentStepIndex={setCurrentStepIndex}
        />
      ))}
      <EditUserAddressesModal type={"add"} />
    </Box>
  );
};

export default AddressStepComponent;
