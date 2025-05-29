import { Box, IconButton, Typography, useTheme } from "@mui/joy";
import Image from "next/image";
import React from "react";
import Highlighter from "react-highlight-words";
import { useSelector } from "react-redux";

const DownloadApp = () => {
  const data = useSelector((state) => state.settings.value);
  const appStoreUrl = data?.web_settings[0]?.app_download_section_appstore_url;
  const playStoreUrl =
    data?.web_settings[0]?.app_download_section_playstore_url;

  const theme = useTheme();

  if (!appStoreUrl && !playStoreUrl) {
    return null;
  }

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      alignItems="center"
      justifyContent={{ xs: "center", md: "space-between" }}
      mb={4}
      bgcolor="transparent"
      maxWidth={{ xs: "100%", lg: "100%" }}
      mx="auto"
    >
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        alignItems={{ xs: "center", md: "start" }}
        justifyContent="center"
        textAlign="start"
        p={0}
        order={{ xs: 2, md: 1 }}
        // maxWidth="800px"
        maxWidth={{ xs: "100%", lg: "800px" }}
      >
        <Typography
          sx={{
            color: theme.palette.text.primary,
            fontWeight: "xl",
            fontSize: {
              xs: "var(--joy-fontSize-xl2, 1.5rem)",
              sm: "var(--joy-fontSize-xl3, 1.875rem)",
              md: "var(--joy-fontSize-lg, 1.125rem)",
              lg: "var(--joy-fontSize-xl4, 2.25rem)",
            },
          }}
        >
          <Highlighter
            highlightClassName="highlight"
            highlightStyle={{
              backgroundColor: "transparent",
              color: theme.palette.primary[600],
            }}
            searchWords={[data && data.web_settings[0].site_title]}
            autoEscape={true}
            textToHighlight={
              data && data.web_settings[0].app_download_section_tagline
            }
          />
        </Typography>
        <Typography
          variant="subtitle1"
          component="span"
          sx={{
            color: theme.palette.text.primary,
            mt: 2,
            fontSize: { xs: "xs", md: "sm", lg: "md" },
          }}
        >
          {data && data.web_settings[0].app_download_section_short_description}
        </Typography>
        <Box
          mt={3}
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems="center"
        >
          {appStoreUrl && (
            <IconButton
              aria-label="Download on the App Store"
              onClick={() => window.open(appStoreUrl)}
              sx={{
                "&:hover": {
                  backgroundColor: "transparent",
                },
                p: 0,
                mb: { xs: 2, sm: 0 },
                mr: { sm: 2 },
              }}
            >
              <Image
                src={"/assets/images/apple.png"}
                alt="applestore"
                width={180}
                height={57}
              />
            </IconButton>
          )}
          {playStoreUrl && (
            <IconButton
              aria-label="Get it on Google Play"
              onClick={() => window.open(playStoreUrl)}
              sx={{
                "&:hover": {
                  backgroundColor: "transparent",
                },
                p: 0,
              }}
            >
              <Image
                src={"/assets/images/playstore.png"}
                alt="erestro"
                width={180}
                height={57}
              />
            </IconButton>
          )}
        </Box>
      </Box>
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="end"
        order={{ xs: 1, md: 2 }}
        mb={{ xs: 4, md: 0 }}
      >
        <Box
          component={"img"}
          src={"/assets/images/Mockup.gif"}
          alt={"eRestro Food Delivery"}
          sx={{
            width: "100%",
            height: "100%",
            maxWidth: "300px",
          }}
        />
      </Box>
    </Box>
  );
};

export default DownloadApp;
