// components/LanguageProvider.js
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { store } from "@/store/store";
import { Box, useTheme } from "@mui/joy";

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const [languageLoaded, setLanguageLoaded] = useState(false);
  const currentLanguage = useSelector((state) => state.language.value);
  const theme = useTheme();

  useEffect(() => {
    let unsubscribe = null;

    const initializeLanguage = async () => {
      await i18n.changeLanguage(currentLanguage);
      setLanguageLoaded(true);

      // Subscribe to the Redux store updates
      unsubscribe = store.subscribe(() => {
        const newLanguage = store.getState().language.value;
        if (newLanguage !== i18n.language) {
          i18n.changeLanguage(newLanguage);
        }
      });
    };

    initializeLanguage();

    // Clean up the subscription when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [i18n, currentLanguage]);

  if (!languageLoaded) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          bgcolor: theme.palette.background.surface,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      />
    );
  }

  return children;
}
