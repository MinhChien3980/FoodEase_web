import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { HeadTitle } from "@/component/HeadTitle";
import PartnerBanner from "@/component/RestaurantsPage/PartnerBanner";
import { get_categories, get_partners, get_products } from "@/interceptor/api";
import { Box } from "@mui/joy";
import * as fbq from "@/lib/fpixel";
const BreadCrumb = dynamic(() => import("@/component/BreadCrumps/BreadCrumb"), {
  ssr: false,
});
import { useRouter } from "next/router";
import debounce from "lodash.debounce";
import { useTranslation } from "react-i18next";
import FilterSection from "@/component/RestaurantsPage/FilterSection";
import ProductsView from "@/component/RestaurantsPage/ProductsView";
import PartnerBannerSkeleton from "@/component/Skeleton/PartnerBannerSkeleton";
import CategoryTabs from "@/component/RestaurantsPage/CategoryTabs";

const SpecificRestaurant = () => {
  let partnerId0;

  const [restaurant, setRestaurant] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [slug, setSlug] = useState(null);
  const [Loading, setLoading] = useState(true);
  const [partnerId, setPartnerId] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [perPageProducts, setPerPageProducts] = useState(15);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const [prefill, setPrefill] = useState({
    order: "DESC",
    top_rated_foods: 0,
    min_price: 1,
    max_price: 5000,
    vegetarian: 3,
  });

  const { t } = useTranslation();
  const timerRef = useRef(null);

  const router = useRouter();
  useEffect(() => {
    if (router.query.slug) {
      setSlug(router.query.slug);
    }
  }, [router.query.slug]);

  useEffect(() => {
    if (slug) {
      getPartners();
      getCategories();
    }
    // eslint-disable-next-line
  }, [slug]);

  const getPartners = async () => {
    try {
      const response = await get_partners({ slug });
      if (!response.error) {
        partnerId0 = response.data[0].partner_id;
        setPartnerId(response.data[0].partner_id);
        setRestaurant(response.data[0]);
        fbq.customEvent("specific-restaurants-Page-view", {
          name: response.data[0].partner_name,
        });
        getProducts();
      }
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  const getCategories = async () => {
    try {
      const response = await get_categories({ partner_slug: slug });
      if (!response.error) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getProducts = async (categoryId, searchQuery = "") => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("product_id", "");
      formData.append("category_slug", "");
      formData.append("category_id", categoryId || "");
      formData.append("search", searchQuery);
      formData.append("limit", perPageProducts);
      formData.append("offset", offset);
      formData.append("partner_slug", slug || "");
      formData.append(
        "vegetarian",
        prefill.vegetarian == 3 ? "" : prefill.vegetarian
      );
      formData.append(
        "min_price",
        prefill.min_price > 1 ? prefill.min_price : ""
      );
      formData.append("max_price", prefill.max_price);
      formData.append("order", prefill.order);
      formData.append("top_rated_foods", prefill.top_rated_foods);
      formData.append(
        "partner_id",
        partnerId !== null ? partnerId : partnerId0
      );
      formData.append("sort", "pv.price");
      formData.append("filter_by", "p.id");

      const response = await get_products(formData);

      if (!response.error) {
        setProducts((prevProducts) => [...prevProducts, ...response.data]);
        setHasMore(response.data.length === perPageProducts);
        setOffset((prevOffset) => prevOffset + response.data.length);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const loadMoreProducts = debounce(() => {
    if (!Loading) {
      getProducts(selectedCategoryId);
    }
  }, 300);

  const handleSearch = debounce((query) => {
    setProducts([]);
    setOffset(0);
    getProducts("", query);
  }, 250);

  const handleInputChange = (e) => {
    const query = e.target.value;
    if (query.length === 0) {
      setProducts([]);
      setOffset(0);
      getProducts();
    } else {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setPrefill({
          order: "",
          top_rated_foods: 0,
          min_price: 1,
          max_price: "",
          vegetarian: "3",
        });
        handleSearch(query);
      }, 1000);
    }
  };

  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  const handleApplyFilters = () => {
    setProducts([]);
    setOffset(0);
    getProducts();
  };

  const handleTabChange = (event, newValue) => {
    setProducts([]);
    setOffset(0);
    getProducts(newValue);
  };

  return (
    <>
      <BreadCrumb lastChild={restaurant.partner_name} />
      <HeadTitle title={restaurant.partner_name} />

      {restaurant.length != 0 ? (
        <PartnerBanner restaurant={restaurant} />
      ) : (
        <Box my={2}>
          <PartnerBannerSkeleton />
        </Box>
      )}
      <Box width={"100%"} my={2}>
        <FilterSection
          handleInputChange={handleInputChange}
          toggleViewMode={toggleViewMode}
          viewMode={viewMode}
          setViewMode={setViewMode}
          prefill={prefill}
          setPrefill={setPrefill}
          handleApplyFilters={handleApplyFilters}
        />
      </Box>

      <Box width={"100%"} my={2}>
        <CategoryTabs
          categories={categories}
          handleTabChange={handleTabChange}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
        />
      </Box>

      <Box my={2} minHeight={"40vh"}>
        <ProductsView
          products={products}
          viewMode={viewMode}
          Loading={Loading}
          hasMore={hasMore}
          loadMoreProducts={loadMoreProducts}
        />
      </Box>
    </>
  );
};

export default SpecificRestaurant;
