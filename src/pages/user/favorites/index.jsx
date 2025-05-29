import dynamic from "next/dynamic";
const BreadCrumb = dynamic(() => import("@/component/BreadCrumps/BreadCrumb"), {
  ssr: false,
});
import FavProducts from "@/component/Favorites/FavProducts";
import FavRestaurants from "@/component/Favorites/FavRestaurants";
import { HeadTitle } from "@/component/HeadTitle";
import SectionHeading from "@/component/SectionHeading/SectionHeading";
import { Box, Tabs, TabList, Tab, useTheme, Grid, TabPanel } from "@mui/joy";
import { tabClasses } from "@mui/joy/Tab";
import { useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const FavoritesPage = () => {
  const [index, setIndex] = useState(0);
  const theme = useTheme();

  const [orientation, setOrientation] = useState("vertical");
  const isXs = useMediaQuery("(max-width:599.95px)");
  const isMd = useMediaQuery("(min-width:900px) and (max-width:1199.95px)");

  const { t } = useTranslation();

  useEffect(() => {
    if (isXs) {
      setOrientation("horizontal");
    } else if (isMd) {
      setOrientation("vertical");
    } else {
      setOrientation("vertical");
    }
  }, [isXs, isMd]);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <HeadTitle title={"Favourites"} />
      <BreadCrumb />
      <Box pl={1} mt={1}>
        <SectionHeading
          title={t("favourites")}
          subtitle={t("Order-A-Favorites-Today")}
          highlightText={t("favourites")}
        />
      </Box>

      <Tabs
        aria-label="Favorites Tabs"
        orientation={orientation}
        value={index}
        onChange={(event, newValue) => setIndex(newValue)}
        sx={{
          flex: 1,
          "& .MuiTabs-flexContainer": {
            height: "100%",
          },
          marginTop: 2,
          backgroundColor: theme.palette.background.body,
        }}
      >
        <Box borderRight="2.5px dotted #cacaca" minWidth="150px">
          <TabList
            disableUnderline
            sx={{
              [`& .${tabClasses.root}`]: {
                '&[aria-selected="true"]': {
                  "&::before": {
                    display: "block",
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    backgroundColor: theme.palette.primary.main,
                  },
                },
              },
            }}
          >
            <Tab
              disableIndicator
              sx={{ backgroundColor: theme.palette.background.body }}
            >
              {t("Restaurants")}
            </Tab>
            <Tab
              disableIndicator
              sx={{ backgroundColor: theme.palette.background.body }}
            >
              {t("Products")}
            </Tab>
          </TabList>
        </Box>

        <TabPanel
          value={index}
          sx={{
            flex: 1,
            overflow: "hidden",
            backgroundColor: theme.palette.background.body,
          }}
        >
          {index === 0 && <FavRestaurants />}
          {index === 1 && <FavProducts />}
        </TabPanel>
      </Tabs>
    </Box>
  );
};

export default FavoritesPage;
