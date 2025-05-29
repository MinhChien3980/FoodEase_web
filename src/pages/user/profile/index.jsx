const BreadCrumb = dynamic(() => import("@/component/BreadCrumps/BreadCrumb"), {
  ssr: false,
});
import { Box } from "@mui/joy";
import React from "react";
import dynamic from "next/dynamic";
import ProfileView from "@/views/ProfileView";
import { HeadTitle } from "@/component/HeadTitle";

const UserProfile = () => {
  const UserLayout = dynamic(() => import("../UserLayout"), {
    ssr: false,
  });
  return (
    <Box>
      <HeadTitle title={"Profile"} />

      <Box width={"100%"}>
        <BreadCrumb />
      </Box>
      <UserLayout>
        <ProfileView />
      </UserLayout>
    </Box>
  );
};

export default UserProfile;
