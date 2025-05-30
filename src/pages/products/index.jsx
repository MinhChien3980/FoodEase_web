import React, { useEffect, useRef, useState, useCallback } from "react";
import { get_menu_items } from "@/interceptor/api";
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

// Component wrapper để handle image loading với fallback
const ImageWithFallback = ({ src, alt, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    console.log(`Failed to load image: ${imgSrc}, falling back to default`);
    setImgSrc("/assets/images/default-food.jpg");
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
  }, [src]);

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
      onLoad={handleLoad}
      style={{ 
        ...props.style,
        opacity: isLoading ? 0.7 : 1,
        transition: 'opacity 0.3s ease'
      }}
    />
  );
};

const Index = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list");

  const [prefill, setPrefill] = useState({
    order: "DESC",
    top_rated_foods: 0,
    min_price: 1,
    max_price: 5000,
    vegetarian: 3,
  });

  const { t } = useTranslation();

  // Adapter function để chuyển đổi data từ menu-items API thành format mà ProductCard expect
  const adaptMenuItemToProduct = (menuItem) => {
    // Chuyển đổi đường dẫn hình ảnh từ imageUrl
    let imageUrl = "/assets/images/default-food.jpg"; // fallback image
    
    if (menuItem.imageUrl) {
      // Kiểm tra xem imageUrl đã là URL đầy đủ chưa
      if (menuItem.imageUrl.startsWith('http://') || menuItem.imageUrl.startsWith('https://')) {
        imageUrl = menuItem.imageUrl;
      } else {
        // Nếu là đường dẫn local (E:/images/f1.jpg), chuyển thành URL server
        const fileName = menuItem.imageUrl.split(/[/\\]/).pop(); // xử lý cả / và \ 
        imageUrl = `http://localhost:8080/images/${fileName}`;
        
        // Log để debug
        console.log(`Original imageUrl: ${menuItem.imageUrl}`);
        console.log(`Converted imageUrl: ${imageUrl}`);
        console.log(`Filename: ${fileName}`);
      }
    }

    return {
      id: menuItem.id,
      name: menuItem.name,
      image: imageUrl,
      short_description: menuItem.description,
      indicator: 1, // default value
      variants: [
        {
          id: menuItem.id,
          price: menuItem.price.toString(),
          special_price: "0", // menu-items không có special price
        }
      ],
      total_allowed_quantity: 100, // default value
      minimum_order_quantity: 1, // default value
      rating: "0", // default value
      min_max_price: {
        discount_in_percentage: "0"
      },
      partner_details: [
        {
          partner_name: "Default Restaurant",
          is_restro_open: "1"
        }
      ],
      partner_id: menuItem.restaurantId,
      product_add_ons: [],
      no_of_ratings: "0",
      is_spicy: "0",
      best_seller: "0",
      is_favorite: "0",
      // Thêm price trực tiếp để dễ filter
      price: menuItem.price,
      description: menuItem.description
    };
  };

  const fetchMenuItems = async () => {
    setIsLoading(true);
    try {
      const response = await get_menu_items();
      if (response.code === 200) {
        // Chuyển đổi dữ liệu từ menu-items thành format của products
        const adaptedProducts = response.data.map(adaptMenuItemToProduct);
        setProducts(adaptedProducts);
        setFilteredProducts(adaptedProducts);
      }
    } catch (error) {
      console.error("Error fetching Menu Items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
    fbq.customEvent("products-page-view");
  }, []);

  // Lọc sản phẩm theo tìm kiếm và filters
  useEffect(() => {
    let filtered = [...products];
    
    // Lọc theo search query
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Lọc theo giá
    if (prefill.min_price > 1) {
      filtered = filtered.filter(product => product.price >= prefill.min_price);
    }
    if (prefill.max_price < 5000) {
      filtered = filtered.filter(product => product.price <= prefill.max_price);
    }

    // Sắp xếp
    if (prefill.order === "ASC") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (prefill.order === "DESC") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, prefill]);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleApplyFilters = () => {
    // Filters sẽ được apply tự động qua useEffect
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
          {filteredProducts.map((product, index) => (
            <Grid
              xs={12}
              sm={6}
              md={6}
              lg={4}
              xl={3}
              key={product.id}
            >
              {viewMode === "list" ? (
                <ProductFlatCard Product={product} />
              ) : (
                <ProductCard Product={product} />
              )}
            </Grid>
          ))}
        </Grid>
        {isLoading && <ProductFlatCardSkeleton count={8} />}
        {!isLoading && filteredProducts.length === 0 && <NotFound />}
      </Box>
    </>
  );
};

export default Index;
