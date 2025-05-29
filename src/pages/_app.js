import "@/styles/globals.css";
import RootLayout from "@/pages/layout";
import i18n from "../i18n";
import { I18nextProvider } from "react-i18next";
import Script from "next/script";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { LanguageProvider } from "../component/LanguageProvider";
import { useEffect, useState } from "react";
import {
  disableDevTools,
  getFirebaseConfig,
  getVapidKey,
} from "@/helpers/functionHelpers";
import firebase from "firebase/compat/app";
import "firebase/compat/messaging";
const RETRY_INTERVAL_MS = 5000; // 5 seconds
const MAX_RETRIES = 8;

export default function App({ Component, pageProps }) {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  useEffect(() => {
    let retryCount = 0;

    const initFirebase = async () => {
      const config = getFirebaseConfig(); // Get dynamic Firebase config
      if (config && Object.keys(config).length > 0) {
        console.log("Firebase config: OK");

        if (!firebase.apps.length) {
          try {
            firebase.initializeApp(config);
            console.log("Firebase initialized successfully");

            const messaging = firebase.messaging();

            // Register Service Worker
            if ("serviceWorker" in navigator) {
              try {
                const registration = await navigator.serviceWorker.register(
                  "/firebase-messaging-sw.js"
                );
                console.log("Service Worker registered");

                // Wait for the service worker to be "active" before sending the config
                if (registration.installing) {
                  registration.installing.addEventListener(
                    "statechange",
                    (e) => {
                      if (e.target.state === "activated") {
                        console.log("Service Worker activated");
                        registration.active.postMessage({
                          type: "INIT_FIREBASE",
                          config,
                        });
                      }
                    }
                  );
                } else if (registration.active) {
                  // If already active, directly send the message
                  registration.active.postMessage({
                    type: "INIT_FIREBASE",
                    config,
                  });
                }

                // Request permission and get token
                const requestPermission = async () => {
                  const permission = await Notification.requestPermission();
                  if (permission === "granted") {
                    let token = await messaging.getToken({
                      vapidKey: getVapidKey(),
                      serviceWorkerRegistration: registration,
                    });
                    console.log("FCM Token Generated");
                    localStorage.setItem("fcm_id", token);
                  } else {
                    console.error("Notification permission denied");
                  }
                };

                await requestPermission();
                setFirebaseInitialized(true);
              } catch (error) {
                console.error("Service Worker registration failed:", error);
                retryInitialization();
              }
            } else {
              console.error("Service Worker not supported");
              setFirebaseInitialized(true);
            }
          } catch (error) {
            console.error("Firebase initialization failed:", error);
            retryInitialization();
          }
        } else {
          console.log("Firebase already initialized");
          setFirebaseInitialized(true);
        }
      } else {
        console.log("Firebase config is not available or empty");
        retryInitialization();
      }
    };

    const retryInitialization = () => {
      retryCount++;
      if (retryCount < MAX_RETRIES) {
        console.log(
          `Retrying Firebase initialization (attempt ${
            retryCount + 1
          }/${MAX_RETRIES})...`
        );
        setTimeout(initFirebase, RETRY_INTERVAL_MS);
      } else {
        console.error(
          `Failed to initialize Firebase after ${MAX_RETRIES} attempts`
        );
        setFirebaseInitialized(true); // Set to true to prevent further retries
      }
    };

    initFirebase();
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DEMO_MODE == "false") {
      const cleanup = disableDevTools();
      // Cleanup when the component unmounts
      return cleanup;
    }
  }, []);
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <LanguageProvider>
          <RootLayout>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" />
            <Component {...pageProps} />
          </RootLayout>
        </LanguageProvider>
      </I18nextProvider>
    </Provider>
  );
}
