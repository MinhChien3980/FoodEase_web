import React from "react";
import { Typography, Box, Grid, Paper } from "@mui/material";
import { useGetIdentity } from "@refinedev/core";

export const DashboardPage: React.FC = () => {
  const { data: user } = useGetIdentity<{
    id: string;
    name: string;
    avatar: string;
  }>();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Welcome back, {user?.name || "Admin"}!
      </Typography>

      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: 140,
            }}
          >
            <Typography color="text.secondary" gutterBottom>
              Total Orders
            </Typography>
            <Typography variant="h4">0</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: 140,
            }}
          >
            <Typography color="text.secondary" gutterBottom>
              Total Restaurants
            </Typography>
            <Typography variant="h4">0</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: 140,
            }}
          >
            <Typography color="text.secondary" gutterBottom>
              Total Customers
            </Typography>
            <Typography variant="h4">0</Typography>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography color="text.secondary">
              No recent activity to display
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
