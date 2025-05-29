"use client";
import React, { useState, useRef } from "react";
import { Sheet, Typography, Box } from "@mui/joy";
import { RiArrowLeftWideFill, RiArrowRightWideFill } from "@remixicon/react";
import { useTheme } from "@mui/joy";
import { useTranslation } from "react-i18next";

const SideDrawer = ({}) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const scrollContainerRef = useRef(null);
  const scrollContainerRef2 = useRef(null);
  const scrollIntervalRef = useRef(null);
  const scrollIntervalRef2 = useRef(null);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const switchSite = () => {
    const newWindow = window.open(
      process.env.NEXT_PUBLIC_OTHER_THEME_WEB_URL,
      "_blank"
    );
    if (newWindow) {
      newWindow.focus();
    }
  };

  const startScrolling = (containerRef, intervalRef) => {
    const scrollContainer = containerRef.current;
    let scrollStep = 1;

    intervalRef.current = setInterval(() => {
      if (
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight
      ) {
        scrollStep = -2;
      } else if (scrollContainer.scrollTop === 0) {
        scrollStep = 2;
      }
      scrollContainer.scrollTop += scrollStep;
    }, 40); // Adjust the interval speed as needed
  };

  const stopScrolling = (intervalRef, containerRef) => {
    clearInterval(intervalRef.current);
    smoothScrollToTop(containerRef.current);
  };

  const smoothScrollToTop = (scrollContainer) => {
    const scrollStep = -2;
    const interval = setInterval(() => {
      if (scrollContainer.scrollTop > 0) {
        scrollContainer.scrollTop += scrollStep;
      } else {
        clearInterval(interval);
      }
    }, 20);
  };

  const { t } = useTranslation();

  const DrawerToShow = process.env.NEXT_PUBLIC_OTHER_THEME_WEB_URL != "";

  return (
    <Box display={DrawerToShow ? "block" : "none"}>
      <Box
        component="button"
        title={isOpen ? "Close" : "Switch UI"}
        onClick={toggleDrawer}
        className={"flexProperties"}
        sx={{
          position: "fixed",
          top: "50%",
          width: "20px !important",
          height: "50px", // Increased height
          right: isOpen ? "300px" : "0",
          transform: "translateY(-50%)",
          zIndex: 1301,
          backgroundColor: theme.palette.primary[400],
          borderRadius: "8px 0 0 8px",
          transition: "right 0.3s ease-in-out",
          border: "none",
          "&:hover": {
            backgroundColor: theme.palette.primary[500],
          },
        }}
      >
        {isOpen ? (
          <RiArrowRightWideFill color={theme.palette.common.white} />
        ) : (
          <RiArrowLeftWideFill color={theme.palette.common.white} />
        )}
      </Box>

      <Sheet
        variant="outlined"
        sx={{
          position: "fixed",
          top: "50%",
          right: isOpen ? "0" : "-300px",
          width: "300px",
          height: "400px",
          backgroundColor: theme.palette.background.surface,
          transition: "right 0.3s ease-in-out",
          transform: "translateY(-50%)",
          boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px 0 0 10px",
          zIndex: 1300,
          display: "flex",
          flexDirection: "column",
          padding: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography level="body1" fontWeight="bold">
              {t("modern-theme")}
            </Typography>
            <Box
              ref={scrollContainerRef2}
              onMouseEnter={() =>
                startScrolling(scrollContainerRef2, scrollIntervalRef2)
              }
              onMouseLeave={() =>
                stopScrolling(scrollIntervalRef2, scrollContainerRef2)
              }
              sx={{
                width: "100%",
                height: "120px",
                overflowY: "scroll",
                borderRadius: "8px",
                marginTop: "10px",
                boxShadow: "lg",
                border: 2,
                borderColor: theme.palette.primary[500],
                "&::-webkit-scrollbar": {
                  width: "0px",
                },
              }}
            >
              <Box
                component="img"
                loading="lazy"
                onClick={() => setIsOpen(false)}
                src="/assets/images/Modern-eRestro.png"
                alt="Long Screenshot"
                sx={{
                  cursor: "pointer",
                  width: "100%",
                  display: "block",
                }}
              />
            </Box>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography level="body1" fontWeight="bold">
              {t("classic-theme")}
            </Typography>
            <Box
              ref={scrollContainerRef}
              onMouseEnter={() =>
                startScrolling(scrollContainerRef, scrollIntervalRef)
              }
              onMouseLeave={() =>
                stopScrolling(scrollIntervalRef, scrollContainerRef)
              }
              sx={{
                width: "100%",
                height: "120px",
                overflowY: "scroll",
                borderRadius: "8px",
                marginTop: "10px",
                boxShadow: "lg",
                "&::-webkit-scrollbar": {
                  width: "0px",
                },
              }}
            >
              <Box
                component="img"
                loading="lazy"
                src="/assets/images/Classic-erestro.png"
                alt="Long Screenshot"
                onClick={switchSite}
                sx={{
                  cursor: "pointer",
                  width: "100%",
                  display: "block",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Sheet>
    </Box>
  );
};

export default SideDrawer;
