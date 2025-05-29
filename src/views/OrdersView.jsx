import OrderCard from "@/component/Cards/OrderCard";
import OrderCardSkeleton from "@/component/Skeleton/OrderCardSkeleton";
import { get_orders } from "@/interceptor/api";
import { Box, Grid, Tab, TabList, Tabs, Typography, useTheme } from "@mui/joy";
import { useMediaQuery, Pagination } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const OrdersView = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { t } = useTranslation();

  const [selectedTab, setSelectedTab] = useState(0);
  const [activeStatus, setActiveStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  let limit = 3;
  const theme = useTheme();
  const isLargeScreen = useMediaQuery("(min-width:900px)");

  const Orders = async (page, status) => {
    try {
      setIsLoading(true);
      const offset = (page - 1) * limit;
      const response = await get_orders("", limit, offset, status);
      if (!response.error) {
        const totalPages = Math.ceil(parseInt(response.total) / limit);
        setOrders(response.data);
        setTotalPages(totalPages);
        setError(null);
      } else {
        setOrders([]);
        setTotalPages(1);
        setError(response.error);
      }
    } catch (error) {
      console.error(error);
      setOrders([]);
      setTotalPages(1);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeStatus == "all") {
      Orders(currentPage);
    } else {
      Orders(currentPage, activeStatus);
    }

    // eslint-disable-next-line
  }, [currentPage, activeStatus]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  var status = [
    "all",
    "awaiting",
    "pending",
    "preparing",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  const handleStatusChange = (e, value) => {
    setSelectedTab(value);
    setActiveStatus(status[value]);
    setCurrentPage(1); // Reset to first page when status changes
  };

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      width={"100%"}
    >
      <Tabs
        aria-label="tabs"
        orientation="horizontal"
        value={selectedTab}
        onChange={handleStatusChange}
        sx={{
          bgcolor: "transparent",
          width: "100%",
          maxWidth: isLargeScreen ? "fit-content" : "100%",
          overflowX: "auto",
        }}
      >
        <TabList
          aria-label="simple tabs example"
          variant="soft"
          sx={{
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            p: 1,
            gap: 0.5,
            borderRadius: "xl",
            display: "flex",
            flexWrap: "nowrap",
            overflowX: "auto",
            "& .MuiTab-root": {
              flexShrink: 0,
            },
          }}
        >
          {status.map((s, i) => (
            <Tab
              disableIndicator
              key={i}
              sx={{
                color: theme.palette.text.primary,
                border: "0%",
                whiteSpace: "nowrap",
                "&.Mui-selected": {
                  textDecoration: "none",
                  boxShadow: "sm",
                  bgcolor: theme.palette.common.white,
                  color: theme.palette.common.black,
                  fontWeight: "md",
                },
              }}
            >
              {t(s)}
            </Tab>
          ))}
        </TabList>
      </Tabs>

      {isLoading ? (
        <Box sx={{ maxWidth: "750px", width: "100%" }}>
          <OrderCardSkeleton />
        </Box>
      ) : (
        <Box mb={2}>
          {orders.length > 0 ? (
            orders.map((order) => (
              <Box key={order.id} sx={{ maxWidth: "750px", width: "100%" }}>
                <OrderCard key={order.id} order={order} status={status} />
              </Box>
            ))
          ) : (
            <Box mt={2}>
              <Grid
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Image
                  width={350}
                  height={380}
                  src="/assets/images/not-found.gif"
                  alt="notfound"
                />
                <Typography
                  variant="h6"
                  component="h5"
                  level="body-lg"
                  fontSize={20}
                >
                  {t("Nothing Here Yet")}
                </Typography>
              </Grid>
            </Box>
          )}
        </Box>
      )}

      {totalPages > 1 && (
        <Pagination
          variant="outlined"
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          sx={{ mt: 2, mb: 2 }}
        />
      )}
    </Box>
  );
};

export default OrdersView;
