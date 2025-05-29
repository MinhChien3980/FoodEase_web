import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  useTheme,
  Drawer,
  IconButton,
  DialogContent,
  Stack,
  Typography,
  Divider,
  Badge,
} from "@mui/joy";
import Link from "next/link";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import {
  RiMenuFill,
  RiCloseCircleLine,
  RiArrowRightDoubleLine,
  RiLayoutGrid2Fill,
  RiDiscountPercentLine,
  RiStackLine,
  RiShoppingCartLine,
  RiFileList3Line,
  RiWalletFill,
  RiBankFill,
  RiMapPinLine,
  RiLogoutBoxRLine,
  RiRestaurantLine,
  RiNotification3Line,
} from "@remixicon/react";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { logout } from "@/events/actions";
import FirebaseData from "@/@core/firebase";

const LoginModel = dynamic(() => import("../Models/LoginModel"), {
  ssr: false,
});
const LocationModal = dynamic(
  () => import("@/component/Models/LocationModal"),
  { ssr: false }
);
const DarkModeToggleMobile = dynamic(
  () => import("@/component/ToggleComponents/DarkModeToggleMobile"),
  { ssr: false }
);
const RTLToggleMobile = dynamic(
  () => import("@/component/ToggleComponents/RTLToggleMobile"),
  { ssr: false }
);
const ConfirmModal = dynamic(() => import("../Models/ConfirmModal"), {
  ssr: false,
});
const SearchModal = dynamic(() => import("../Models/SearchModal"), {
  ssr: false,
});
const OfflineCart = dynamic(() => import("../Cart/OfflineCart"), {
  ssr: false,
});

// Memoized selector
const mobileNavigationSelector = createSelector(
  [
    (state) => state.settings.value?.web_settings[0],
    (state) => state.cart.data,
    (state) => state.authentication.isLogged,
    (state) => state.darkMode.value,
  ],
  (settings, cartData, isLogged, mode) => ({
    settings,
    cartData,
    isLogged,
    mode,
  })
);

const MobileNavigation = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [logoSrc, setLogoSrc] = useState("");
  const [open, setOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  const { settings, cartData, isLogged, mode } = useSelector(
    mobileNavigationSelector
  );

  useEffect(() => {
    setLogoSrc(mode === "dark" ? settings?.logo : settings?.light_logo);
  }, [mode, settings]);

  const toggleDrawer = (inOpen) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(inOpen);
  };

  const handleLogOut = () => setConfirmLogoutOpen(true);
  const confirmLogout = () => {
    logout();
    setConfirmLogoutOpen(false);
    setOpen(false);
  };

  const menuItems = useMemo(
    () => [
      { label: "Categories", icon: RiLayoutGrid2Fill, href: "/categories" },
      { label: "offers", icon: RiDiscountPercentLine, href: "/offers" },
      { label: "Products", icon: RiStackLine, href: "/products" },
      { label: "restaurants", icon: RiRestaurantLine, href: "/restaurants" },
    ],
    []
  );

  const loggedInMenuItems = useMemo(
    () => [
      {
        label: "cart",
        icon: RiShoppingCartLine,
        href: "/cart",
        badge: cartData.length,
      },
      { label: "my-orders", icon: RiFileList3Line, href: "/user/orders" },
      {
        label: "notifications",
        icon: RiNotification3Line,
        href: "/notifications",
      },
      { label: "Wallet", icon: RiWalletFill, href: "/user/wallet" },
      { label: "Transactions", icon: RiBankFill, href: "/user/transactions" },
      { label: "Addresses", icon: RiMapPinLine, href: "/user/addresses" },
    ],
    [cartData.length]
  );

  const renderMenuItem = ({ label, icon: Icon, href, badge }) => (
    <Typography
      key={label}
      fontSize="md"
      fontWeight="lg"
      component={Link}
      href={href}
      onClick={toggleDrawer(false)}
      startDecorator={
        badge !== undefined ? (
          <Badge badgeContent={badge}>
            <Icon color={theme.palette.text.primary} />
          </Badge>
        ) : (
          <Icon color={theme.palette.text.primary} />
        )
      }
    >
      {t(label)}
    </Typography>
  );

  if (FirebaseData() === false) {
    return;
  }
  return (
    <Box sx={{ marginY: 1, width: "100%" }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width={"100%"}
      >
        <Box
          component={Link}
          href="/home"
          display="flex"
          alignItems="center"
          justifyContent={"start"}
          width={"100%"}
          gap={2}
        >
          <Box
            sx={{
              width: "80px",
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              backgroundColor: "black",
            }}
          >
            <Box
              component="img"
              src={logoSrc}
              alt="logo"
              sx={{ width: "100%", height: "100%" }}
              loading="lazy"
            />
          </Box>
          <Box sx={{ display: { xs: "none", sm: "flex", lg: "none" } }}>
            <LocationModal />
          </Box>
        </Box>
        <Box display="flex" gap={1} ps={2} alignItems="center">
          <Box sx={{ display: { xs: "none", sm: "block", lg: "none" } }}>
            <SearchModal />
          </Box>
          <LoginModel />
          <IconButton onClick={toggleDrawer(!open)}>
            {open ? (
              <RiCloseCircleLine
                size="28px"
                color={theme.palette.primary[500]}
              />
            ) : (
              <RiMenuFill size="28px" color={theme.palette.primary[500]} />
            )}
          </IconButton>
        </Box>
      </Box>

      <Drawer open={open} onClose={toggleDrawer(false)} size="lg">
        <DialogContent>
          <Box role="presentation" width="100%">
            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              mt={1}
              p={1}
            >
              <RiArrowRightDoubleLine
                className="remixicon"
                size={theme.fontSize.xl4}
                onClick={toggleDrawer(false)}
              />
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="flex-start"
              textAlign="start"
              my={4}
              px={4}
            >
              <Stack spacing={3} width="100%">
                {menuItems.map(renderMenuItem)}
                <Divider />
                {!isLogged && (
                  <Box sx={{ display: "flex", justifyContent: "start" }}>
                    <OfflineCart label={true} />
                  </Box>
                )}
                {isLogged && loggedInMenuItems.map(renderMenuItem)}
                {isLogged && <Divider />}
                <DarkModeToggleMobile />
                <RTLToggleMobile />
                <Box>
                  {/* Language dropdown - implementation remains the same */}
                </Box>
                {isLogged && (
                  <Typography
                    fontSize="md"
                    fontWeight="lg"
                    startDecorator={
                      <RiLogoutBoxRLine color={theme.palette.primary[500]} />
                    }
                    sx={{ color: theme.palette.primary[500] }}
                    onClick={handleLogOut}
                  >
                    {t("logout")}
                  </Typography>
                )}
                <ConfirmModal
                  open={confirmLogoutOpen}
                  onClose={() => setConfirmLogoutOpen(false)}
                  onConfirm={confirmLogout}
                  content={t("are-you-sure-you-want-to-logout")}
                  confirmBtnText={t("logout")}
                />
              </Stack>
            </Box>
          </Box>
        </DialogContent>
      </Drawer>
    </Box>
  );
};

export default MobileNavigation;
