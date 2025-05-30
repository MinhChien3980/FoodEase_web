import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Badge,
  Box,
  Dropdown,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  Typography,
} from "@mui/joy";
import { useColorScheme, useTheme } from "@mui/joy/styles";
import dynamic from "next/dynamic";
import ShoppingCartLineIcon from "remixicon-react/ShoppingCartLineIcon";
import TextDirectionLIcon from "remixicon-react/TextDirectionLIcon";
import TextDirectionRIcon from "remixicon-react/TextDirectionRIcon";
import TranslateIcon from "remixicon-react/TranslateIcon";
import { languages } from "@/i18n";
import { setLanguage } from "@/store/reducers/languageSlice";
import { useTranslation } from "react-i18next";
import { toggleRTL } from "@/store/reducers/rtlSlice";
import SearchModal from "@/component/Models/SearchModal";
import DarkModeToggle from "@/component/ToggleComponents/DarkModeToggle";
import { FlagIcon } from "react-flag-kit";
import FirebaseData from "@/@core/firebase";
import { RiNotification3Line } from "@remixicon/react";
import { routes, navigationMenus, isActiveRoute } from "@/lib/routes";
import { useRouter } from "next/router";

// Dynamically import components with SSR disabled
const Link = dynamic(() => import("next/link"), {
  ssr: false,
});
const LoginModel = dynamic(() => import("@/component/Models/LoginModel"), {
  ssr: false,
});
const LocationModal = dynamic(
  () => import("@/component/Models/LocationModal"),
  {
    ssr: false,
  }
);

const OfflineCart = dynamic(() => import("../Cart/OfflineCart"), {
  ssr: false,
});

const Navbar = () => {
  const settings = useSelector((state) => state.settings.value);
  const { mode } = useColorScheme();
  const theme = useTheme();
  const isDarkMode = useSelector((state) => state.darkMode.value);
  const [logoSource, setLogoSource] = useState();
  const isLogin = useSelector((state) => state.authentication.isLogged);
  const cartItemsCount = useSelector((state) => state.cart?.data)?.length;

  const { t, i18n } = useTranslation();

  const router = useRouter();

  useEffect(() => {
    const handleLogoSource = () => {
      if (mode === "light") {
        setLogoSource(settings?.web_settings[0]?.light_logo);
      } else {
        setLogoSource(settings?.web_settings[0]?.logo);
      }
    };

    handleLogoSource();
  }, [mode, settings]);
  const dispatch = useDispatch();

  const layoutDirection = useSelector((state) => state.rtl.layoutDirection);
  const toggleLayoutDirection = () => {
    const newDirection = layoutDirection === "ltr" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", newDirection); // Update HTML dir attribute
    dispatch(toggleRTL(newDirection)); // Dispatch action with new direction
  };
  const languageFlags = {
    en: <FlagIcon code="GB" size={24} />,
    hi: <FlagIcon code="IN" size={24} />,
    ar: <FlagIcon code="SA" size={24} />,
  };

  if (FirebaseData() === false) {
    return;
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      mt={1}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={3}
      >
        <Box height={"50px"} width={"200px"}>
          <Link href={routes.home} target="_self">
            {logoSource && (
              <Box
                component="img"
                src={logoSource}
                alt="logo"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}
          </Link>
        </Box>

        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={1}
        >
          <LocationModal />
        </Box>

        {/* Navigation menu items */}
        {navigationMenus.main.map((item) => (
          <Link key={item.label} href={item.href} target="_self">
            <Typography 
              sx={{ 
                fontWeight: "lg", 
                fontSize: "lg",
                color: isActiveRoute(router.pathname, item.href) ? 
                  theme.palette.primary[500] : 
                  theme.palette.text.primary,
                '&:hover': {
                  color: theme.palette.primary[500]
                }
              }}
            >
              {t(item.label)}
            </Typography>
          </Link>
        ))}
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
      >
        <Box>
          <SearchModal displayType={"icon"} />
        </Box>
        <Box mt={1} ml={-1}>
          <Link href={routes.notifications}>
            <RiNotification3Line color={theme.palette.text.primary} />
          </Link>
        </Box>
        {isLogin ? (
          <Link href={routes.cart}>
            <Badge badgeContent={cartItemsCount} variant="solid" size="sm">
              <ShoppingCartLineIcon color={theme.palette.text.primary} />
            </Badge>
          </Link>
        ) : (
          <OfflineCart />
        )}

        <Box>
          <DarkModeToggle />
        </Box>

        <IconButton onClick={toggleLayoutDirection} color="inherit" sx={{}}>
          {layoutDirection == "rtl" ? (
            <TextDirectionRIcon size={"24px"} />
          ) : (
            <TextDirectionLIcon size={"24px"} />
          )}
        </IconButton>

        <Dropdown>
          <MenuButton
            slots={{ root: IconButton }}
            slotProps={{ root: { variant: "plain", color: "neutral" } }}
          >
            <TranslateIcon />
          </MenuButton>
          <Menu>
            {Object.keys(languages).map((language) => {
              return (
                <MenuItem
                  key={language}
                  onClick={async () => {
                    await i18n.changeLanguage(language);
                    dispatch(setLanguage(language));
                    document.documentElement.setAttribute("dir", i18n.dir());
                    dispatch(toggleRTL(i18n.dir()));
                  }}
                >
                  {languageFlags[language]} {languages[language]}
                </MenuItem>
              );
            })}
          </Menu>
        </Dropdown>

        <Box>
          <LoginModel />
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
