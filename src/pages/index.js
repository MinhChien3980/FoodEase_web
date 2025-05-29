"use client";
import Head from "next/head";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import CoverPage from "@/views/CoverPage";
import { Container } from "@mui/joy";
import { onAppLoad } from "@/events/events";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { updateFCM } from "../events/actions";
import * as fbq from "@/lib/fpixel";
import firebase from "firebase/compat/app";
import "firebase/compat/messaging";
import { getFirebaseConfig, getVapidKey } from "@/helpers/functionHelpers";
// import WebMaintenanceMode from "@/views/WebMaintenanceMode";

const WebMaintenanceMode = dynamic(() => import("@/views/WebMaintenanceMode"), {
  ssr: false,
});
const RETRY_INTERVAL_MS = 5000; // 5 seconds
const MAX_RETRIES = 8;

export default function Home() {
  const [MaintenanceMode, setMaintenanceModeStatus] = useState(false);
  // Redux state selectors
  const settings = useSelector((state) => state.settings.value);

  const selectedCity = useSelector((state) => state.selectedCity.value);

  // State for storing settings
  const [setting, setSettings] = React.useState(false);

  // Router instance
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Track a page view when the component mounts
    fbq.pageViewEvent();
    fbq.customEvent("coverPage-view");
  }, []);

  // Setting state when settings are available
  useEffect(() => {
    if (settings && Array.isArray(settings.web_settings) && settings.web_settings.length !== 0) {
      setSettings(settings);
    }
  }, [settings]);

  const MaintenanceModeStatus = useSelector(
    (state) =>
      state.settings.value?.system_settings?.[0]?.is_web_maintenance_mode_on
  );

  useLayoutEffect(() => {
    if (Object.keys(selectedCity).length !== 0) {
      onAppLoad();
      router.push("/home"); // Redirect to home if a city is selected
    } else if (pathname !== "/") {
      window.location.href = "/";
    }
    if (MaintenanceModeStatus == "1") {
      setMaintenanceModeStatus(true);
      router.push("/");
    } else {
      setMaintenanceModeStatus(false);
    }
  }, [MaintenanceModeStatus, selectedCity, router, pathname]);
  const useDelayedEffect = (callback, delay) => {
    useEffect(() => {
      const delayFn = async () => {
        await new Promise((resolve) => setTimeout(resolve, delay));
        callback();
      };

      delayFn();
    }, [callback, delay]);
  };
  useDelayedEffect(updateFCM, 10000);

  const currentDomain = process.env.NEXT_PUBLIC_ADMIN_PANEL_URL;

  return (
    <>
      {/* Rendering meta tags */}
      {setting && (
        <Head>
          <title>
            {setting?.web_settings[0]?.meta_description || "Food Order"}
          </title>
          <link
            rel="icon"
            href={setting?.web_settings[0]?.favicon}
            type="image/*"
            sizes="any"
          />
          <meta
            name="keywords"
            content={setting?.web_settings[0]?.meta_keywords}
          />
          <meta
            name="description"
            content={setting?.web_settings[0]?.meta_description}
          />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: `${currentDomain}/`,
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${currentDomain}/products/{search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            })}
          </script>
        </Head>
      )}

      {!MaintenanceMode && (
        <Container>
          <CoverPage />
        </Container>
      )}
      {MaintenanceMode && <WebMaintenanceMode />}
    </>
  );
}
