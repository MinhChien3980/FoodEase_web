const BreadCrumb = dynamic(() => import("@/component/BreadCrumps/BreadCrumb"), {
  ssr: false,
});
import { HeadTitle } from "@/component/HeadTitle";
import TransactionsView from "@/views/TransactionsView";
import { Box } from "@mui/joy";
import dynamic from "next/dynamic";
import React from "react";
const UserLayout = dynamic(() => import("../UserLayout"), {
  ssr: false,
});
const TransactionsPage = () => {
  return (
    <Box width={"100%"}>
      <HeadTitle title={"Transactions"} />

      <Box width={"100%"}>
        <BreadCrumb />
      </Box>

      <UserLayout>
        <TransactionsView />
      </UserLayout>
    </Box>
  );
};

export default TransactionsPage;
