import { Box, Grid, Typography } from "@mui/joy";
import React from "react";
import { useTheme } from "@mui/joy/styles";
import Link from "next/link";
import Highlighter from "react-highlight-words"; // Import Highlighter

// icons
import { RiArrowRightDoubleLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";

const SectionHeading = ({
  title,
  subtitle,
  highlightText = "",
  showMore = false,
  showMoreLink = "",
  color = "primary",
  imageId = null,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const Images = [
    {
      id: 1,
      name: "fire",
      url: "/assets/images/fire.png",
    },
    {
      id: 2,
      name: "food-cover-tray",
      url: "/assets/images/food-cover-tray.png",
    },
    {
      id: 3,
      name: "food-cup",
      url: "/assets/images/food-cup.png",
    },
    {
      id: 4,
      name: "locationIcon with Spoon",
      url: "/assets/images/location-Icon-Spoon.png",
    },
    {
      id: 5,
      name: "Offer Image",
      url: "/assets/images/offer-title-image.png",
    },
  ];

  // Splitting the title into words
  const titleWords = title?.split(" ");

  // Defining the word to highlight
  let wordToHighlight = highlightText;

  // If highlightText is empty, highlight the second word of the title
  if (!highlightText && titleWords?.length > 1) {
    wordToHighlight = titleWords[1];
  }

  return (
    <>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={showMore === true ? "space-between" : "start"}
        flexDirection="column"
      >
        <Grid
          container
          display={"flex"}
          alignItems={"center"}
          justifyContent={showMore ? "space-between" : "start"}
          width="100%"
        >
          <Grid
            xs={showMore ? 8 : 12}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"start"}
            gap={1}
          >
            {imageId != null && (
              <Box
                component={"img"}
                src={Images[imageId - 1].url}
                sx={{
                  maxHeight: "32px",
                  width: "29px",
                  objectFit: "contain",
                  borderRadius: theme.radius.xl,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            )}

            <Typography
              sx={{
                color:
                  color === "primary"
                    ? theme.palette.text.primary
                    : theme.palette.text.currency,
              }}
              fontSize={{ xs: "sm", sm: "xl", lg: "xl2" }}
              fontWeight={theme.fontWeight.xl}
            >
              <Highlighter
                searchWords={[wordToHighlight]}
                autoEscape={true}
                textToHighlight={title}
                highlightStyle={{
                  color: theme.palette.primary[600],
                  backgroundColor: "transparent",
                }}
              />
            </Typography>
          </Grid>

          <Grid
            xs={showMore ? 4 : 0}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"end"}
          >
            {showMore && (
              <Link href={showMoreLink || "#"}>
                <Typography
                  sx={{
                    fontSize: { xs: "xs", sm: "md" },
                    fontWeight: "xl",
                    color: theme.palette.text.primary,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    "&:hover": {
                      color: theme.palette.primary[600],
                    },
                  }}
                  endDecorator={<RiArrowRightDoubleLine />}
                >
                  {t("show-more")}
                </Typography>
              </Link>
            )}
          </Grid>
        </Grid>
      </Box>
      {subtitle && (
        <Box
          display={"flex"}
          alignItems={"start"}
          justifyContent={"start"}
          pl={imageId == null ? 0.5 : 4.7}
          mb={1}
        >
          <Typography
            variant="body2"
            color="textSecondary"
            component="div"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              color:
                color === "primary"
                  ? theme.palette.text.primary
                  : theme.palette.text.currency,
              fontSize: { xs: "xs", sm: "sm", md: "md" },
            }}
          >
            <Box display="flex" gap={0.5}>
              {subtitle
                .trim()
                .split(" ")
                .map((word, index) => (
                  <React.Fragment key={index}>
                    {word.startsWith("#") ? (
                      <Highlighter
                        searchWords={[word]}
                        autoEscape={true}
                        textToHighlight={word}
                        highlightStyle={{
                          color: theme.palette.primary[600],
                          backgroundColor: "transparent",
                        }}
                      />
                    ) : (
                      word
                    )}
                    {index < subtitle.trim().split(" ").length - 1 && " "}
                  </React.Fragment>
                ))}
            </Box>
          </Typography>
        </Box>
      )}
    </>
  );
};

export default SectionHeading;
