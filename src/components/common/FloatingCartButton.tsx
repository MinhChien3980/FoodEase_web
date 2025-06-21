import React from 'react';
import { Fab, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

export const FloatingCartButton: React.FC = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  if (cart.totalItems === 0) {
    return null;
  }

  return (
    <Fab
      color="primary"
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        backgroundColor: '#ff4757',
        '&:hover': {
          backgroundColor: '#ff3838',
        },
      }}
      onClick={() => navigate('/foodease/cart')}
    >
      <Badge badgeContent={cart.totalItems} color="warning">
        <ShoppingCartIcon sx={{ color: 'white' }} />
      </Badge>
    </Fab>
  );
}; 