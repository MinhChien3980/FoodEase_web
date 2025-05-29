"use Client";
import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/joy";
import { useSelector } from "react-redux";
import Head from "next/head";
import dynamic from "next/dynamic";
import { getSettings } from "@/store/reducers/settings";
import { useRouter } from "next/router";
import Navbar from "@/component/Navbar/Navbar";
import MobileNavigation from "@/component/Navbar/MobileHeader";
// import WebMaintenanceMode from "@/views/WebMaintenanceMode";
// const WebMaintenanceMode = dynamic(() => import("@/views/WebMaintenanceMode"), {
//   ssr: false,
// });
const MobileBottomNavigation = dynamic(
  () => import("@/component/Navigation/MobileBottomNavigation"),
  {
    ssr: false,
  }
);

const Footer = dynamic(() => import("../views/Footer"), { ssr: false });

const Layout = ({ children }) => {
  const router = useRouter();
  const [setting, setSettings] = useState(null);

  const settings = useSelector((state) => state.settings?.value);

  const MaintenanceModeStatus = useSelector(
    (state) =>
      state.settings.value?.system_settings[0]?.is_web_maintenance_mode_on
  );
  useEffect(() => {
    if (MaintenanceModeStatus == 1) {
      router.push("/");
    }
  }, [MaintenanceModeStatus, router]);

  useEffect(() => {
    setSettings(settings);
  }, [settings]);

  return (
    <>
      <Container maxWidth={"xl2"} sx={{ minHeight: "80vh" }}>
        {setting && (
          <Head>
            <link
              rel="icon"
              href={setting?.web_settings[0]?.favicon}
              type="image/*"
              sizes="any"
            />
            <meta
              name="keywords"
              content={setting?.web_settings[0]?.meta_keywords}
            ></meta>
            <meta
              name="description"
              content={setting?.web_settings[0]?.meta_description}
            ></meta>
          </Head>
        )}

        <Box px={{ xs: 1, md: 8 }} display="flex" flexDirection="column">
          <Box
            px={{ md: 8 }}
            sx={{ flex: 1, display: { xs: "none", lg: "block" } }}
          >
            <Navbar />
          </Box>
          <Box
            px={{ xs: 1 }}
            sx={{ flex: 1, display: { xs: "block", lg: "none" } }}
          >
            <MobileNavigation />
          </Box>

          <Box mt={2} px={{ xs: 1, md: 8 }} sx={{ flex: 1 }}>
            {children}
          </Box>
        </Box>
      </Container>
      <Footer />
      <Box
        sx={{
          display: { xs: "block", md: "block", lg: "none" },
          width: "100%",
        }}
      >
        {/* Available For Small Screens Only */}
        <MobileBottomNavigation />
      </Box>
    </>
  );
};

export default Layout;
