import React from "react";
import { Box, Card, Typography, useTheme, Grid } from "@mui/joy";
import {
  RiFileList3Fill,
  RiMapPinFill,
  RiShoppingCart2Fill,
  RiWalletFill,
} from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Link from "next/link";
import { routes } from "@/lib/routes";

const ProfileNavigation = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const navItems = [
    { icon: RiShoppingCart2Fill, label: "cart", href: routes.cart },
    { icon: RiFileList3Fill, label: "my-orders", href: routes.user.orders },
    { icon: RiMapPinFill, label: "Addresses", href: routes.user.addresses },
    { icon: RiWalletFill, label: "Wallet", href: routes.user.wallet },
  ];

  const iconWrapper = {
    backgroundColor: theme.palette.primary[100],
    color: theme.palette.common.black,
    borderRadius: "50%",
    width: 40,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing(1),
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.1)",
    },
  };

  return (
    <Grid container spacing={2} sx={{ width: "100%", padding: 1 }}>
      {navItems.map(({ icon: Icon, label, href }) => (
        <Grid xs={6} sm={3} p={1} key={label}>
          <Link href={href || "#"} passHref style={{ textDecoration: "none" }}>
            <Card
              className="boxShadow"
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 1,
                width: "100%",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <Box sx={iconWrapper}>
                  <Icon />
                </Box>
                <Typography sx={{ fontSize: "md" }}>{t(label)}</Typography>
              </Box>
            </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProfileNavigation;
