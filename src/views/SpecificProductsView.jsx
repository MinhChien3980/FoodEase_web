"use client";

import Product from "@/pages/SpecificProducts/[slug]";
import { Box } from "@mui/joy";
import React from "react";


const Products = () => {
    const Products = useSelector((state) => state?.homepage?.homeProducts);
    const { t } = useTranslation();
  
    if (Products?.length == 0) {
      return null;
    }
    return (
      <>
        <Box display={"flex"} flexDirection={"column"} gap={1}>
          
          <Box>
            GEHSH
          </Box>
        </Box>
      </>
    );
  };

  export default Products;