import React, { useState, useEffect, useRef } from "react";
import { get_categories } from "@/interceptor/api";
import { Box, Grid } from "@mui/joy";
import dynamic from "next/dynamic";
const BreadCrumb = dynamic(() => import("@/component/BreadCrumps/BreadCrumb"), {
  ssr: false,
});
const Button = dynamic(() => import("@mui/joy/Button"), { ssr: false });
import CategoryFlatCard from "@/component/Cards/CategoryFlatCard";
import { HeadTitle } from "@/component/HeadTitle";
import { useTranslation } from "react-i18next";
import * as fbq from "@/lib/fpixel";
import CategorySkeleton from "@/component/Skeleton/CategorySkeleton";

const Index = () => {
  const [categories, setCategories] = useState([]);
  const [offset, setOffset] = useState(0);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 18;

  const { t } = useTranslation();
  const observerRef = useRef();

  useEffect(() => {
    if (offset === 0) {
      fbq.customEvent("categories-page-view");
    }
    if (offset === 0 || offset >= categories.length) {
      fetchData();
    } // eslint-disable-next-line
  }, [offset]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          offset + limit < totalData
        ) {
          setOffset((prevOffset) => prevOffset + limit);
        }
      },
      {
        root: null,
        rootMargin: "20px",
        threshold: 1.0,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [observerRef, loading, totalData, offset]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const categoriesData = await get_categories({ offset, limit });

      if (categoriesData.error) {
        if (categoriesData?.data?.length === 0) {
          setOffset((prevOffset) => Math.max(prevOffset - limit, 0));
        }
      } else {
        setCategories((prevCategories) => {
          const combinedCategories = [
            ...prevCategories,
            ...categoriesData?.data,
          ];
          const uniqueCategories = Array.from(
            new Set(combinedCategories?.map((category) => category?.id))
          ).map((id) =>
            combinedCategories?.find((category) => category.id === id)
          );
          return uniqueCategories;
        });
        setTotalData(categoriesData?.total);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <>
      <HeadTitle title={"Categories"} />
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        flexDirection={"column"}
        width={"100%"}
      >
        <BreadCrumb />
        <Grid
          container
          display={"flex"}
          alignItems={"center"}
          justifyContent={"start"}
          paddingY={2}
          width={"100%"}
          spacing={1}
        >
          {categories &&
            categories?.map((category, index) => (
              <Grid
                xs={6}
                sm={6}
                lg={3}
                xl={2}
                key={index}
                display={"flex"}
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <CategoryFlatCard category={category} />
              </Grid>
            ))}
        </Grid>
        {loading && (
          <Box width={"100%"} className="flexProperties">
            <CategorySkeleton count={limit} />
          </Box>
        )}
        <Box ref={observerRef} />
      </Box>
    </>
  );
};

export default Index;
