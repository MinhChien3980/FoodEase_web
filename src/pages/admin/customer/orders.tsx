import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Button,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { orderService, Order } from '../../../services/orderService';
import { ORDER_STATUS } from '../../../constants';
import { useTranslation } from 'react-i18next';

const UserOrders: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;
      try {
        const userOrders = await orderService.getOrdersByUserId(parseInt(userId));
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return 'warning';
      case ORDER_STATUS.CONFIRMED:
        return 'info';
      case ORDER_STATUS.PREPARING:
        return 'primary';
      case ORDER_STATUS.READY:
        return 'success';
      case ORDER_STATUS.COMPLETED:
        return 'success';
      case ORDER_STATUS.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            variant="outlined"
          >
            {t('admin.customer.orders.back')}
          </Button>
          <Typography variant="h4" component="h1">
            {t('admin.customer.orders.title')}
          </Typography>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('admin.customer.orders.table.orderId')}</TableCell>
              <TableCell>{t('admin.customer.orders.table.date')}</TableCell>
              <TableCell>{t('admin.customer.orders.table.totalPrice')}</TableCell>
              <TableCell>{t('admin.customer.orders.table.status')}</TableCell>
              <TableCell>{t('admin.customer.orders.table.items')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                <TableCell>{order.totalPrice.toLocaleString('vi-VN')} ₫</TableCell>
                <TableCell>
                  <Chip 
                    label={order.activeStatus} 
                    color={getStatusColor(order.activeStatus) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {order.items.map((item, index) => (
                    <Typography key={index} variant="body2">
                      {t('admin.customer.orders.table.item')} {item.menuItemId} x {item.quantity}
                    </Typography>
                  ))}
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {t('admin.customer.orders.noOrders')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default UserOrders; 