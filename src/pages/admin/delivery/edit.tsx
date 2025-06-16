import React, { useEffect, useState } from "react";
import { useGo, useTranslate } from "@refinedev/core";
import { SaveButton } from "@refinedev/mui";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Stack,
  Button,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CancelIcon from '@mui/icons-material/Cancel';
import { deliveryService, Delivery } from "../../../services/deliveryService";
import { orderItemService, OrderItem } from "../../../services/orderItemService";
import { ORDER_STATUS } from "../../../constants";

export const DeliveryEdit = () => {
  const { id } = useParams();
  const go = useGo();
  const t = useTranslate();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        if (id) {
          const data = await deliveryService.getDeliveryById(parseInt(id));
          setDelivery(data);
          setStatus(data.status);
          // Fetch order items
          const items = await orderItemService.getOrderItemsByOrderId(data.orderId);
          setOrderItems(items);
        }
      } catch (error) {
        console.error('Error fetching delivery:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDelivery();
  }, [id]);

  const handleSave = async () => {
    try {
      if (id && status) {
        await deliveryService.updateDeliveryStatus(parseInt(id), status);
        go({ to: "/admin/delivery" });
      }
    } catch (error) {
      console.error('Error updating delivery:', error);
    }
  };

  if (loading) {
    return <Typography>{t("common.loading")}</Typography>;
  }

  if (!delivery) {
    return <Typography>{t("common.error")}</Typography>;
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => go({ to: "/admin/delivery" })}
        >
          {t("delivery.edit.back")}
        </Button>
      </Box>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h6">{t("delivery.edit.title")}</Typography>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t("delivery.edit.orderId")}
              </Typography>
              <Typography variant="body1">#{delivery.orderId}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t("delivery.edit.createdAt")}
              </Typography>
              <Typography variant="body1">
                {new Date(delivery.deliveryTime).toLocaleString()}
              </Typography>
            </Box>

            <FormControl>
              <InputLabel>{t("delivery.edit.status")}</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label={t("delivery.edit.status")}
                sx={{
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    py: 1
                  }
                }}
              >
                <MenuItem value={ORDER_STATUS.PENDING} sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }} >
                    <AccessTimeIcon fontSize="small" />
                  </ListItemIcon>
                  {t("delivery.status.pending")}
                </MenuItem>
                <MenuItem value={ORDER_STATUS.CONFIRMED} sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  {t("delivery.status.confirmed")}
                </MenuItem>
                <MenuItem value={ORDER_STATUS.DELIVERING} sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LocalShippingIcon fontSize="small" />
                  </ListItemIcon>
                  {t("delivery.status.delivering")}
                </MenuItem>
                <MenuItem value={ORDER_STATUS.COMPLETED} sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <DoneAllIcon fontSize="small" />
                  </ListItemIcon>
                  {t("delivery.status.completed")}
                </MenuItem>
                <MenuItem value={ORDER_STATUS.CANCELLED} sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CancelIcon fontSize="small" />
                  </ListItemIcon>
                  {t("delivery.status.cancelled")}
                </MenuItem>
              </Select>
            </FormControl>

            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>{t("delivery.edit.orderItems")}</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("delivery.edit.itemName")}</TableCell>
                      <TableCell align="right">{t("delivery.edit.quantity")}</TableCell>
                      <TableCell align="right">{t("delivery.edit.price")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderItems && orderItems.length > 0 ? (
                      orderItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.menuItemName}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">
                            {item.price ? `$${item.price}` : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          {t("delivery.edit.noItems")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
              >
                {t("delivery.edit.save")}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}; 