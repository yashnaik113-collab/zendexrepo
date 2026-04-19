import React from 'react';
import { Box, Button, Chip, Divider, Stack, Typography } from '@mui/material';

const statusPalette = {
  placed: '#38bdf8',
  preparing: '#f97316',
  'out-for-delivery': '#a78bfa',
  delivered: '#34d399',
  cancelled: '#f87171',
};

const transitions = [
  { label: 'Accept Order', value: 'placed' },
  { label: 'Start Cooking', value: 'preparing' },
  { label: 'Ready / Dispatch', value: 'out-for-delivery' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancel', value: 'cancelled' },
];

const OrderCard = ({ order, onUpdate, busy }) => {
  const statusColor = statusPalette[order.orderStatus] || '#94a3b8';

  return (
    <Box
      sx={{
        p: 2.4,
        borderRadius: 4,
        border: '1px solid rgba(148,163,184,0.16)',
        background: 'rgba(15,23,42,0.75)',
        boxShadow: '0 22px 46px rgba(2,6,23,0.32)',
      }}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.02rem' }}>
            Order #{String(order._id).slice(-6)}
          </Typography>
          <Typography sx={{ mt: 0.6, color: 'rgba(226,232,240,0.75)' }}>
            {order.userId?.name || 'Customer'} • {new Date(order.createdAt).toLocaleString('en-IN')}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip
            label={order.paymentStatus}
            sx={{
              backgroundColor: order.paymentStatus === 'success' ? 'rgba(52,211,153,0.15)' : 'rgba(251,191,36,0.15)',
              color: order.paymentStatus === 'success' ? '#6ee7b7' : '#fcd34d',
              textTransform: 'capitalize',
            }}
          />
          <Chip
            label={order.orderStatus}
            sx={{
              backgroundColor: `${statusColor}16`,
              color: statusColor,
              textTransform: 'capitalize',
            }}
          />
        </Stack>
      </Stack>

      <Divider sx={{ my: 2, borderColor: 'rgba(148,163,184,0.12)' }} />

      <Stack spacing={1}>
        {order.items?.map((item) => (
          <Stack key={`${order._id}-${item.foodId}`} direction="row" justifyContent="space-between">
            <Typography sx={{ color: '#f8fafc' }}>
              {item.foodName} x {item.quantity}
            </Typography>
            <Typography sx={{ color: 'rgba(226,232,240,0.8)' }}>Rs {item.price * item.quantity}</Typography>
          </Stack>
        ))}
      </Stack>

      <Typography sx={{ mt: 2, color: 'rgba(226,232,240,0.76)' }}>
        Delivery Address: {order.address}
      </Typography>
      <Typography sx={{ mt: 0.8, color: 'rgba(226,232,240,0.76)' }}>
        Total: Rs {order.totalPrice}
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2.5 }}>
        {transitions.map((transition) => (
          <Button
            key={transition.value}
            size="small"
            disabled={busy || order.orderStatus === transition.value}
            onClick={() => onUpdate(order._id, transition.value)}
            sx={{
              borderRadius: 99,
              px: 1.7,
              color: 'white',
              border: '1px solid rgba(148,163,184,0.18)',
              backgroundColor:
                order.orderStatus === transition.value ? `${statusPalette[transition.value]}20` : 'rgba(30,41,59,0.7)',
            }}
          >
            {transition.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default OrderCard;
