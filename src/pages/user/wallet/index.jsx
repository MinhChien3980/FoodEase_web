const BreadCrumb = dynamic(() => import("@/component/BreadCrumps/BreadCrumb"), {
  ssr: false,
});
import { HeadTitle } from "@/component/HeadTitle";
import { Box } from "@mui/joy";
import dynamic from "next/dynamic";
import React from "react";
import WalletPageView from "@/views/WalletPageView";

const UserLayout = dynamic(() => import("../UserLayout"), {
  ssr: false,
});
const WalletPage = () => {
  return (
    <Box width={"100%"}>
      <HeadTitle title={"Wallet"} />

      <Box width={"100%"}>
        <BreadCrumb />
      </Box>

      <UserLayout>
        <Box
          gap={4}
          mt={1}
          width={"100%"}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <WalletPageView />
        </Box>
      </UserLayout>
    </Box>
  );
};

export default WalletPage;
