import React, { useEffect, useState } from "react";
import { useGo } from "@refinedev/core";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  useTheme,
} from "@mui/material";
import { deliveryService, Delivery } from "../../../services/deliveryService";
import { ORDER_STATUS } from "../../../constants";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CancelIcon from '@mui/icons-material/Cancel';
import { orange, cyan, blue, green, red } from '@mui/material/colors';

const DeliveryStatusChip = ({ status }: { status: string }) => {
  const { palette } = useTheme();
  const isDarkMode = palette.mode === "dark";

  let color = "";
  let icon: React.ReactElement;

  switch (status.toUpperCase()) {
    case ORDER_STATUS.PENDING:
      color = isDarkMode ? orange[200] : orange[800];
      icon = <AccessTimeIcon />;
      break;
    case ORDER_STATUS.CONFIRMED:
      color = isDarkMode ? cyan[200] : cyan[800];
      icon = <CheckCircleIcon />;
      break;
    case ORDER_STATUS.DELIVERING:
      color = isDarkMode ? blue[200] : blue[800];
      icon = <LocalShippingIcon />;
      break;
    case ORDER_STATUS.COMPLETED:
      color = isDarkMode ? green[200] : green[800];
      icon = <CheckCircleIcon />;
      break;
    case ORDER_STATUS.CANCELLED:
      color = isDarkMode ? red[200] : red[800];
      icon = <AccessTimeIcon />;
      break;
    default:
      color = isDarkMode ? orange[200] : orange[800];
      icon = <AccessTimeIcon />;
  }

  return (
    <Chip
      icon={icon}
      label={status}
      size="small"
      variant="outlined"
      sx={{
        borderColor: color,
        color: color,
        '& .MuiChip-icon': {
          color: color,
        },
      }}
    />
  );
};

export const DeliveryList = () => {
  const go = useGo();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    try {
      const data = await deliveryService.getAllDeliveries();
      setDeliveries(data);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Delivery Management
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deliveries.map((delivery) => (
                  <TableRow
                    key={delivery.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => go({ to: `/admin/delivery/${delivery.id}/edit` })}
                  >
                    <TableCell>{delivery.id}</TableCell>
                    <TableCell>#{delivery.orderId}</TableCell>
                    <TableCell>
                      <DeliveryStatusChip status={delivery.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(delivery.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}; 