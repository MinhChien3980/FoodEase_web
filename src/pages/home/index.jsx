"use client";
import React from "react";

import "swiper/swiper-bundle.css";
import "swiper/css/navigation";

import dynamic from "next/dynamic";

const HomePage = dynamic(() => import("@/views/Homepage"), {
  ssr: false,
});

const Home = () => {
  return <HomePage />;
};

export default Home;
