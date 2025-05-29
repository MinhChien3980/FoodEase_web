"use client";
import { store } from "@/store/store";
// import { CssBaseline, CssVarsProvider } from "@mui/joy";
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";

const materialTheme = materialExtendTheme();

import theme from "@/theme";
import { Provider, useSelector } from "react-redux";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { usePathname } from "next/navigation";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { persistor } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
import Layout from "@/layouts/layout";
import { onAppLoad, UpdateHomePageData } from "@/events/events";
import { getSettings } from "@/store/reducers/settings";
import BackToTop from "@/component/Buttons/BackToTop";
import SideDrawer from "@/component/Buttons/SideDrawer";
import CartSanckbar from "@/component/Cart/CartSanckbar";
import { isLogged } from "@/events/getters";
import { updateUserCart } from "@/events/actions";
import NotificationSnackBar from "@/component/Notification/NotificationSnackBar";
import Script from "next/script";
import { requestLocationPermission } from "@/helpers/functionHelpers";
import ScrollProgress from "@/component/ScrollProgressBar/ScrollProgress";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 600000,
      refetchOnWindowFocus: false, // default: true
    },
  },
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isRootPath = pathname === "/";
  useEffect(() => {
    let city_id = localStorage.getItem("city");
    if (city_id && pathname === "/home/") {
      UpdateHomePageData();
    }
    if (isLogged() && pathname === "/cart/") {
      updateUserCart();
    }
    getSettings();
    requestLocationPermission();
  }, []);

  return (
    <>
      {/* <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_API_KEY}&libraries=places`}
        strategy="lazyOnload"
      /> */}
      <MaterialCssVarsProvider
        defaultMode="system"
        theme={{ [MATERIAL_THEME_ID]: materialTheme }}
      >
        <JoyCssVarsProvider defaultMode="system" theme={theme} dir={"rtl"}>
          <CssBaseline enableColorScheme />
          <QueryClientProvider client={queryClient}>
            <Provider store={store}>
              {/* <PersistGate loading={null} persistor={persistor}> */}
              {isRootPath ? (
                children
              ) : (
                <Layout>
                  {children}
                  <CartSanckbar />
                  <NotificationSnackBar />
                </Layout>
              )}

              {/* </PersistGate> */}
            </Provider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>{" "}
          <BackToTop />
          <SideDrawer />
          <ProgressBar
            height="4px"
            color={"red"}
            options={{ showSpinner: false }}
            shallowRouting
          />
          {/* <ScrollProgress /> */}
          <Toaster position="top-right" />
          {/* <ToastContainer
            position="bottom-left"
            autoClose={5000}
            hideProgressBar
          /> */}
        </JoyCssVarsProvider>
      </MaterialCssVarsProvider>
    </>
  );
}
