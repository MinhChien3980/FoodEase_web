import React, { useEffect, useRef, useState, useCallback } from "react";
import { get_products } from "@/interceptor/api";
import { Box, Grid, CircularProgress, Typography } from "@mui/joy";
import dynamic from "next/dynamic";
import debounce from "lodash.debounce";
import * as fbq from "@/lib/fpixel";

const BreadCrumb = dynamic(() => import("@/component/BreadCrumps/BreadCrumb"), {
  ssr: false,
});

import ProductFlatCard from "@/component/Cards/ProductFlatCard";
import { HeadTitle } from "@/component/HeadTitle";
import { useTranslation } from "react-i18next";
import NotFound from "../NotFound";
import ProductFlatCardSkeleton from "../../component/Skeleton/ProductFlatCardSkeleton";
import FilterSection from "../../component/RestaurantsPage/FilterSection";
import ProductCard from "@/component/Cards/ProductCard";

const Index = () => {
  const [products, setProducts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState("list");
  const limit = 16;
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const observerRef = useRef(null);
  const city_id = localStorage.getItem("city");

  const [prefill, setPrefill] = useState({
    order: "DESC",
    top_rated_foods: 0,
    min_price: 1,
    max_price: 5000,
    vegetarian: 3,
  });

  const { t } = useTranslation();

  const fetchProducts = async (reset = false) => {
    if (!hasMore && !reset) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("offset", reset ? 0 : offset);
      formData.append("limit", limit);
      formData.append("city_id", city_id);
      formData.append("search", searchQuery);
      formData.append(
        "order",
        prefill.top_rated_foods == 0 ? prefill.order : ""
      );
      formData.append("vegetarian", prefill.vegetarian);
      formData.append(
        "min_price",
        prefill.min_price > 0 ? prefill.min_price : ""
      );
      formData.append("max_price", prefill.max_price);
      formData.append("top_rated_foods", prefill.top_rated_foods);
      formData.append("sort", "pv.price");
      formData.append("filter_by", "p.id");

      const response = await get_products(formData);
      const newProducts = response?.data || [];

      setProducts((prevProducts) => {
        const combinedProducts = reset
          ? newProducts
          : [...prevProducts, ...newProducts];
        const uniqueProducts = Array.from(
          new Set(combinedProducts.map((product) => product.id))
        ).map((id) => combinedProducts.find((product) => product.id === id));
        return uniqueProducts;
      });

      setOffset((prevOffset) => (reset ? limit : prevOffset + limit));
      setHasMore(newProducts.length === limit);
    } catch (error) {
      console.error("Error fetching Products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const lastProductRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchProducts();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    fetchProducts(true);
    fbq.customEvent("products-page-view");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchQuery) {
      debounceFetchProducts();
    }
  }, [searchQuery]);

  const debounceFetchProducts = debounce(() => {
    setProducts([]);
    setOffset(0);
    setHasMore(true);
    fetchProducts(true);
  }, 250);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleApplyFilters = () => {
    setProducts([]);
    setOffset(0);
    setHasMore(true);
    fetchProducts(true);
  };

  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  return (
    <>
      <HeadTitle title={"Products"} />
      <BreadCrumb />
      <Box mt={2} mb={2}>
        <FilterSection
          prefill={prefill}
          setPrefill={setPrefill}
          handleApplyFilters={handleApplyFilters}
          toggleViewMode={toggleViewMode}
          handleInputChange={handleInputChange}
          searchQuery={searchQuery}
          is_product_page={true}
        />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={4}
        width="100%"
        mb={4}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="start"
          spacing={2}
          width="100%"
        >
          {products.map((product, index) => (
            <Grid
              xs={12}
              sm={6}
              md={6}
              lg={4}
              xl={3}
              key={product.id}
              ref={index === products.length - 1 ? lastProductRef : null}
            >
              {viewMode === "list" ? (
                <ProductFlatCard Product={product} />
              ) : (
                <ProductCard Product={product} />
              )}
            </Grid>
          ))}
        </Grid>
        {isLoading && <ProductFlatCardSkeleton count={limit} />}
        {!isLoading && products.length === 0 && <NotFound />}
      </Box>
    </>
  );
};

export default Index;
