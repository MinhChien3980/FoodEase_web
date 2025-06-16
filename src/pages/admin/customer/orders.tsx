import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { orderService, Order } from '../../../services/orderService';
import { restaurantService, MenuItem } from '../../../services/restaurantService';
import { ORDER_STATUS } from '../../../constants';
import { useTranslation } from 'react-i18next';
import { RefineListView } from '../../../components';

const UserOrders: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<{ [key: number]: MenuItem }>({});

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;
      try {
        const userOrders = await orderService.getOrdersByUserId(parseInt(userId));
        setOrders(userOrders);

        // Fetch all menu items for the orders
        const menuItemIds = new Set<number>();
        userOrders.forEach(order => {
          order.items.forEach(item => {
            menuItemIds.add(item.menuItemId);
          });
        });

        const menuItemsMap: { [key: number]: MenuItem } = {};
        await Promise.all(
          Array.from(menuItemIds).map(async (id) => {
            try {
              const menuItem = await restaurantService.getMenuItemById(id);
              menuItemsMap[id] = menuItem;
            } catch (error) {
              console.error(`Error fetching menu item ${id}:`, error);
            }
          })
        );
        setMenuItems(menuItemsMap);
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

  const columns: GridColDef<Order>[] = [
    {
      field: 'id',
      headerName: t('admin.customer.orders.table.orderId'),
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: function render({ row }) {
        return `#${row.id}`;
      },
    },
    {
      field: 'createdAt',
      headerName: t('admin.customer.orders.table.date'),
      minWidth: 200,
      align: 'center',
      headerAlign: 'center',
      renderCell: function render({ row }) {
        return new Date(row.createdAt).toLocaleString();
      },
    },
    {
      field: 'totalPrice',
      headerName: t('admin.customer.orders.table.totalPrice'),
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: function render({ row }) {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(row.totalPrice);
      },
    },
    {
      field: 'activeStatus',
      headerName: t('admin.customer.orders.table.status'),
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: function render({ row }) {
        return (
          <Stack direction="row" spacing={1} justifyContent="center">
            <Chip 
              label={row.activeStatus} 
              color={getStatusColor(row.activeStatus) as any}
              size="small"
            />
          </Stack>
        );
      },
    },
    {
      field: 'items',
      headerName: t('admin.customer.orders.table.items'),
      minWidth: 300,
      align: 'center',
      headerAlign: 'center',
      renderCell: function render({ row }) {
        return (
          <Stack spacing={0.5}>
            {row.items.map((item, index) => (
              <Typography key={index} variant="body2">
                {menuItems[item.menuItemId]?.name || `Item ${item.menuItemId}`} x {item.quantity}
              </Typography>
            ))}
          </Stack>
        );
      },
    },
  ];

  return (
    <RefineListView>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          {t('admin.customer.orders.back')}
        </Button>
        <Typography variant="h5">
          {t('admin.customer.orders.title')}
        </Typography>
      </Box>

      <DataGrid
        rows={orders}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 20, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
      />
    </RefineListView>
  );
};

export default UserOrders; 