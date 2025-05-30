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
import { routes } from "@/lib/routes";

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
    { label: t("my-profile"), icon: <RiUserLine />, route: routes.user.profile },
    {
      label: t("my-orders"),
      icon: <RiFileList3Line />,
      route: routes.user.orders,
    },
    {
      label: t("favourites"),
      icon: <RiHeartLine />,
      route: routes.user.favorites,
    },
    {
      label: t("Addresses"),
      icon: <RiMapPinLine />,
      route: routes.user.addresses,
    },
    {
      label: t("notifications"),
      icon: <RiNotification3Line />,
      route: routes.notifications,
    },
  ];

  return (
    <>
      <Box sx={{ display: { xs: "none", lg: "block" } }}>
        <Dropdown>
          <MenuButton
            variant="plain"
            size="sm"
            sx={{
              maxWidth: "32rem",
              minHeight: "2rem",
              backgroundColor: "transparent",
              border: "none",
            }}
            endDecorator={
              !open ? <ArrowDownSLineIcon /> : <ArrowUpSLineIcon />
            }
            onClick={() => setOpen(!open)}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                src={userData?.user_profile}
                alt={defaultImage}
                sx={{
                  height: 45,
                  width: 45,
                  borderRadius: "50%",
                }}
              />
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
        <Link href={routes.user.profile} target="_self">
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
