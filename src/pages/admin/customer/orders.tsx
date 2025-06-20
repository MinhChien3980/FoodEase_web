import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  useTheme,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { orange, cyan, blue, green, red } from '@mui/material/colors';
import { orderService, Order } from '../../../services/orderService';
import { restaurantService, MenuItem } from '../../../services/restaurantService';
import { ORDER_STATUS } from '../../../constants';
import { useTranslation } from 'react-i18next';
import { RefineListView } from '../../../components';

const OrderStatusChip = ({ status }: { status: string }) => {
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
      icon = <DoneAllIcon />;
      break;
    case ORDER_STATUS.CANCELLED:
      color = isDarkMode ? red[200] : red[800];
      icon = <CancelIcon />;
      break;
    default:
      color = isDarkMode ? orange[200] : orange[800];
      icon = <AccessTimeIcon />;
  }

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        border: `1px solid ${color}`,
        borderRadius: '16px',
        padding: '0 7px 0 2px',
        color: color,
        fontSize: '0.8125rem',
        height: '24px',
        gap: '4px',
        backgroundColor: 'white'
      }}
    >
      {icon}
      <Typography
        component="span"
        sx={{
          color: color,
          fontSize: 'inherit',
          lineHeight: 1,
          fontWeight: 500
        }}
      >
        {status}
      </Typography>
    </Box>
  );
};

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
        return <OrderStatusChip status={row.activeStatus} />;
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
          sorting: {
            sortModel: [{ field: 'id', sort: 'desc' }],
          },
        }}
      />
    </RefineListView>
  );
};

export default UserOrders; 