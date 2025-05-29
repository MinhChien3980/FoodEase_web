import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Box, useTheme } from "@mui/joy";
import Typography from "@mui/material/Typography";
import { RiHome4Line } from "@remixicon/react";
import { useTranslation } from "react-i18next";

const StyledBreadcrumb = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.text.primary,
  fontWeight: theme.typography.fontWeightMedium,
  display: "flex",
  alignItems: "center",
}));

const LargeSeparator = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  color: theme.palette.text.primary,
}));

const BreadCrumb = ({ lastChild = "" }) => {
  const router = useRouter();
  const [isLastChildReady, setIsLastChildReady] = useState(false);
  const breadcrumbPaths = router.asPath
    .split("/")
    .filter((path) => path !== "");

  useEffect(() => {
    const logRouteLocation = (path) => {
      // console.log("Navigated to:", path);
    };

    logRouteLocation(router.asPath);
    const handleRouteChange = (url) => {
      logRouteLocation(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);

    if (lastChild && lastChild !== "[slug]") {
      setIsLastChildReady(true);
    }

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router, lastChild]);

  const handleBreadcrumbClick = (path) => {
    const fullPath = `/${breadcrumbPaths.slice(0, path + 1).join("/")}`;
    router.push(fullPath);
  };

  function formatLastChild(lastChild) {
    // Remove the trailing number and [slug]
    lastChild = lastChild.replace(/-\d+$/, "").replace("[slug]", "");

    // Replace '-' with ' ' (space)
    lastChild = lastChild.replace(/-/g, " ");

    // Capitalize the first letter of each word
    lastChild = lastChild.replace(/\b\w/g, function (match) {
      return match.toUpperCase();
    });

    return lastChild;
  }

  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box
      role="presentation"
      sx={{
        width: "100%",
        padding: 1,
        backgroundColor: theme.palette.background.bredCrump,
        borderRadius: "sm",
      }}
    >
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<LargeSeparator>/</LargeSeparator>}
      >
        <StyledBreadcrumb
          component="a"
          href="/home"
          onClick={(e) => {
            e.preventDefault();
            router.push("/home");
          }}
        >
          <RiHome4Line
            size={24}
            color={theme.palette.text.primary}
            style={{ marginRight: "4px" }}
          />
          {t("home")}
        </StyledBreadcrumb>

        {breadcrumbPaths.map((path, index) => {
          if (path === "user") return null;

          const isLast = index === breadcrumbPaths.length - 1;
          const displayText = formatLastChild(path);

          {
            /* if (isLast) {
            return isLastChildReady && lastChild !== "[slug]" ? (
              <StyledBreadcrumb key={index}>
                {t(lastChild || displayText)}
              </StyledBreadcrumb>
            ) : null;
          } */
          }

          return (
            <StyledBreadcrumb
              key={index}
              onClick={(e) => {
                e.preventDefault();
                handleBreadcrumbClick(index);
              }}
              className={isLast ? "no-cursor" : "cursor "}
            >
              {t(displayText)}
            </StyledBreadcrumb>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default BreadCrumb;
