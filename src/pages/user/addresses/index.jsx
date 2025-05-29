const BreadCrumb = dynamic(() => import("@/component/BreadCrumps/BreadCrumb"), {
  ssr: false,
});
import { Box } from "@mui/joy";
import dynamic from "next/dynamic";
import React from "react";
import AddressesView from "@/views/AddressesView";
import { HeadTitle } from "@/component/HeadTitle";
const UserLayout = dynamic(() => import("../UserLayout"), {
  ssr: false,
});

const UserAddressesPage = () => {
  return (
    <Box width={"100%"}>
      <HeadTitle title={"Addresses"} />

      <BreadCrumb />
      <UserLayout>
        <Box width={"100%"}>
          {" "}
          <AddressesView />
        </Box>
      </UserLayout>
    </Box>
  );
};

export default UserAddressesPage;
