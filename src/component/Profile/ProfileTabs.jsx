import React from "react";
import styled from "styled-components";
import {
  Stack,
  Card,
  List,
  ListItem,
  Box,
  ListItemDecorator,
  useTheme,
  ListItemContent,
  Typography,
  ListDivider,
} from "@mui/joy";
import Link from "next/link";
import {
  RiArrowRightSLine,
  RiFileList3Fill,
  RiWalletFill,
  RiMapPinFill,
  RiBankFill,
  RiNotification3Fill,
} from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { routes } from "@/lib/routes";

// Define styled icons with a fixed color
const StyledIcon = styled(({ icon: Icon, ...props }) => <Icon {...props} />)`
  color: #000000;
`;

const MenuItem = ({ icon: Icon, label, link }) => {
  const theme = useTheme();

  return (
    <ListItem component={Link} href={link}>
      <Box
        width={"100%"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box display={"flex"} alignItems={"center"} gap={3}>
          <ListItemDecorator>
            <Box
              borderRadius={"50%"}
              display={"flex"}
              p={1}
              alignItems={"center"}
              justifyContent={"center"}
              bgcolor={theme.palette.primary[100]}
            >
              <StyledIcon icon={Icon} />
            </Box>
          </ListItemDecorator>
          <ListItemContent>
            <Typography
              textColor={
                theme.palette.mode === "light"
                  ? theme.palette.text.menuText
                  : theme.palette.text.secondary
              }
              fontWeight={"md"}
            >
              {label}
            </Typography>
          </ListItemContent>
        </Box>

        <Box display={"flex"} alignItems={"center"} gap={2}>
          <RiArrowRightSLine />
        </Box>
      </Box>
    </ListItem>
  );
};

const ProfileTabs = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const menuItems = [
    {
      icon: RiFileList3Fill,
      label: t("my-orders"),
      link: routes.user.orders,
    },
    {
      icon: RiWalletFill,
      label: t("Wallet"),
      link: routes.user.wallet,
    },
    {
      icon: RiMapPinFill,
      label: t("Addresses"),
      link: routes.user.addresses,
    },
    {
      icon: RiNotification3Fill,
      label: t("notifications"),
      link: routes.notifications,
    },
    {
      icon: RiBankFill,
      label: t("Transactions"),
      link: routes.user.transactions,
    },
  ];

  return (
    <Card sx={{ width: "100%", border: "none", boxShadow: "lg" }}>
      <List sx={{ gap: 0.5 }}>
        {menuItems.map(({ icon: Icon, label, link }, index) => (
          <React.Fragment key={label}>
            <MenuItem icon={Icon} label={label} link={link} />
            {index !== menuItems.length - 1 && (
              <ListDivider
                inset={"gutter"}
                sx={{ backgroundColor: "Background.level3" }}
              />
            )}
          </React.Fragment>
        ))}
      </List>
    </Card>
  );
};

export default ProfileTabs;
