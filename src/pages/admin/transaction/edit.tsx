import React, { useEffect, useState } from "react";
import { useGo, useTranslate } from "@refinedev/core";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { transactionService, Transaction } from "../../../services/transactionService";

export const TransactionEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = useTranslate();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        // Check for admin token
        const adminToken = sessionStorage.getItem('admin_token');
        if (!adminToken) {
          setError('Unauthorized access. Please login as admin.');
          setLoading(false);
          return;
        }

        if (id) {
          const data = await transactionService.getTransactionById(Number(id));
          setTransaction(data);
          setStatus(data.status);
          setValue("status", data.status);
          setError(null);
        }
      } catch (error) {
        console.error('Error fetching transaction:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch transaction');
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id, setValue]);

  const handleSave = async () => {
    try {
      if (id && status && transaction) {
        await transactionService.updateTransaction(Number(id), {
          id: transaction.id,
          userId: transaction.userId,
          orderId: transaction.orderId,
          amount: transaction.amount,
          status: status,
          paymentMethod: transaction.paymentMethod
        });
        navigate('/admin/transactions');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      setError(error instanceof Error ? error.message : 'Failed to update transaction');
    }
  };

  if (loading) {
    return <Typography>{t('common.loading')}</Typography>;
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/transactions')}
          sx={{ mt: 2 }}
        >
          {t('transaction.edit.back')}
        </Button>
      </Box>
    );
  }

  if (!transaction) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Transaction not found</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/transactions')}
          sx={{ mt: 2 }}
        >
          {t('transaction.edit.back')}
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/transactions')}
        >
          {t('transaction.edit.back')}
        </Button>
      </Box>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h6">{t('transaction.edit.title')}</Typography>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t('transaction.edit.orderId')}
              </Typography>
              <Typography variant="body1">#{transaction.orderId}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t('transaction.edit.amount')}
              </Typography>
              <Typography variant="body1">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(transaction.amount)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t('transaction.edit.paymentMethod')}
              </Typography>
              <Typography variant="body1">{transaction.paymentMethod}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t('transaction.edit.createdAt')}
              </Typography>
              <Typography variant="body1">
                {new Date(transaction.createdAt).toLocaleString()}
              </Typography>
            </Box>

            <FormControl fullWidth>
              <InputLabel>{t('transaction.edit.status')}</InputLabel>
              <Select
                value={status}
                label={t('transaction.edit.status')}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="PAID">{t('transaction.status.paid')}</MenuItem>
                <MenuItem value="UNPAID">{t('transaction.status.unpaid')}</MenuItem>
              </Select>
            </FormControl>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
              >
                {t('transaction.edit.save')}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TransactionEdit; 