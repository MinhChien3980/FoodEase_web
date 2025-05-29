"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Typography,
  Box,
  ModalDialog,
  ModalClose,
  DialogTitle,
  DialogContent,
  Grid,
  useTheme,
  Autocomplete,
  TextField,
  Input,
} from "@mui/joy";
import { RiArrowLeftLine, RiSearch2Line } from "@remixicon/react";
import debounce from "lodash.debounce";
import SearchBar from "../GlobalSearch/SearchBar";
import { useTranslation } from "react-i18next";
import { get_products } from "@/interceptor/api";
import { useDispatch, useSelector } from "react-redux";
import { closeSearchDrawer } from "../../store/reducers/searchDrawerSlice";
import ProductFlatCard from "../Cards/ProductFlatCard";
import { useRouter } from "next/router";
import NotFound from "@/pages/NotFound";

function SearchModal({ displayType = "icon" }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [darkMode, setDarkMode] = useState();
  const [noProductsFound, setNoProductsFound] = useState(false);

  const theme = useTheme();
  const { t } = useTranslation();
  const isSearchOpen = useSelector((state) => state.searchDrawer.isSearchOpen);

  useEffect(() => {
    setOpen(isSearchOpen);
  }, [isSearchOpen]);

  const inputRef = useRef();
  const timerRef = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSearch = debounce((searchQuery) => {
    const formData = new FormData();
    formData.append("search", searchQuery);
    setNoProductsFound(false);
    get_products(formData)
      .then((res) => {
        setProducts(res.data); // Assuming res.data is an array of products
        if (res.data?.length == 0) {
          setNoProductsFound(true);
        } else {
          setNoProductsFound(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]); // Clear products if there's an error
      });
  }, 250);

  useEffect(() => {
    if (open) {
      setIsFocused(true);
    } else {
      setIsFocused(false);
    }
    setNoProductsFound(false);
  }, [open]);

  useEffect(() => {
    setDarkMode(theme.palette.mode);
  }, [theme.palette.mode]);

  const handleInputChange = (event, newValue) => {
    setSearchQuery(newValue);
    if (newValue.length === 0) {
      setProducts([]);
    } else {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        handleSearch(newValue);
      }, 1000);
    }
  };

  const handleProductSelect = (event, newValue) => {
    if (newValue) {
      router.push(`/products/${newValue}`);
      setOpen(false);
      dispatch(closeSearchDrawer());
    }
  };

  useEffect(() => {
    const handleRouteChange = () => {
      setOpen(false);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events, setOpen]);

  return (
    <Box display={"flex"} sx={{ minWidth: { sm: "100%", md: "18px" } }}>
      {displayType === "icon" ? (
        <RiSearch2Line
          color={darkMode === "dark" ? "white" : "black"}
          className="cursor width40"
          size={"20px"}
          onClick={() => {
            setOpen(true);
            setSearchQuery("");
            setProducts([]);
          }}
        />
      ) : (
        <SearchBar
          onClick={() => {
            setOpen(true);
            setSearchQuery("");
            setProducts([]);
          }}
        />
      )}

      <Modal
        aria-labelledby="product-search-modal-title"
        aria-describedby="product-search-modal-description"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          maxHeight: "100%",
        }}
      >
        <ModalDialog
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          sx={{
            minWidth: { xs: "100%", md: 700 },
            minHeight: { xs: "100%", md: 700 },
          }}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <DialogTitle
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                },
              }}
            >
              {t("search-products")}
            </DialogTitle>

            <Box display={{ xs: "none", md: "flex" }}>
              <ModalClose />
            </Box>
          </Box>
          <DialogContent
            sx={{
              minHeight: { md: 700, xs: "100%" },
              maxWidth: { md: 700, xs: "100%" },
              overflow: "hidden !important",
            }}
          >
            <Autocomplete
              freeSolo
              startDecorator={
                <Box
                  sx={{ display: { xs: "flex" } }}
                  onClick={() => {
                    setOpen(false);
                    dispatch(closeSearchDrawer());
                  }}
                >
                  <RiArrowLeftLine size={20} />
                </Box>
              }
              options={searchQuery ? [] : ["Please enter 1 or more Characters"]}
              getOptionLabel={(option) => option}
              inputValue={searchQuery}
              onInputChange={(event, newValue) =>
                handleInputChange(event, newValue)
              }
              // onChange={handleProductSelect}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={t("search-products")}
                  autoFocus
                  InputProps={{
                    ...params.InputProps,
                  }}
                />
              )}
            />
            {searchQuery && (
              <Typography
                component={"div"}
                // onClick={() => handleProductSelect(null, searchQuery)}
                sx={{
                  marginTop: 2,
                  fontWeight: "var(--joy-fontWeight-xl, 700)",
                }}
              >
                {`Search Result For: ${searchQuery}`}
              </Typography>
            )}
            {products.length > 0 ? (
              <Grid
                container
                gap={{ md: 0, xs: 2 }}
                spacing={{ md: 2, xs: 0 }}
                sx={{ maxHeight: 700, overflow: "auto" }}
              >
                {products.map((item) => (
                  <Grid md={6} xs={12} key={item.id}>
                    <ProductFlatCard Product={item} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <>
                {!noProductsFound && (
                  <Typography
                    display={{ xs: "flex", md: "flex" }}
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={"100%"}
                    textAlign={"center"}
                    fontSize={"lg"}
                    fontWeight={"xl"}
                    textTransform={"none !important"}
                  >
                    {t("search-bar-text")}
                  </Typography>
                )}
              </>
            )}
            <Box>{noProductsFound && <NotFound />}</Box>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </Box>
  );
}

export default SearchModal;
