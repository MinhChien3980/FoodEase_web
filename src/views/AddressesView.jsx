import { Box } from "@mui/joy";
import React from "react";
import { useSelector } from "react-redux";
import AddressCard from "../component/Cards/AddressCard";
import EditUserAddressesModal from "@/component/Models/EditUserAddressesModal";

const AddressesView = () => {
  const Addresses = useSelector((state) => state.userAddresses.value);

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      className="address-container"
      justifyContent={{ xs: "center", md: "start" }}
      width={"100%"}
    >
      {Addresses?.map((address, index) => (
        <AddressCard key={index} address={address} isCartPage={false} />
      ))}

      <EditUserAddressesModal type="add" />
    </Box>
  );
};

export default AddressesView;
