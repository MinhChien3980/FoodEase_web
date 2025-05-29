import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@mui/joy";
import SunFillIcon from "remixicon-react/SunFillIcon";
import MoonFillIcon from "remixicon-react/MoonFillIcon";
import { setDarkMode } from "@/store/reducers/darkModeSlice";
// import { useColorScheme } from "@mui/joy/styles";
import { useColorScheme as useJoyColorScheme } from "@mui/joy/styles";
import { useColorScheme as useMaterialColorScheme } from "@mui/material/styles";

function DarkModeToggle() {
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
    <IconButton onClick={handleToggle} color="inherit" sx={{}}>
      {modes == "dark" ? <MoonFillIcon size={23} /> : <SunFillIcon size={23} />}
    </IconButton>
  );
}

export default DarkModeToggle;
