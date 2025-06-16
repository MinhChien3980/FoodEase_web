import React, { useEffect, useState } from "react";
import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { CreateButton, EditButton, useDataGrid, DeleteButton } from "@refinedev/mui";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Typography,
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
import { RefineListView } from "../../../components";

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
  const { createUrl } = useNavigation();
  const t = useTranslate();
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

  const columns: GridColDef<Delivery>[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      align: "center",
      headerAlign: "center",
      renderCell: function render({ row }) {
        return (
          <Typography sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            width: '100%'
          }}>
            #{row.id}
          </Typography>
        );
      },
    },
    {
      field: "orderId",
      headerName: "Order ID",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: function render({ row }) {
        return (
          <Typography sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            width: '100%'
          }}>
            #{row.orderId}
          </Typography>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: function render({ row }) {
        return <DeliveryStatusChip status={row.status} />;
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: function render({ row }) {
        return (
          <Typography sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            width: '100%'
          }}>
            {new Date(row.createdAt).toLocaleString()}
          </Typography>
        );
      },
    },
    {
      field: "actions",
      headerName: t("table.actions"),
      type: "actions",
      align: "center",
      headerAlign: "center",
      renderCell: function render({ row }) {
        return (
          <Stack direction="row" spacing={1}>
            <EditButton
              hideText
              recordItemId={row.id}
              svgIconProps={{
                color: "action",
              }}
            />
          </Stack>
        );
      },
    },
  ];

  return (
    <RefineListView>
      <DataGrid
        rows={deliveries}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 20, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        onRowClick={(params) => {
          go({
            to: `/admin/delivery/${params.row.id}/edit`,
            type: "replace",
          });
        }}
        sx={{
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          },
        }}
      />
    </RefineListView>
  );
}; 