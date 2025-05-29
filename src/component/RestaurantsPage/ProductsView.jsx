import { Box, Grid, Typography } from "@mui/joy";
import React, { useEffect, useRef, useCallback } from "react";
import ProductCard from "@/component/Cards/ProductCard";
import ProductFlatCard from "@/component/Cards/ProductFlatCard";
import ProductFlatCardSkeleton from "@/component/Skeleton/ProductFlatCardSkeleton";
import SpecificProductsSkeleton from "@/component/Skeleton/SpecificProductsSkeleton";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const ProductsView = ({
  viewMode,
  products,
  Loading,
  hasMore,
  loadMoreProducts,
}) => {
  const { t } = useTranslation();
  const observer = useRef();
  const lastProductElementRef = useCallback(
    (node) => {
      if (Loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreProducts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [Loading, hasMore, loadMoreProducts]
  );

  const renderProducts = () => {
    if (viewMode === "grid") {
      return (
        <Grid container spacing={2} width={"100%"}>
          {products.map((product, index) => (
            <Grid xs={12} sm={4} lg={3} xl={2.4} key={index}>
              {products.length === index + 1 ? (
                <div ref={lastProductElementRef}>
                  <ProductCard Product={product} />
                </div>
              ) : (
                <ProductCard Product={product} />
              )}
            </Grid>
          ))}
        </Grid>
      );
    } else if (viewMode === "list") {
      return (
        <Grid container spacing={2}>
          {products.map((product, index) => (
            <Grid xs={12} sm={6} lg={4} xl={3} key={index}>
              {products.length === index + 1 ? (
                <div ref={lastProductElementRef}>
                  <ProductFlatCard Product={product} />
                </div>
              ) : (
                <ProductFlatCard Product={product} />
              )}
            </Grid>
          ))}
        </Grid>
      );
    }
  };

  return (
    <div>
      <Box my={2}>{renderProducts()}</Box>

      {Loading &&
        (viewMode === "grid" ? (
          <SpecificProductsSkeleton />
        ) : (
          <ProductFlatCardSkeleton />
        ))}

      {products.length === 0 && !Loading && (
        <Grid
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Image
            width={380}
            height={380}
            src="/assets/images/not-found.gif"
            alt="notfound"
          />
          <Typography variant="h6" component="h5" level="body-lg" fontSize={20}>
            {t("Nothing Here Yet")}
          </Typography>
        </Grid>
      )}
    </div>
  );
};

export default ProductsView;
