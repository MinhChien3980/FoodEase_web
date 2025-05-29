"use client";
import dynamic from "next/dynamic";
const BreadCrumb = dynamic(() => import("@/component/BreadCrumps/BreadCrumb"), {
  ssr: false,
});
import RestaurantCard from "@/component/Cards/RestaurantCard";
import { HeadTitle } from "@/component/HeadTitle";
import * as fbq from "@/lib/fpixel";
import SectionHeading from "@/component/SectionHeading/SectionHeading";
import RestaurantsSkeleton from "@/component/Skeleton/RestaurantsSkeleton";
import { get_products } from "@/interceptor/api";
import NotFound from "@/pages/NotFound";
import { Box, Grid, Typography } from "@mui/joy";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // Assuming you're using react-i18next for translation

const SpecificCategoryPage = () => {
  const [slug, setSlug] = useState(null);
  const [products, setProducts] = useState(null);
  const [categoryName, setCategoryName] = useState();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const router = useRouter();
  useEffect(() => {
    if (router.query.slug) {
      setSlug(router.query.slug);
    }
  }, [router.query.slug]);

  useEffect(() => {
    if (slug) {
      // Only fetch data if slug is defined
      fetchData(); // Call the async function
    }
    // eslint-disable-next-line
  }, [slug]); // Include slug in the dependency array

  const fetchData = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("category_slug", slug);
      const res = await get_products(formData);
      setProducts(res.data);
      setCategoryName(res?.categories?.[0]?.name || "");
      fbq.customEvent("specific-categories-Page-view", {
        name: res?.categories?.[0]?.name || "",
      });
      setLoading(false);
    } catch (error) {
      // Handle error
      setLoading(false);
      console.error("Error fetching products:", error);
    }
  };

  return (
    <>
      <HeadTitle title={categoryName} />
      <BreadCrumb lastChild={categoryName} flag={true} />
      <Box p={2}>
        {categoryName ? (
          <SectionHeading
            title={`${t("Restaurants-for")} ${categoryName}`}
            highlightText={categoryName}
            imageId={4}
          />
        ) : null}
        {loading ? (
          <>
            <RestaurantsSkeleton />
          </>
        ) : (
          <>
            {products && products.length != 0 ? (
              <Grid
                container
                display={"flex"}
                alignItems={"center"}
                justifyContent={"start"}
                spacing={1}
                mt={2}
              >
                {/* Render the Restaurants for Specific category */}
                {products &&
                  products.map((product) => (
                    <Grid key={product.id} xs={12} md={4} lg={3} xl={2}>
                      <RestaurantCard
                        restaurant={product?.partner_details[0]}
                      />
                    </Grid>
                  ))}
              </Grid>
            ) : (
              <NotFound />
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default SpecificCategoryPage;
