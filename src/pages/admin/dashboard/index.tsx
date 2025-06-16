import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, Paper, CircularProgress } from "@mui/material";
import { useGetIdentity } from "@refinedev/core";
import { orderService } from "../../../services/orderService";
import { restaurantService } from "../../../services/restaurantService";
import { API_ENDPOINTS } from "../../../config/api";
import apiClient from "../../../services/apiClient";
import { Order } from "../../../services/orderService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DashboardStats {
  totalOrders: number;
  totalRestaurants: number;
  totalCustomers: number;
  recentOrders: Order[];
  orderStatusData: { name: string; value: number }[];
  dailyOrdersData: { date: string; orders: number }[];
  monthlyRevenueData: { month: string; revenue: number }[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export const DashboardPage: React.FC = () => {
  const { data: user } = useGetIdentity<{
    id: string;
    name: string;
    avatar: string;
  }>();

  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRestaurants: 0,
    totalCustomers: 0,
    recentOrders: [],
    orderStatusData: [],
    dailyOrdersData: [],
    monthlyRevenueData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all data in parallel
        const [ordersResponse, restaurantsResponse, usersResponse] = await Promise.all([
          orderService.getAllOrders(),
          restaurantService.getAllRestaurants(),
          apiClient.get(API_ENDPOINTS.USERS.GET_ALL),
        ]);

        // Process orders for charts
        const orderStatusCount = ordersResponse.reduce((acc: { [key: string]: number }, order) => {
          acc[order.activeStatus] = (acc[order.activeStatus] || 0) + 1;
          return acc;
        }, {});

        const orderStatusData = Object.entries(orderStatusCount).map(([name, value]) => ({
          name,
          value,
        }));

        // Process daily orders
        const dailyOrders = ordersResponse.reduce((acc: { [key: string]: number }, order) => {
          const date = new Date(order.createdAt).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        const dailyOrdersData = Object.entries(dailyOrders)
          .map(([date, orders]) => ({ date, orders }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(-7); // Last 7 days

        // Process monthly revenue
        const monthlyRevenue = ordersResponse.reduce((acc: { [key: string]: number }, order) => {
          const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
          acc[month] = (acc[month] || 0) + order.totalPrice;
          return acc;
        }, {});

        const monthlyRevenueData = Object.entries(monthlyRevenue)
          .map(([month, revenue]) => ({ month, revenue }))
          .sort((a, b) => {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return months.indexOf(a.month) - months.indexOf(b.month);
          });

        setStats({
          totalOrders: ordersResponse.length,
          totalRestaurants: restaurantsResponse.length || 0,
          totalCustomers: usersResponse.data.data?.length || 0,
          recentOrders: ordersResponse
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5),
          orderStatusData,
          dailyOrdersData,
          monthlyRevenueData,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

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
            <Typography variant="h4">{stats.totalOrders}</Typography>
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
            <Typography variant="h4">{stats.totalRestaurants}</Typography>
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
            <Typography variant="h4">{stats.totalCustomers}</Typography>
          </Paper>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Daily Orders (Last 7 Days)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.dailyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#8884d8" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Revenue
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  name="Revenue"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <Box key={order.id} sx={{ mb: 2, p: 2, bgcolor: "background.default", borderRadius: 1 }}>
                  <Typography variant="subtitle1">
                    Order #{order.id} - {order.activeStatus}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total: ${order.totalPrice}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">
                No recent orders to display
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
