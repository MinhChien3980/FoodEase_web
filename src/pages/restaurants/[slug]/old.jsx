import { Input, useTheme, Checkbox } from "@mui/joy";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  Pagination,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import NotFound from "@/pages/404";
import { Divider, Drawer, Radio, RadioGroup, Sheet, Slider } from "@mui/joy";
import debounce from "lodash.debounce";
import TimeFillIcon from "remixicon-react/TimeFillIcon";
import { useDispatch, useSelector } from "react-redux";
import RatingBox from "@/component/RatingBox/RatingBox";
import dynamic from "next/dynamic";
const BreadCrumb = dynamic(() => import("@/component/BreadCrumps/BreadCrumb"), {
  ssr: false,
});
import { Button } from "@mui/joy";
import {
  RiArrowDownCircleLine,
  RiArrowUpCircleLine,
  RiEqualizer2Line,
  RiFilter2Line,
  RiGridFill,
  RiListCheck2,
  RiSearch2Line,
} from "@remixicon/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ProductCard from "@/component/Cards/ProductCard";
import ProductFlatCard from "@/component/Cards/ProductFlatCard";
import { get_categories, get_partners, get_products } from "@/interceptor/api";
import { HeadTitle } from "@/component/HeadTitle";
import { formatePrice } from "@/helpers/functionHelpers";

