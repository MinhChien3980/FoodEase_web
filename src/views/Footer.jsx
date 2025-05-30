"use client";
import React from "react";
import {
  Grid,
  Typography,
  Container,
  Box,
  Button,
  List,
  ListItem,
} from "@mui/joy";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/joy";
import {
  RiHome4Line,
  RiInstagramLine,
  RiMailLine,
  RiMetaFill,
  RiMotorbikeLine,
  RiPhoneLine,
  RiStore3Line,
  RiTwitterXFill,
  RiYoutubeFill,
} from "@remixicon/react";
import { Parallax } from "react-parallax";
import { useTranslation } from "react-i18next";
import { routes } from "@/lib/routes";

const Footer = () => {
  const data = useSelector((state) => state.settings.value);
  const Cities = useSelector((state) => state?.homepage?.homeCities);
  const theme = useTheme();
  const { t } = useTranslation();

  const partnerUrl = `${process.env.NEXT_PUBLIC_ADMIN_PANEL_URL}/partner/auth/sign_up`;
  const riderUrl = `${process.env.NEXT_PUBLIC_ADMIN_PANEL_URL}/rider/auth/sign_up`;

  return (
    <Box mt={0} fontWeight={400} sx={{ position: "relative" }}>
      <Parallax
        bgImage="/assets/images/background.jpg"
        bgImageAlt="main background"
        strength={500}
        className="parallax"
      >
        <Container>
          <Grid container spacing={4} justify="center" ml={1} mt={8}>
            <Grid xs={12} md={3}>
              <Box>
                <Box
                  component="img"
                  src={data && data.web_settings[0].logo}
                  alt="logo"
                  height="50px"
                />
                <>
                  <Typography
                    variant="body1"
                    textColor="neutral.50"
                    sx={{
                      "&:hover": {
                        color: theme.palette.primary[500],
                        transition: "all 0.3s ease-in-out",
                      },
                    }}
                  >
                    {data && data.web_settings[0].app_short_description}
                  </Typography>
                </>
                <Button
                  title="BECOME PARTNER"
                  component="a"
                  href={partnerUrl}
                  target="_blank"
                  startDecorator={<RiStore3Line />}
                  sx={{ marginTop: 2 }}
                >
                  {t("Become-A-partner")}
                </Button>
                <Button
                  title="BECOME A DELIVERY RIDER"
                  component="a"
                  href={riderUrl}
                  target="_blank"
                  startDecorator={<RiMotorbikeLine />}
                  sx={{ marginTop: 2 }}
                >
                  {t("Become-A-Delivery-Rider")}
                </Button>
              </Box>
            </Grid>
            <Grid xs={12} md={3}>
              <Box className="footer-services-wrapper">
                <Typography
                  variant="h6"
                  level="body1"
                  gutterBottom
                  textColor="neutral.50"
                  sx={{ fontWeight: "lg" }}
                >
                  {t("Learn-More")}
                </Typography>
                <List sx={{ padding: 0 }}>
                  <ListItem sx={{ padding: 0 }}>
                    <Link href={routes.privacyPolicy}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: theme.palette.common.white,
                          fontWeight: "md",
                          "&:hover": {
                            color: theme.palette.primary[500],
                            transform: "translateX(3%)",
                            transition: "all 0.3s ease-in-out",
                          },
                        }}
                      >
                        {t("privacy-policy")}
                      </Typography>
                    </Link>
                  </ListItem>
                  <ListItem sx={{ padding: 0 }}>
                    <Link href={routes.termsConditions}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: theme.palette.common.white,
                          fontWeight: "md",
                          "&:hover": {
                            color: theme.palette.primary[500],
                            transform: "translateX(3%)",
                            transition: "all 0.3s ease-in-out",
                          },
                        }}
                      >
                        {t("terms-conditions")}
                      </Typography>
                    </Link>
                  </ListItem>
                  <ListItem sx={{ padding: 0 }}>
                    <Link href={routes.contactUs}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: theme.palette.common.white,
                          fontWeight: "md",
                          "&:hover": {
                            color: theme.palette.primary[500],
                            transform: "translateX(3%)",
                            transition: "all 0.3s ease-in-out",
                          },
                        }}
                      >
                        {t("contact-us")}
                      </Typography>
                    </Link>
                  </ListItem>
                </List>
              </Box>
            </Grid>
            <Grid xs={12} md={3}>
              <Box className="footer-product-wrapper">
                <Typography
                  variant="h6"
                  gutterBottom
                  textColor="neutral.50"
                  sx={{ fontWeight: "lg" }}
                >
                  {t("WE-DELIVER-TO")}
                </Typography>
                {Cities?.map((city, index) => (
                  <Typography
                    variant="body1"
                    sx={{
                      cursor: "pointer",
                      color: theme.palette.common.white,
                      fontWeight: "md",
                      "&:hover": {
                        color: theme.palette.primary[500],
                        transform: "translateX(1%)",
                        transition: "all 0.3s ease-in-out",
                      },
                    }}
                    key={index}
                  >
                    {city.name}
                  </Typography>
                ))}
              </Box>
            </Grid>
            <Grid xs={12} md={3}>
              <>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: theme.palette.common.white,
                    fontWeight: "lg",
                  }}
                >
                  {t("contact")}
                </Typography>
                <Box display="flex" alignItems="flex-start">
                  <Box mr={2} mt={0.5}>
                    <RiHome4Line color={theme.palette.common.white} />
                  </Box>
                  <Typography
                    variant="body1"
                    gutterBottom
                    textColor="neutral.50"
                  >
                    {data && data.web_settings[0].address}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                  <Typography
                    startDecorator={
                      <RiMailLine
                        color={theme.palette.common.white}
                        className="mr-8"
                      />
                    }
                    variant="body1"
                    textColor="neutral.50"
                  >
                    {data && data.web_settings[0].support_email}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="start" mt={1}>
                  <Typography
                    startDecorator={
                      <RiPhoneLine
                        color={theme.palette.common.white}
                        className="mr-8"
                        size={25}
                      />
                    }
                    variant="body1"
                    textColor="neutral.50"
                  >
                    {data && data.web_settings[0].support_number}
                  </Typography>
                </Box>
              </>
            </Grid>
          </Grid>
        </Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 2,
            width: "100%",
          }}
        >
          {data?.web_settings[0] && (
            <Box className="socialIconsContainer">
              <Link
                title="FACEBOOK"
                href={data?.web_settings[0]?.facebook_link || "#"}
                target="_self"
                rel="noreferrer"
                className="socialLink"
              >
                <RiMetaFill size={19} />
              </Link>
              <Link
                title="INSTAGRAM"
                href={data?.web_settings[0]?.instagram_link || "#"}
                target="_self"
                rel="noreferrer"
                className="socialLink"
              >
                <RiInstagramLine size={19} />
              </Link>
              <Link
                title="YOUTUBE"
                href={data?.web_settings[0]?.youtube_link || "#"}
                target="_self"
                rel="noreferrer"
                className="socialLink"
              >
                <RiYoutubeFill size={19} />
              </Link>
              <Link
                title="TWITTER"
                href={data?.web_settings[0]?.twitter_link || "#"}
                target="_self"
                rel="noreferrer"
                className="socialLink"
              >
                <RiTwitterXFill size={19} />
              </Link>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 2,
            width: "100%",
          }}
        >
          <Typography variant="body2" textColor="primary.50" fontWeight={500}>
            {data &&
              data.web_settings[0].copyright_details.replace(/\\r\\n/g, "")}
          </Typography>
        </Box>
      </Parallax>
    </Box>
  );
};

export default Footer;
