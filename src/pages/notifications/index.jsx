import BreadCrumb from "@/component/BreadCrumps/BreadCrumb";
import { HeadTitle } from "@/component/HeadTitle";
import { get_notifications } from "@/interceptor/api";
import { Box } from "@mui/joy";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import NotificationsView from "@/views/NotificationsView";
import Pagination from "@mui/material/Pagination"; // Import pagination component from MUI

const UserLayout = dynamic(() => import("../user/UserLayout"), {
  ssr: false,
});

const Notification = () => {
  const [notification, setNotification] = useState([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [total, setTotalCount] = useState(0);

  useEffect(() => {
    fetchData(limit, offset);
  }, [limit, offset]);

  const fetchData = async (limit, offset) => {
    const response = await get_notifications({ limit, offset });
    if (response.error) {
      toast.error(response.message);
    } else {
      setNotification(response.data);
      setTotalCount(response.total);
    }
  };

  const handlePageChange = (event, value) => {
    setOffset((value - 1) * limit);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "80vh",
        width: "100%",
      }}
    >
      <HeadTitle title={"Notifications"} />
      <BreadCrumb />

      <UserLayout>
        <Box
          mt={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            flexGrow: 1, // Allow this box to grow and take available space
            justifyContent: "space-between",
          }}
        >
          <NotificationsView
            notification={notification}
            fetchData={fetchData}
            limit={limit}
            offset={offset}
          />
        </Box>

        <Box
          display="flex"
          justifyContent="center"
          mt={2}
          sx={{
            width: "100%",
            height: "auto", // Adjusted for better alignment
            paddingBottom: 2, // Optional: Add padding to the bottom
          }}
        >
          <Pagination
            variant="outlined"
            count={Math.ceil(total / limit)}
            page={offset / limit + 1}
            onChange={handlePageChange}
            sx={{
              display: "flex",
              alignItems: "end",
              justifyContent: "center",
              width: "100%",
            }}
          />
        </Box>
      </UserLayout>

      {/* Pagination Component */}
    </Box>
  );
};

export default Notification;
