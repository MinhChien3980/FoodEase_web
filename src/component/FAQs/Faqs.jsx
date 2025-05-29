import { HomeCities, HomeFaqs } from "@/repository/home/home_repo";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Box,
  Button,
  Container,
  Grid,
  Typography,
  useTheme,
} from "@mui/joy";
import { accordionClasses } from "@mui/joy/Accordion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SectionHeading from "../SectionHeading/SectionHeading";
import ArrowRightUpLineIcon from "remixicon-react/ArrowRightUpLineIcon";
import { setAddress as setNewAddress } from "@/store/reducers/selectedMapAddressSlice";
import { useTranslation } from "react-i18next";
import { onCityChange } from "@/events/events";
import toast from "react-hot-toast";

const Faqs = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const Faqs = useSelector((state) => state?.homepage?.faqs);
  const Cities = useSelector((state) => state?.homepage?.homeCities);
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const changeCity = (city) => {
    // Dispatch an action to update the city in the Redux store
    dispatch(
      setNewAddress({
        city: city.name,
        lat: city.latitude,
        lng: city.longitude,
      })
    );

    // Trigger the onCityChange event
    onCityChange({
      city_id: city.id,
    });

    // Show a success toast
    toast.success(`${city.name} city is selected`);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Close the expanded accordion
    setExpanded(false);
  };

  return (
    <>
      <SectionHeading
        title={t("any-queries")}
        subtitle={t("how-we-can-help-you")}
      />

      <Box>
        <AccordionGroup
          size="md"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "sm",
            [`& .${accordionClasses.root}`]: {
              marginTop: "0.5rem",
              transition: "0.2s ease",
              border: "1px solid", // Add this line
              borderColor: "background.level2", // Add this line
              '& button:not([aria-expanded="true"])': {
                transition: "0.2s ease",
                paddingBottom: "0.625rem",
              },
              "& button:hover": {
                background: "transparent",
              },
            },
            [`& .${accordionClasses.root}.${accordionClasses.expanded}`]: {
              bgcolor: "transparent",
              borderRadius: "md",
              borderBottom: "1px solid",
              borderColor: "background.level2",
            },
          }}
        >
          <Accordion
            expanded={expanded === "citiesPanel"}
            onChange={handleAccordionChange("citiesPanel")}
            sx={{ marginBottom: 2, borderRadius: "sm" }}
            className="border"
          >
            <AccordionSummary
              aria-controls="citiesPanel-content"
              id="citiesPanel-header"
              className="accordion"
              indicator={<ArrowRightUpLineIcon />}
            >
              <Typography
                mt={0.5}
                fontWeight={theme.fontWeight.xl2}
                fontSize={{ xs: "md", md: "xl" }}
                color={theme.palette.text.primary}
                component="h5"
                variant="h6"
              >
                {t("cities-we-can-deliver")}
              </Typography>
            </AccordionSummary>

            <AccordionDetails className="accordion">
              <Grid container>
                {Cities?.map((city, index) => (
                  <Button
                    mt={0.5}
                    sx={{
                      color: theme.palette.danger[500],
                      backgroundColor: "transparent",
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                      fontSize: { xs: "sm", md: "md" },
                    }}
                    onClick={() => changeCity(city)}
                    key={city.id}
                  >
                    {city.name}
                  </Button>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {Faqs &&
            Faqs.map((faq, index) => {
              const { question, answer } = faq;
              return (
                <Accordion
                  key={index}
                  expanded={expanded === `faqPanel${index}`}
                  onChange={handleAccordionChange(`faqPanel${index}`)}
                  sx={{
                    marginBottom: 2,
                    borderRadius: "sm",
                  }}
                  className="border"
                >
                  <AccordionSummary
                    aria-controls={`faqPanel${index}-content`}
                    id={`faqPanel${index}-header`}
                    className="accordion"
                    indicator={<ArrowRightUpLineIcon />}
                  >
                    <Typography
                      component="h5"
                      fontWeight={theme.fontWeight.xl}
                      fontSize={{ xs: "md", md: "xl" }}
                      color={theme.palette.text.primary}
                      variant="h6"
                      mt={0.5}
                    >
                      {question}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails className="accordion">
                    <Typography
                      fontSize={{ xs: "sm", md: "lg" }}
                      mt={0.5}
                      pl={2}
                    >
                      {answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
        </AccordionGroup>
      </Box>
    </>
  );
};

export default Faqs;
