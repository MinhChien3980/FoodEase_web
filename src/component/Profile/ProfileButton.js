import React, { useState } from "react";
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  Dropdown,
  MenuButton,
} from "@mui/joy";
import { useRouter } from "next/router";
import ArrowDownSLineIcon from "remixicon-react/ArrowDownSLineIcon";
import ArrowUpSLineIcon from "remixicon-react/ArrowUpSLineIcon";
import { useSelector } from "react-redux";
import { logout } from "@/events/actions";
import ConfirmModal from "../Models/ConfirmModal";
import {
  RiFileList3Line,
  RiHeartLine,
  RiLogoutBoxRLine,
  RiMapPinLine,
  RiNotification3Line,
  RiUserLine,
} from "@remixicon/react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

const ProfileButton = () => {
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const router = useRouter();
  const userData = useSelector((state) => state.userSettings.value);
  const theme = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const defaultImage = "https://ui-avatars.com/api/?background=random";

  const handleRouteChange = (route) => {
    router.push(route);
  };

  const handleLogOut = () => {
    setConfirmLogoutOpen(true);
  };

  const confirmLogout = () => {
    logout();
    setConfirmLogoutOpen(false);
  };

  const menuItems = [
    { label: t("my-profile"), icon: <RiUserLine />, route: "/user/profile" },
    {
      label: t("my-orders"),
      icon: <RiFileList3Line />,
      route: "/user/orders",
    },
    {
      label: t("favourites"),
      icon: <RiHeartLine />,
      route: "/user/favorites",
    },
    {
      label: t("Addresses"),
      icon: <RiMapPinLine />,
      route: "/user/addresses",
    },
    {
      label: t("notifications"),
      icon: <RiNotification3Line />,
      route: "/notifications",
    },
  ];

  return (
    <>
      <Box sx={{ display: { xs: "none", lg: "block" } }}>
        <Dropdown open={open} onOpenChange={(_, newOpen) => setOpen(newOpen)}>
          <MenuButton
            sx={{
              border: "none",
              ":hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <Avatar
              variant="soft"
              src={userData?.user_profile || defaultImage}
              alt="User Profile"
              sx={{
                width: 44,
                height: 44,
                overflow: "hidden",
                transition: "transform 0.3s ease",
                "&:hover": {
                  "& img": {
                    transform: "scale(1.1)",
                  },
                },
                "& img": {
                  transition: "transform 0.3s ease",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                },
              }}
            />
            <Typography variant="body1" ml={0.5}>
              {userData?.username}
            </Typography>
            <Box ml={0.5} pt={1}>
              {open ? (
                <ArrowUpSLineIcon color={theme.palette.primary[500]} />
              ) : (
                <ArrowDownSLineIcon color={theme.palette.primary[500]} />
              )}
            </Box>
          </MenuButton>

          <Menu>
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                onClick={() => handleRouteChange(item.route)}
              >
                <Typography startDecorator={item.icon}>{item.label}</Typography>
              </MenuItem>
            ))}
            <MenuItem onClick={handleLogOut}>
              <Typography
                sx={{ color: theme.palette.danger[500], fontWeight: "md" }}
                startDecorator={<RiLogoutBoxRLine />}
              >
                {t("logout")}
              </Typography>
            </MenuItem>
          </Menu>
        </Dropdown>

        <ConfirmModal
          open={confirmLogoutOpen}
          onClose={() => setConfirmLogoutOpen(false)}
          onConfirm={confirmLogout}
          content={t("are-you-sure-you-want-to-logout")}
          confirmBtnText={t("logout")}
        />
      </Box>

      <Box sx={{ display: { xs: "block", lg: "none" } }}>
        {/* <Link href="/user/profile" passHref> */}
        <Link href="#" target="_self">
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            sx={{ width: 45, height: 45 }}
          >
            <Avatar
              src={userData?.user_profile}
              alt={defaultImage}
              sx={{
                height: "100%",
                width: "100%",
                borderRadius: "50%",
              }}
            />
          </Box>
        </Link>
      </Box>
    </>
  );
};

export default ProfileButton;
