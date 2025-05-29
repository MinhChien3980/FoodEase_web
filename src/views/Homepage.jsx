"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Box } from "@mui/joy";
import Sliders from "@/component/Sliders/Sliders";
import Category from "@/views/Category";
import Offers from "./Offers";
import Restaurants from "./Restaurants";
import Products from "./Products";
import FeatureSections from "./FeatureSections";
import Services from "./Services";
import Boxes from "./Boxes";
import Faqs from "@/component/FAQs/Faqs";
import { HeadTitle } from "@/component/HeadTitle";
import SearchModal from "@/component/Models/SearchModal";
import DownloadApp from "./DownloadApp";
import FirstFreeDelivery from "@/component/FirstFreeDelivery/FirstFreeDelivery";
import { onCityChange } from "@/events/events";
import GoogleMapCities from "./GoogleMapCities";
import * as fbq from "@/lib/fpixel";

const Homepage = () => {
  const selectedCity = useSelector((state) => state.selectedCity.value); // Selecting the city from Redux state

  const router = useRouter(); // Accessing router

  // Redirect if no city is selected
  useEffect(() => {
    if (Object.keys(selectedCity).length === 0) {
      router.push("/");
    }
  }, [selectedCity, router]);
  // useEffect(() => {
  //   let city_id = localStorage.getItem("city");
  //   if (city_id) onCityChange({ city_id });
  // }, []);

  // Set root HTML attribute for direction
  useEffect(() => {
    const rootHtml = document.getElementById("root-html");
    if (rootHtml) {
      rootHtml.setAttribute("dir", "auto");
    }
  });

  const is_free_delivery = useSelector(
    (state) => state.userSettings?.value?.is_first_order
  );

  return (
    <>
      <HeadTitle title={"Home"} />
      <Box sx={{ display: { xs: "flex", sm: "none" }, gap: 2 }}>
        <SearchModal displayType={"search"} />
      </Box>
      <Box>
        <Sliders />
      </Box>
      <Box mt={4}>
        <Category />
      </Box>

      {is_free_delivery && is_free_delivery == "1" && (
        <Box my={1}>
          <FirstFreeDelivery />
        </Box>
      )}

      <Box mt={4}>
        <Offers />
      </Box>

      <Box mt={4}>
        <Restaurants />
      </Box>

      <Box mt={4}>
        <Products />
      </Box>

      <Box mt={4}>
        <FeatureSections />
      </Box>

      <Box mt={4}>
        <Services />
      </Box>
      <Box mt={4}>
        <DownloadApp />
      </Box>
      <Box mt={4}>
        <Faqs />
      </Box>

      <Box mt={4}>
        <Boxes />
      </Box>
      <Box mt={4}>
        <GoogleMapCities />
      </Box>
    </>
  );
};

export default Homepage;
