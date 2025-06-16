import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { Container, Typography, Box, Stack } from '@mui/material';
import { userService, User } from '../../../services/userService';
import { RefineListView } from '../../../components';

const List: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns: GridColDef<User>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      align: 'center',
      headerAlign: 'center',
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
      field: 'email',
      headerName: t('admin.customer.list.fields.email'),
      minWidth: 200,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'fullName',
      headerName: t('admin.customer.list.fields.fullName'),
      minWidth: 200,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'phone',
      headerName: t('admin.customer.list.fields.phone'),
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'login',
      headerName: t('admin.customer.list.fields.role'),
      width: 120,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'activated',
      headerName: t('admin.customer.list.fields.status'),
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: function render({ row }) {
        return (
          <Stack direction="row" spacing={1} justifyContent="center">
            {row.activated ? (
              <CheckCircleIcon color="success" />
            ) : (
              <CancelIcon color="error" />
            )}
          </Stack>
        );
      },
    },
  ];

  return (
    <RefineListView>
      <DataGrid
        rows={users}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 20, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        onRowClick={(params) => {
          navigate(`/admin/customers/${params.row.id}/orders`);
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

export default List; 