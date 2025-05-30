import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  TabList,
  tabClasses,
  Drawer,
  Typography,
  Button,
  useTheme,
  Stack,
} from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import {
  openSearchDrawer,
  closeSearchDrawer,
} from "../../store/reducers/searchDrawerSlice";
import { useRouter } from "next/router";
import { getUserData } from "@/events/getters";
import toast from "react-hot-toast";
import {
  RiMapPin2Line,
  RiShutDownLine,
  RiFilePaper2Line,
  RiHome4Fill,
  RiHeartLine,
  RiSearchLine,
  RiUserFill,
} from "@remixicon/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import ExchangeDollarLineIcon from "remixicon-react/FileListLineIcon";
import { logout } from "@/events/actions";
import { routes } from "@/lib/routes";

const TabButton = ({ icon, label, onClick, theme }) => (
  <Box
    component="div"
    sx={{
      backgroundColor: "transparent",
      width: "100%",
      height: "100%",
      textTransform: "none",
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
      paddingInline: "0px",
      flexDirection: "column",
      margin: "0px auto",
      cursor: "pointer",
      "&:hover": { backgroundColor: "transparent" },
      "&:focus": { outline: "none" },
    }}
    onClick={onClick}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        borderRadius: "50%", // Ensures the effect is circular
        padding: "10px", // Adjust padding as needed
      }}
    >
      
      {icon}
    </Box>
    <Typography
      sx={{
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {label}
    </Typography>
  </Box>
);

const MobileBottomNavigation = () => {
  const [index, setIndex] = useState(0);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const router = useRouter();
  const authentication = useSelector((state) => state.authentication.isLogged);
  const dispatch = useDispatch();
  const isSearchOpen = useSelector((state) => state.searchDrawer.isSearchOpen);
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  const handleNavigate = (path) => () => {
    setProfileOpen(false);
    dispatch(closeSearchDrawer());
    router.push(path);
  };

  const handleSearchButtonClick = () => {
    dispatch(isSearchOpen ? closeSearchDrawer() : openSearchDrawer());
    setProfileOpen(false);
    if (isSearchOpen) {
      setIndex(2);
    } else {
      const currentPath = router.pathname;
      if (currentPath === routes.home) {
        setIndex(0);
      } else if (currentPath === routes.user.favorites) {
        setIndex(1);
      }
    }
  };

  const handleProfileOpen = () => {
    if (!authentication) {
      toast.error("Please Login First!");
      dispatch(closeSearchDrawer());
      return;
    }
    setProfileOpen((prev) => !prev);
    dispatch(closeSearchDrawer());
  };

  useEffect(() => {
    const path = router.pathname;
    if (path === routes.home) {
      setIndex(0);
    } else if (path === routes.user.favorites) {
      if (!authentication) {
        toast.error("Please Login First!");
        setIndex(0);
      } else {
        setIndex(1);
      }
    }
  }, [router.pathname, authentication]);

  const handleTabChange = (event, newValue) => {
    if (!authentication && newValue !== 0 && newValue !== 2) {
      toast.error("Please Login First!");
      return;
    }
    setIndex(newValue);
  };

  const theme = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPosition = window.pageYOffset;
      setIsVisible(currentScrollPosition < lastScrollPosition);
      setLastScrollPosition(currentScrollPosition);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollPosition]);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.modal,
        display: { xs: "block", md: "block", lg: "none" },
        transform: isVisible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.3s ease-in-out",
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.background.surface,
          borderTop: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadow.lg,
        }}
      >
        <Tabs
          size="sm"
          value={index}
          onChange={handleTabChange}
          sx={{
            [`& .${tabClasses.root}`]: {
              flex: 1,
              fontSize: "xs",
              fontWeight: "md",
              color: theme.palette.text.secondary,
              [`&.${tabClasses.selected}`]: {
                color: theme.palette.primary.solidBg,
              },
            },
          }}
        >
          <TabList
            variant="plain"
            sx={{
              width: "100%",
              justifyContent: "space-around",
              backgroundColor: "transparent",
              padding: "8px 0",
            }}
          >
            <Tab onClick={handleNavigate(routes.home)}>
              <TabButton
                icon={<RiHome4Fill />}
                label={t("home")}
                theme={theme}
              />
            </Tab>
            <Tab onClick={handleNavigate(routes.user.favorites)}>
              <TabButton
                icon={<RiHeartLine />}
                label={t("favourites")}
                theme={theme}
              />
            </Tab>
            <Tab onClick={handleSearchButtonClick}>
              <TabButton
                icon={<RiSearchLine />}
                label={t("search")}
                theme={theme}
              />
            </Tab>
            <Tab onClick={handleProfileOpen}>
              <TabButton
                icon={<RiUserFill />}
                label={t("profile")}
                theme={theme}
              />
            </Tab>
          </TabList>
        </Tabs>
      </Box>

      {isProfileOpen && (
        <Drawer
          size="sm"
          anchor="bottom"
          open={isProfileOpen}
          onClose={handleProfileOpen}
        >
          <Box
            width={"100%"}
            justifyContent={"center"}
            display={"flex"}
            alignItems={"left"}
            textAlign={"start"}
            my={4}
            px={4}
          >
            <Stack spacing={4} width={"100%"}>
              <Typography
                fontSize={"md"}
                fontWeight={"lg"}
                component={Link}
                href={routes.user.orders}
                startDecorator={<RiFilePaper2Line />}
                onClick={handleProfileOpen}
              >
                {t("my-orders")}
              </Typography>

              <Typography
                fontSize={"md"}
                fontWeight={"lg"}
                component={Link}
                href={routes.user.transactions}
                startDecorator={<ExchangeDollarLineIcon />}
                onClick={handleProfileOpen}
              >
                {t("Transactions")}
              </Typography>

              <Typography
                fontSize={"md"}
                fontWeight={"lg"}
                component={Link}
                href={routes.user.addresses}
                startDecorator={
                  <RiMapPin2Line color={theme.palette.text.primary} />
                }
                onClick={handleProfileOpen}
              >
                {t("Addresses")}
              </Typography>

              <Typography
                fontSize={"md"}
                fontWeight={"lg"}
                component={Link}
                href={routes.index}
                startDecorator={
                  <RiShutDownLine color={theme.palette.text.primary} />
                }
                onClick={() => {
                  handleProfileOpen();
                  router.replace(routes.index);
                  logout();
                }}
              >
                {t("logout")}
              </Typography>
            </Stack>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default MobileBottomNavigation;
