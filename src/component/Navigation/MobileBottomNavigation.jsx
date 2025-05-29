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
  const [lastScrollPosition, setLastScrollPosition] = useState(0); // Define lastScrollPosition

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
      if (currentPath === "/home") {
        setIndex(0);
      } else if (currentPath === "/user/favourites") {
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
    if (path === "/home") {
      setIndex(0);
    } else if (path === "/user/favourites") {
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
        zIndex: 999,
        width: "100%",
        transition: "transform 0.3s",
        transform: isVisible ? "translateY(0)" : "translateY(100%)",
      }}
    >
      <Tabs
        size="lg"
        aria-label="Bottom Navigation"
        value={index}
        onChange={handleTabChange}
        sx={(theme) => ({
          p: 1,
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.body
              : theme.palette.primary[300],
          borderRadius: "16px 8px 0px 0px",
          mx: "auto",
        })}
      >
        <TabList
          variant="plain"
          size="sm"
          disableUnderline
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: 0,
            borderRadius: "lg",
            py: 0.5,
          }}
        >
          {[
            {
              icon: <RiHome4Fill />,
              onClick: handleNavigate("/home"),
            },
            {
              icon: <RiHeartLine />,
              onClick: authentication
                ? handleNavigate("/user/favorites/")
                : () => toast.error("Please Login First!"),
            },
            {
              icon: <RiSearchLine />,
              onClick: handleSearchButtonClick,
            },
            {
              icon: <RiUserFill />,
              onClick: authentication
                ? handleNavigate("/user/profile/")
                : () => toast.error("Please Login First!"),
            },
          ].map((item, idx) => (
            <Tab
              key={idx}
              disableIndicator
              orientation="vertical"
              {...(index === idx && {
                sx: {
                  backgroundColor: `${theme.palette.primary[50]}!important`,
                  color:
                    theme.palette.mode === "dark" && index === idx
                      ? theme.palette.common.black
                      : theme.palette.mode === "dark"
                      ? theme.palette.common.white
                      : theme.palette.common.black,
                  boxShadow:
                    index === idx
                      ? `0 0 8px ${theme.palette.common.white}`
                      : "none",
                },
              })}
            >
              <TabButton {...item} theme={theme} />
            </Tab>
          ))}
        </TabList>
      </Tabs>

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
                href={"/user/my-orders"}
                startDecorator={<RiFilePaper2Line />}
                onClick={handleProfileOpen}
              >
                {t("my-orders")}
              </Typography>

              <Typography
                fontSize={"md"}
                fontWeight={"lg"}
                component={Link}
                href={"/user/transactions"}
                startDecorator={<ExchangeDollarLineIcon />}
                onClick={handleProfileOpen}
              >
                {t("Transactions")}
              </Typography>

              <Typography
                fontSize={"md"}
                fontWeight={"lg"}
                component={Link}
                href={"/user/address"}
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
                href={"/user/address"}
                startDecorator={
                  <RiShutDownLine color={theme.palette.text.primary} />
                }
                onClick={() => {
                  handleProfileOpen();
                  router.replace("/");
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
