import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { get_sections } from "@/interceptor/api";
import ProductCard from "@/component/Cards/ProductCard2";
const BreadCrumb = dynamic(() => import("@/component/BreadCrumps/BreadCrumb"), {
  ssr: false,
});
import SpecificProductsSkeleton from "@/component/Skeleton/SpecificProductsSkeleton";

const Box = dynamic(() => import("@mui/joy/Box"), { ssr: false });
const Grid = dynamic(() => import("@mui/joy/Grid"), { ssr: false });

const Index = () => {
  const [slug, setSlug] = useState(null);
  const [sections, setSections] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (router.query.slug) {
      setSlug(router.query.slug);
    }
  }, [router.query.slug]);

  useEffect(() => {
    if (slug !== null) {
      fetchData();
    }
  }, [slug]);

  const fetchData = async () => {
    try {
      const formData = new FormData();
      formData.append("slug", slug);
      let city_id = localStorage.getItem("city");
      const res = await get_sections({ city_id, slug: slug });
      setSections(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false); // Stop loading even if there is an error
    }
  };

  return (
    <>
      <BreadCrumb />
      <Box gap={1} mb={5} mt={4}>
        {loading ? (
          <SpecificProductsSkeleton />
        ) : (
          sections?.map((data, index) => {
            const { product_details } = data;
            return (
              <Box key={index}>
                {product_details.length > 0 && (
                  <Grid container spacing={2} mt={2}>
                    {product_details.map((Product, index) => (
                      <Grid xs={12} sm={6} md={4} lg={3} xl={2.2} key={index}>
                        <Box sx={{ maxWidth: 300, margin: "0 auto" }}>
                          <ProductCard
                            Product={Product}
                            is_section_product={true}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            );
          })
        )}
      </Box>
    </>
  );
};

export default Index;
