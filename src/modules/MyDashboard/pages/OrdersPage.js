import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import OrderCard from '../components/OrderCard';
import { useDashboard } from '../context/DashboardContext';
import { useToast } from '../components/Toast';

const OrdersPage = () => {
  const { orders, updateOrderStatus, loading } = useDashboard();
  const { showToast, ToastComponent } = useToast();

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      showToast(`Order moved to ${status}`, 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Orders Management
      </Typography>
      <Typography sx={{ color: 'rgba(226,232,240,0.72)', mb: 3 }}>
        Update order progress here and the latest backend status becomes visible on the customer side.
      </Typography>

      <Grid container spacing={2.5}>
        {orders.map((order) => (
          <Grid item xs={12} xl={6} key={order._id}>
            <OrderCard order={order} onUpdate={handleUpdateStatus} busy={loading.action} />
          </Grid>
        ))}
      </Grid>
      <ToastComponent />
    </Box>
  );
};

export default OrdersPage;
