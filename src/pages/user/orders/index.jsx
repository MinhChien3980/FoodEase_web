const BreadCrumb = dynamic(() => import("@/component/BreadCrumps/BreadCrumb"), {
  ssr: false,
});
import { HeadTitle } from "@/component/HeadTitle";
import OrdersView from "@/views/OrdersView";
import { Box } from "@mui/joy";
import dynamic from "next/dynamic";
import React from "react";
const UserLayout = dynamic(() => import("../UserLayout"), {
  ssr: false,
});

const OrdersPage = () => {
  return (
    <Box width={"100%"}>
      <HeadTitle title={"Orders"} />
      <BreadCrumb />
      <UserLayout>
        <OrdersView />
      </UserLayout>
    </Box>
  );
};

export default OrdersPage;
