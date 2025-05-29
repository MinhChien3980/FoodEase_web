import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, IconButton, Typography } from "@mui/joy";
import SunFillIcon from "remixicon-react/SunFillIcon";
import MoonFillIcon from "remixicon-react/MoonFillIcon";
import { useTranslation } from "react-i18next";

import { setDarkMode } from "../../store/reducers/darkModeSlice";
import { useColorScheme as useJoyColorScheme } from "@mui/joy/styles";
import { useColorScheme as useMaterialColorScheme } from "@mui/material/styles";

function DarkModeToggleMobile() {
  const { t, i18n } = useTranslation();

  const {
    mode,
    setMode: setMaterialMode,
    systemMode,
  } = useMaterialColorScheme();
  const { setMode: setJoyMode } = useJoyColorScheme();

  useEffect(() => {
    if (systemMode == "dark") {
      setMaterialMode(systemMode);
      setJoyMode(systemMode);
      dispatch(setDarkMode("dark"));
    } else if (systemMode == "light") {
      setMaterialMode(systemMode);
      setJoyMode(systemMode);
      dispatch(setDarkMode("light"));
    }
  }, []);

  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.darkMode.value);

  const [modes, setModes] = useState("dark");

  useEffect(() => {
    setModes(isDarkMode);
  }, [isDarkMode]);
  const handleToggle = () => {
    if (mode == "light") {
      dispatch(setDarkMode("dark"));
      setMaterialMode(mode == "dark" ? "light" : "dark");
      setJoyMode(mode == "dark" ? "light" : "dark");
      setMaterialMode("dark");
    } else if (mode == "dark") {
      dispatch(setDarkMode("light"));
      setMaterialMode(mode == "dark" ? "light" : "dark");
      setJoyMode(mode == "dark" ? "light" : "dark");

      setMaterialMode("light");
    }
  };
  return (
    <IconButton
      onClick={handleToggle}
      color="inherit"
      sx={{ justifyContent: "start", paddingInline: 0 }}
    >
      {modes == "dark" ? (
        <Box gap={0.5} display={"flex"} justifyContent={"center"}>
          <MoonFillIcon
            color={modes == "light" ? "black" : "white"}
            size={"24px"}
          />
          <Typography fontSize={"md"} fontWeight={"lg"}>
            {t("dark")}
          </Typography>
        </Box>
      ) : (
        <Box gap={0.5} display={"flex"} justifyContent={"center"}>
          <SunFillIcon
            color={modes == "dark" ? "white" : "black"}
            size={"24px"}
          />
          <Typography fontSize={"md"} fontWeight={"lg"}>
            {t("light")}
          </Typography>
        </Box>
      )}
    </IconButton>
  );
}

export default DarkModeToggleMobile;
