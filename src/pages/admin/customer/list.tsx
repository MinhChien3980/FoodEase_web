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
} from '@mui/material';
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { userService, User, ProfileResponse } from '../../../services/userService';
import { useTranslation } from 'react-i18next';

const List: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      console.log("11: ",response);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRowClick = (userId: number) => {
    navigate(`/admin/customers/${userId}/orders`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('admin.customer.list.title')}
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('admin.customer.list.fields.email')}</TableCell>
              <TableCell>{t('admin.customer.list.fields.fullName')}</TableCell>
              <TableCell>{t('admin.customer.list.fields.phone')}</TableCell>
              <TableCell>{t('admin.customer.list.fields.role')}</TableCell>
              <TableCell>{t('admin.customer.list.fields.status')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow 
                key={user.id}
                onClick={() => handleRowClick(user.id)}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.login}</TableCell>
                <TableCell>
                  {user.activated ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <CancelIcon color="error" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default List; 