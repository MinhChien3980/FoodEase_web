import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/joy";
import { useRouter } from "next/router";
import { get_products } from "@/interceptor/api";
import ProductFlatCard from "../../../component/Cards/ProductFlatCard";
import dynamic from "next/dynamic";
import NotFound from "@/pages/404";

const BreadCrumb = dynamic(() => import("@/component/BreadCrumps/BreadCrumb"), {
  ssr: false,
});
import ProductFlatCardSkeleton from "../../../component/Skeleton/ProductFlatCardSkeleton";

const SearchProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) {
      fetchProducts(slug);
    }
  }, [slug]);

  const fetchProducts = async (slug) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("slug", slug);
      const response = await get_products(formData);
      setProducts(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setLoading(false);
    }
  };

  return (
    <Box mt={2}>
      <BreadCrumb />

      <Box mt={3}>
        {loading ? (
          <ProductFlatCardSkeleton />
        ) : products.length > 0 ? (
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid key={product.id} item xs={12} sm={6} md={6} lg={4} xl={3}>
                <ProductFlatCard Product={product} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            <NotFound />
          </>
        )}
      </Box>
    </Box>
  );
};

export default SearchProducts;
