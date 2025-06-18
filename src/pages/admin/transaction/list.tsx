import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import { format } from 'date-fns';
import { transactionService, Transaction } from '../../../services/transactionService';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { RefineListView } from '../../../components';

const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await transactionService.getAllTransactions();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        // TODO: Add error handling UI
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

  const columns: GridColDef<Transaction>[] = [
    {
      field: 'userId',
      headerName: 'User ID',
      width: 100,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'orderId',
      headerName: 'Order ID',
      width: 100,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography>
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(params.value)}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value) as any}
          size="small"
        />
      ),
    },
    {
      field: 'paymentMethod',
      headerName: 'Payment Method',
      width: 150,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 180,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography>
          {format(new Date(params.value), 'dd/MM/yyyy HH:mm')}
        </Typography>
      ),
    },
  ];

  return (
    <RefineListView>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Transaction Management
        </Typography>
        <DataGrid
          rows={transactions}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 20, 50, 100]}
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