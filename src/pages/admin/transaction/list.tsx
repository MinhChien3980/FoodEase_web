import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { transactionService, Transaction } from '../../../services/transactionService';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { RefineListView } from '../../../components';
import { useTranslation } from 'react-i18next';

const TransactionList: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await transactionService.getAllTransactions();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return 'success';
      case 'UNPAID':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'userId',
      headerName: t('pages.transaction.fields.userId'),
      width: 100,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'orderId',
      headerName: t('pages.transaction.fields.orderId'),
      width: 100,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'amount',
      headerName: t('pages.transaction.fields.amount'),
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
          <Typography>
            {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
              currency: 'VND',
            }).format(params.value)}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: t('pages.transaction.fields.status'),
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={t(`pages.transaction.status.${params.value.toLowerCase()}`)}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'paymentMethod',
      headerName: t('pages.transaction.fields.paymentMethod'),
      width: 150,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'createdAt',
      headerName: t('pages.transaction.fields.createdAt'),
      width: 180,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
          <Typography>
            {format(new Date(params.value), 'dd/MM/yyyy HH:mm')}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: t('common.actions'),
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <IconButton
          onClick={() => navigate(`/admin/transactions/${params.row.id}/edit`)}
          size="small"
        >
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <RefineListView>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          {t('pages.transaction.title')}
        </Typography>
        <DataGrid
          rows={transactions}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          sx={{
            '& .MuiDataGrid-row': {
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            },
          }}
        />
      </Box>
    </RefineListView>
  );
};

export default TransactionList; 