import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { HeadTitle } from "@/component/HeadTitle";
import PartnerBanner from "@/component/RestaurantsPage/PartnerBanner";
import { get_categories, get_partners, get_menu_items_by_restaurant } from "@/interceptor/api";
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
  const [restaurant, setRestaurant] = useState([]);
  const [products, setProducts] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [slug, setSlug] = useState(null);
  const [Loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
      setRestaurantId(router.query.slug);
    }
  }, [router.query.slug]);

  useEffect(() => {
    if (slug) {
      getPartners();
      getCategories();
    }
    // eslint-disable-next-line
  }, [slug]);

  useEffect(() => {
    if (restaurantId) {
      getMenuItems();
    }
  }, [restaurantId]);

  useEffect(() => {
    // Update menu items with restaurant details when restaurant data becomes available
    if (restaurant && restaurant.partner_name && menuItems.length > 0) {
      const updatedItems = menuItems.map(item => ({
        ...item,
        partner_details: [
          {
            partner_name: restaurant.partner_name,
            slug: slug
          }
        ]
      }));
      setMenuItems(updatedItems);
      setFilteredMenuItems(updatedItems);
    }
  }, [restaurant, slug]);

  useEffect(() => {
    filterMenuItems();
  }, [menuItems, selectedCategoryId, searchQuery, prefill]);

  const getPartners = async () => {
    try {
      const response = await get_partners({ slug });
      if (!response.error) {
        setRestaurant(response.data[0]);
        fbq.customEvent("specific-restaurants-Page-view", {
          name: response.data[0].partner_name,
        });
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

  const getMenuItems = async () => {
    try {
      setLoading(true);
      const response = await get_menu_items_by_restaurant(restaurantId);
      if (response.code === 200) {
        // Transform the data to match the expected format
        const transformedItems = response.data.map(item => ({
          // Fields from API
          id: item.id,
          name: item.name,
          short_description: item.description,
          price: item.price,
          image: item.imageUrl,
          category_id: item.categoryId,
          partner_id: item.restaurantId,
          
          // Minimum required fields for UI components
          rating: 0,
          indicator: 0,
          variants: [
            {
              id: item.id,
              price: item.price,
              special_price: "0",
              stock: 1
            }
          ],
          partner_details: [
            {
              partner_name: "Restaurant",
              slug: slug
            }
          ]
        }));
        setMenuItems(transformedItems);
        setFilteredMenuItems(transformedItems);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setLoading(false);
    }
  };

  const filterMenuItems = () => {
    let filtered = [...menuItems];

    // Filter by category
    if (selectedCategoryId) {
      filtered = filtered.filter(item => item.category_id === selectedCategoryId);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.short_description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price range (only if API actually has price data)
    if (prefill.min_price > 1) {
      filtered = filtered.filter(item => item.price >= prefill.min_price);
    }
    if (prefill.max_price < 5000) {
      filtered = filtered.filter(item => item.price <= prefill.max_price);
    }

    // Sort by order
    if (prefill.order === "ASC") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (prefill.order === "DESC") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredMenuItems(filtered);
    setProducts(filtered); // Set products for ProductsView component
  };

  const handleSearch = debounce((query) => {
    setSearchQuery(query);
  }, 250);

  const handleInputChange = (e) => {
    const query = e.target.value;
    if (query.length === 0) {
      setSearchQuery("");
    } else {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        handleSearch(query);
      }, 1000);
    }
  };

  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  const handleApplyFilters = () => {
    filterMenuItems();
  };

  const handleTabChange = (event, newValue) => {
    setSelectedCategoryId(newValue);
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
          products={filteredMenuItems}
          viewMode={viewMode}
          Loading={Loading}
          hasMore={false}
          loadMoreProducts={() => {}}
        />
      </Box>
    </>
  );
};

export default SpecificRestaurant;
