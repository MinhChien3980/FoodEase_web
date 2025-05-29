"use client";
import React, { useEffect, useState, useRef } from "react";
import { Box, IconButton } from "@mui/joy";
import { RiArrowUpLine } from "@remixicon/react";
import { throttle } from "lodash";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ xs: 60, md: 15 });
  const lastScrollY = useRef(0);

  // Visibility toggle logic
  const toggleVisibility = () => {
    const currentScrollY = window.scrollY;
    setIsVisible(currentScrollY > 300);
  };

  useEffect(() => {
    // Define the throttled scroll handler
    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY;

      toggleVisibility();

      // Check scroll direction and update position
      if (currentScrollY < lastScrollY.current) {
        setPosition((prev) => (prev.xs !== 80 ? { xs: 80, md: 15 } : prev));
      } else {
        setPosition((prev) => (prev.xs !== 15 ? { xs: 15, md: 15 } : prev));
      }
      lastScrollY.current = currentScrollY;
    }, 200); // Throttle the scroll handling to run every 200ms

    window.addEventListener("scroll", handleScroll);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel(); // Cancel the throttled function
    };
  }, []); // No dependencies required since `handleScroll` is defined inside the effect

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        zIndex: 99999999,
        position: "fixed",
        bottom: { xs: position.xs, md: position.md },
        right: 15,
        borderRadius: "50%",
        transition: "bottom 0.5s ease",
      }}
    >
      {isVisible && (
        <IconButton
          variant="solid"
          color="primary"
          aria-label="Back to top"
          sx={{ borderRadius: "50%" }}
          size="lg"
          onClick={scrollToTop}
        >
          <RiArrowUpLine />
        </IconButton>
      )}
    </Box>
  );
};

export default BackToTop;
