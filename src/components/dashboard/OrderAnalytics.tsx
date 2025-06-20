import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  useTheme,
  Chip,
} from "@mui/material";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Restaurant,
  ShoppingCart,
  AttachMoney,
  People,
} from "@mui/icons-material";
import { formatPrice } from "../../utils/foodHelpers";

interface OrderData {
  date: string;
  orders: number;
  revenue: number;
  avgOrderValue: number;
}

interface RestaurantPerformance {
  name: string;
  orders: number;
  revenue: number;
  rating: number;
}

interface OrderStatus {
  status: string;
  count: number;
  color: string;
}

interface AnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  activeRestaurants: number;
  totalCustomers: number;
  orderGrowth: number;
  revenueGrowth: number;
  orderTrend: OrderData[];
  restaurantPerformance: RestaurantPerformance[];
  orderStatusDistribution: OrderStatus[];
}

interface OrderAnalyticsProps {
  data: AnalyticsData;
  period?: "7d" | "30d" | "90d" | "1y";
}

const OrderAnalytics: React.FC<OrderAnalyticsProps> = ({ data, period = "30d" }) => {
  const theme = useTheme();

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    growth?: number;
    icon: React.ReactNode;
    color?: string;
  }> = ({ title, value, growth, icon, color = theme.palette.primary.main }) => (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor: `${color}15`,
              color: color,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="h3">
            {title}
          </Typography>
        </Box>
        
        <Typography variant="h4" sx={{ mb: 1, fontWeight: "bold" }}>
          {value}
        </Typography>
        
        {growth !== undefined && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {growth >= 0 ? (
              <TrendingUp color="success" fontSize="small" />
            ) : (
              <TrendingDown color="error" fontSize="small" />
            )}
            <Typography
              variant="body2"
              color={growth >= 0 ? "success.main" : "error.main"}
              sx={{ ml: 0.5 }}
            >
              {Math.abs(growth).toFixed(1)}%
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              vs last period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card sx={{ p: 2, maxWidth: 300 }}>
          <Typography variant="subtitle2" gutterBottom>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry.color }}
            >
              {`${entry.dataKey}: ${
                entry.dataKey === "revenue" || entry.dataKey === "avgOrderValue"
                  ? formatPrice(entry.value)
                  : entry.value
              }`}
            </Typography>
          ))}
        </Card>
      );
    }
    return null;
  };

  return (
    <Box>
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={data.totalOrders.toLocaleString()}
            growth={data.orderGrowth}
            icon={<ShoppingCart />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={formatPrice(data.totalRevenue)}
            growth={data.revenueGrowth}
            icon={<AttachMoney />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Restaurants"
            value={data.activeRestaurants}
            icon={<Restaurant />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Customers"
            value={data.totalCustomers.toLocaleString()}
            icon={<People />}
            color={theme.palette.info.main}
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Order Trend */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order & Revenue Trend
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.orderTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="orders"
                      fill={theme.palette.primary.main}
                      name="Orders"
                      opacity={0.8}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stroke={theme.palette.success.main}
                      strokeWidth={3}
                      name="Revenue"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Status Distribution */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Status Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.orderStatusDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ status, count }) => `${status}: ${count}`}
                    >
                      {data.orderStatusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Restaurant Performance */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Performing Restaurants
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.restaurantPerformance.slice(0, 10)}
                    layout="horizontal"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="orders"
                      fill={theme.palette.primary.main}
                      name="Orders"
                    />
                    <Bar
                      dataKey="revenue"
                      fill={theme.palette.success.main}
                      name="Revenue"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Average Order Value Trend */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Order Value Trend
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.orderTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="avgOrderValue"
                      stroke={theme.palette.secondary.main}
                      fill={theme.palette.secondary.light}
                      name="Avg Order Value"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body1">Peak Order Time:</Typography>
                  <Chip label="12:00 PM - 2:00 PM" size="small" />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body1">Avg Delivery Time:</Typography>
                  <Chip label="28 minutes" size="small" color="success" />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body1">Customer Satisfaction:</Typography>
                  <Chip label="4.6/5.0" size="small" color="primary" />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body1">Cancellation Rate:</Typography>
                  <Chip label="3.2%" size="small" color="warning" />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body1">Repeat Customer Rate:</Typography>
                  <Chip label="68%" size="small" color="info" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderAnalytics; 