const SpecificRestaurant2 = ({
  order,
  top_rated_foods,
  min_price,
  max_price,
  vegetarian,
}) => {
  const [restaurants, setRestaurants] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [slug, setSlug] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [per_page] = useState(10);
  const [page, setPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState([]);
  const [foodType, setFoodType] = useState("");
  const [isFavorite, setIsFavorite] = useState(restaurants?.is_favorite == "1");
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState();
  const [viewMode, setViewMode] = useState("grid");
  const settings = useSelector((state) => state.settings.value);
  const [value, setValue] = useState(0);
  const matches = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const [partnerId, setPartnerId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const theme = useTheme();
  const dispatch = useDispatch();
  const timerRef = useRef(null);
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "xl"));
  const [iconSize, setIconSize] = useState(16);

  let partnerId0;

  useEffect(() => {
    if (isSm) {
      setIconSize(20);
    } else {
      setIconSize(16);
    }
  }, [isSm]);

  const handleSearch = debounce((searchQuery) => {
    const formData = new FormData();
    formData.append("search", searchQuery);
    formData.append("partner_slug", slug || "");
    get_products(formData).then((res) => {
      setProducts(res.data);
    });
  }, 250);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length === 0) {
      setProducts([]);
    } else {
      clearTimeout(timerRef.current);
      // Set a new timeout to perform search after 500ms (adjust as needed)
      timerRef.current = setTimeout(() => {
        handleSearch(query);
      }, 1000);
    }
  };

  useEffect(() => {
    setIsFavorite(restaurants?.is_favorite);
  }, [restaurants]);

  const router = useRouter();
  useEffect(() => {
    if (router.query.slug) {
      setSlug(router.query.slug);
    }
  }, [router.query.slug]);

  const getProducts = async (categoryId) => {
    try {
      let city_id = localStorage.getItem("city");

      const formData = new FormData();
      formData.append("product_id", "");
      formData.append("category_slug", "");
      formData.append("category_id", categoryId || "");
      formData.append("search", search || "");
      formData.append("limit", per_page);
      formData.append("offset", 0);
      formData.append("partner_slug", slug || "");
      formData.append("city_id", city_id);
      formData.append("vegetarian", prefill.vegetarian);
      formData.append("min_price", prefill.min_price);
      formData.append("max_price", prefill.max_price);
      formData.append("filter_by", "");
      formData.append("order", prefill.order);
      formData.append("top_rated_foods", prefill.top_rated_foods);
      formData.append(
        "partner_id",
        partnerId !== null ? partnerId : partnerId0
      );
      const response = await get_products(formData);

      if (!response.error) {
        const totalPages = Math.ceil(response.total / per_page);
        setPage(totalPages);
        setLoading(false);
        setProducts(response.data);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const [prefill, setPrefill] = useState({
    order: order ?? "",
    top_rated_foods: top_rated_foods ?? "",
    min_price: min_price ?? "",
    max_price: max_price ?? "",
    vegetarian: vegetarian ?? "3",
  });
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
        setRestaurants(response.data[0]);
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

  const [selectedValue, setSelectedValue] = useState(prefill.vegetarian);
  const [priceRange, setPriceRange] = useState([
    Number(prefill.min_price) || 0,
    Number(prefill.max_price) || 5000,
  ]);

  const handleChange = (event, newValue) => {
    setSelectedValue(event.target.value);
    setPrefill({ ...prefill, vegetarian: event.target.value });
    setValue(newValue);
    if (newValue === 0) {
      handleCategoryChange({ id: null, name: "All" });
    } else {
      handleItemClick(categories[newValue - 1]);
    }
  };

  const items = [
    { label: "Veg", value: "1" },
    { label: "Non-Veg", value: "2" },
    { label: "Both", value: "3" },
  ];

  const handleReset = () => {
    setPrefill(false);
  };
  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };
  const handleItemClick = (category) => {
    setSelectedItems(category);
    handleCategoryChange(category);
  };
  const handleRadioChange = (event) => {
    setPrefill((prefill) => ({
      ...prefill,
      vegetarian: event.target.value,
    }));
  };
  const handleOrderChange = () => {
    const newOrder = prefill.order === "ASC" ? "DESC" : "ASC";
    setPrefill((prefill) => ({
      ...prefill,
      order: newOrder,
    }));
  };

  const handleApplyFilters = () => {
    setOpen(false);
    getProducts();
  };
  const handleRangeChange = (e, newValue) => {
    setPrefill((prefill) => ({
      ...prefill,
      min_price: newValue[0],
      max_price: newValue[1],
    }));
  };
  const handleCategoryChange = (category) => {
    if (category.id === null) {
      setFoodType(null);
      setCurrentPage(1);
      getProducts(null);
    } else {
      setFoodType(category.id);
      setCurrentPage(1);
      getProducts(category.id);
    }
  };

  const renderProducts = () => {
    if (viewMode === "grid") {
      return (
        <Grid>
          {products.map((product, index) => (
            <Grid item xs={12} sm={4} md={2} lg={2} key={index}>
              <ProductCard Product={product} />
            </Grid>
          ))}
        </Grid>
      );
    } else if (viewMode === "list") {
      return (
        <Grid>
          {products.map((product, index) => (
            <Grid item xs={12} sm={4} md={2} lg={3} key={index}>
              <ProductFlatCard Product={product} />
            </Grid>
          ))}
        </Grid>
      );
    }
  };
  return (
    <>
      <BreadCrumb lastChild={restaurants.partner_name} />
      <HeadTitle title={restaurants.partner_name} />

      <Box
        sx={{
          position: "relative",
          boxShadow: "none",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "300px",
        }}
        mt={2}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8))`,
            zIndex: 1,
            // display: { xs: "none", sm: "none", md: "block" },
          }}
          className="borderRadiusMd"
        />
        <LazyLoadImage
          src={restaurants.partner_profile}
          srcSet={`${restaurants.partner_profile} 2x`}
          loading="lazy"
          effect="blur"
          alt="image"
          width={"100%"}
          height={"300px"}
          className="borderRadiusMd"
        />
        <Box
          sx={{
            position: "absolute",
            zIndex: 1,
            backgroundImage: `url(${restaurants.partner_profile})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            bottom: "8.5%",
            width: "450px",
            height: "250px",
            padding: "0 16px",
            right: "2%",
            display: { xs: "none", sm: "none", md: "block" },
          }}
          className="borderRadiusMd"
        />
        <Box
          className="borderRadiusXs"
          sx={{
            position: "absolute",
            zIndex: 3,
            bgcolor: "var(--toastify-color-error)",
            top: "5%",
            p: 1,
          }}
        >
          {restaurants.is_restro_open == "0" ? (
            <Typography
              variant="body1"
              component="span"
              className="fontWeight800"
            >
              currently closed
            </Typography>
          ) : (
            <Typography
              // startDecorator={<RiTimeLine />}
              variant="body1"
              component="span"
              color={theme.palette.primary}
              sx={{ fontSize: "xl", display: "flex", alignItems: "center" }}
              className="fontWeight800"
            >
              Open Now
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            position: "absolute",
            zIndex: 3,
            bottom: "-30%",
            left: "6%",
            width: "350px",
            height: "250px",
            fontSize: { xs: "xs", sm: "sm", md: "md", lg: "lg", xl: "xl" },
          }}
        >
          <Typography
            className="fontWeight800"
            variant="h4"
            component={"h4"}
            color={theme.palette.text.white}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: { xs: "xs", sm: "sm", md: "md" },
              maxWidth: { xs: "280px", sm: "380px", md: "350px" },
            }}
          >
            {restaurants.partner_name}
          </Typography>

          <Typography color={theme.palette.text.white}>
            {restaurants.partner_address}
          </Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          gap={4}
          sx={{
            position: "absolute",
            zIndex: 2,
            bottom: "8%",
            left: "6%",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            bgcolor={theme.palette.background.cookingTime}
            p={0.5}
            className="borderRadiusMd"
          >
            <TimeFillIcon
              alignmentBaseline="center"
              color={theme.palette.text.black}
            />
            <Typography
              variant="caption"
              component="span"
              sx={{
                fontSize: "sm",
                alignItems: "center",
                justifyContent: "center",
                color: theme.palette.text.black,
                whiteSpace: "nowrap",
              }}
            >
              {restaurants?.partner_cook_time}
            </Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            className="borderRadiusMd"
          >
            <RatingBox partnerRating={restaurants.partner_rating} />
          </Box>
        </Box>
      </Box>

      {/* ///////////////////// */}

      <Box mt={2} display="flex" justifyContent="space-between" flexWrap="wrap">
        <Box
          className="flexProperties"
          flexDirection={{ xs: "column", md: "row" }}
          sx={{ width: { xs: "100%", sm: "auto" }, cursor: "pointer" }}
        >
          <Box
            alignItems="center"
            gap={1}
            mb={1}
            sx={{
              display: { xs: "flex", sm: "none" },
              cursor: "pointer",
              width: { xs: "100%", sm: "auto" },
              justifyContent: { xs: "center", sm: "flex-end" },
            }}
          >
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setOpen(true)}
              startDecorator={<RiEqualizer2Line size={iconSize} />}
              sx={{
                width: "100%",
                fontSize: "xs",
                zIndex: 10,
                maxWidth: "80px",
              }}
            >
              Filters
            </Button>

            <Button
              variant="outlined"
              color="neutral"
              onClick={() => toggleViewMode("grid")}
              startDecorator={<RiGridFill size={iconSize} />}
              sx={{ maxWidth: "80px", fontSize: "xs", zIndex: 10 }}
            >
              Grid
            </Button>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => toggleViewMode("list")}
              startDecorator={<RiListCheck2 size={iconSize} />}
              sx={{ maxWidth: "80px", fontSize: "xs", zIndex: 10 }}
            >
              List
            </Button>
          </Box>

          <Box display="flex">
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setOpen(true)}
              startDecorator={<RiEqualizer2Line size={20} />}
              sx={{
                width: "100%",
                fontSize: "sm",
                zIndex: 10,
                maxWidth: "100px",
                display: { xs: "none", sm: "flex" },
                mr: 1,
              }}
            >
              Filters
            </Button>
            <Input
              value={searchQuery}
              onChange={handleInputChange}
              sx={{ "--Input-focused:": 1, zIndex: 20 }}
              type="search"
              autoFocus={true}
              placeholder="Search"
              startDecorator={<RiSearch2Line />}
            />
          </Box>
        </Box>
        <Box
          alignItems="center"
          gap={1}
          sx={{
            display: { xs: "none", sm: "flex" },
            cursor: "pointer",
            width: { xs: "100%", sm: "auto" },
            justifyContent: { xs: "center", sm: "flex-end" },
          }}
        >
          <Button
            variant="outlined"
            color="neutral"
            onClick={() => toggleViewMode("grid")}
            startDecorator={<RiGridFill />}
          >
            Grid
          </Button>
          <Button
            variant="outlined"
            color="neutral"
            onClick={() => toggleViewMode("list")}
            startDecorator={<RiListCheck2 />}
          >
            List
          </Button>
        </Box>
      </Box>

      {/* Drawer */}
      <Drawer
        size="md"
        variant="soft"
        color="neutral"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Sheet
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              overflowX: "auto",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              backgroundColor: theme.palette.background.popup,
            }}
          >
            <Typography
              className="fontWeight800"
              variant="h6"
              m={2}
              display={"flex"}
              alignItems={"center"}
              gap={1}
            >
              <RiFilter2Line />
              Filters
            </Typography>
            <Divider
              sx={{ color: theme.palette.text.black, minHeight: "0.2rem" }}
            />
            <Box
              m={2}
              className="boxShadow"
              sx={{
                borderRadius: "sm",
                backgroundColor: theme.palette.background.surface,
              }}
              p={2}
            >
              <RadioGroup value={selectedValue} onChange={handleChange}>
                <List
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", lg: "row" },
                  }}
                >
                  {items.map((item) => (
                    <ListItem
                      key={item.value}
                      sx={{
                        boxShadow: "sm",
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: theme.palette.background.surface,
                      }}
                    >
                      <Radio
                        overlay
                        value={item.value}
                        label={item.label}
                        slotProps={{
                          action: ({ checked }) => ({
                            sx: (theme) => ({
                              ...(checked && {
                                inset: 2,
                                border: "2px solid",
                                borderColor: "var(--toastify-color-error)",
                              }),
                            }),
                          }),
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </RadioGroup>
            </Box>
            <Box
              m={2}
              className="boxShadow"
              sx={{
                borderRadius: "sm",
                backgroundColor: theme.palette.background.surface,
              }}
              p={2}
            >
              <Typography
                variant="body1"
                component="div"
                className="fontWeight800"
              >
                Price Range
              </Typography>
              <Slider
                sx={{ marginTop: 2 }}
                min={0}
                max={5000}
                onChange={(e, newValue) => {
                  setPriceRange(newValue);
                  handleRangeChange(e, newValue);
                }}
                // onChange={handleRangeChange}
                variant="solid"
                valueLabelDisplay="on"
                value={priceRange}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 2,
                  gap: 5,
                }}
              >
                <Typography
                  variant="body1"
                  component="div"
                  p={1}
                  color={theme.palette.text.primary}
                  sx={{ display: "flex" }}
                >
                  Min:
                  <Box sx={{ color: theme.palette.text.currency }}>
                    {formatePrice(prefill.min_price)}
                  </Box>
                </Typography>
                <Typography
                  variant="body1"
                  component="div"
                  p={1}
                  color={theme.palette.text.primary}
                  sx={{ display: "flex" }}
                >
                  Max:
                  <Box sx={{ color: theme.palette.text.currency }}>
                    {formatePrice(prefill.max_price)}
                  </Box>
                </Typography>
              </Box>
            </Box>
            <Box
              m={2}
              className="boxShadow"
              p={2}
              sx={{
                borderRadius: "sm",
                backgroundColor: theme.palette.background.surface,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={prefill.top_rated_foods === "1"}
                    onChange={() => {
                      setPrefill((prefill) => ({
                        ...prefill,
                        top_rated_foods:
                          prefill.top_rated_foods === "1" ? "0" : "1",
                      }));
                    }}
                    sx={{ marginRight: 2 }}
                  />
                }
                label="Top Rated"
              />
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              m={2}
              className="boxShadow"
              sx={{
                borderRadius: "sm",
                backgroundColor: theme.palette.background.surface,
              }}
              p={2}
            >
              <Typography
                variant="body1"
                component="div"
                className="fontWeight800"
              >
                Order By
              </Typography>
              <Button
                variant="outlined"
                onClick={handleOrderChange}
                startDecorator={
                  prefill.order === "ASC" ? (
                    <RiArrowDownCircleLine />
                  ) : (
                    <RiArrowUpCircleLine />
                  )
                }
                sx={{
                  maxWidth: "140px",
                }}
              >
                {prefill.order === "ASC" ? "Descending" : "Ascending"}
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 30,
                p: 2,
              }}
            >
              <Button
                color="primary"
                variant="outlined"
                onClick={handleReset}
                sx={{ mr: 2 }}
              >
                Reset
              </Button>
              <Button onClick={handleApplyFilters}>Apply</Button>
            </Box>
          </Box>
        </Sheet>
      </Drawer>

      {/* Categories Tabs */}
      <Box mt={2}>
        <List
          className="fontWeight800"
          sx={{
            display: "flex",
            overflowX: "auto",
            bgcolor: theme.palette.background.bredCrump,
            cursor: "pointer",
            color: theme.palette.text.black,
            height: "60px",
            lineHeight: "30px",
            gap: 2,
          }}
        >
          <ListItem
            onClick={() => handleCategoryChange({ id: null, name: "All" })}
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "200px",
            }}
          >
            {/* <ListItemText primary="All" sx={{ fontWeight: "xl" }} /> */}
            <Checkbox overlay disableIcon variant="soft" label={"All"} />
          </ListItem>
          {categories.map((category) => (
            <ListItem
              key={category.id}
              onClick={() => handleItemClick(category)}
              className="borderRadiusXl"
              sx={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                maxWidth: "300px",
              }}
            >
              <Checkbox
                overlay
                disableIcon
                variant="soft"
                label={category.name}
              />
            </ListItem>
          ))}
        </List>
        <Box>
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            <>
              {products && products?.length !== 0 ? (
                <>
                  <Grid container spacing={2} mt={2}>
                    {products.map((product, index) => (
                      <Grid item xs={12} key={index}>
                        {renderProducts()}
                      </Grid>
                    ))}
                  </Grid>
                </>
              ) : (
                <Box mb={4}>
                  <NotFound />
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Pagination */}
      {products.length !== 0 ? (
        <>
          <Box display="flex" justifyContent="center" mb={2} mt={2}>
            <Pagination
              count={page}
              color="error"
              variant="outlined"
              shape="rounded"
              page={currentPage}
            />
          </Box>
        </>
      ) : null}
    </>
  );
};

export default SpecificRestaurant2;
