import React from "react";
import { Typography, Container, Box } from "@mui/joy";
import { CardMedia } from "@mui/material";

const WebMaintenanceMode = () => {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: "background.default",
        color: "text.primary",
        padding: 2,
      }}
    >
      <CardMedia
        component="img"
        src="/assets/images/Maintance.svg"
        alt="Maintenance"
        sx={{
          width: "100%",
          maxWidth: 400,
          height: "auto",
          marginBottom: 2,
        }}
      />
      <Typography
        variant="plain"
        component="h1"
        sx={{ marginBottom: 1, fontSize: "xl" }}
      >
        We will be back soon!
      </Typography>
      <Typography variant="plain" component="p" sx={{ fontSize: "md" }}>
        We are currently performing some maintenance. Please check back later.
      </Typography>
    </Container>
  );
};

export default WebMaintenanceMode;
