import React from 'react';
import { Box, Button, Chip, Stack, Switch, Typography } from '@mui/material';

const DishCard = ({ dish, onEdit, onDelete, onToggle, busy }) => (
  <Box
    sx={{
      p: 2.2,
      borderRadius: 4,
      border: '1px solid rgba(148,163,184,0.16)',
      background: 'rgba(15,23,42,0.75)',
      boxShadow: '0 20px 44px rgba(2,6,23,0.3)',
      overflow: 'hidden',
    }}
  >
    {dish.images?.[0] ? (
      <Box
        component="img"
        src={dish.images[0]}
        alt={dish.foodName}
        sx={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 3, mb: 2 }}
      />
    ) : (
      <Box
        sx={{
          height: 180,
          borderRadius: 3,
          mb: 2,
          background:
            'linear-gradient(135deg, rgba(249,115,22,0.18) 0%, rgba(56,189,248,0.18) 100%)',
        }}
      />
    )}

    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: '1.02rem' }}>{dish.foodName}</Typography>
        <Typography sx={{ mt: 0.7, color: 'rgba(226,232,240,0.76)' }}>{dish.description || 'No description yet'}</Typography>
      </Box>
      <Typography sx={{ fontWeight: 800, color: '#f97316' }}>Rs {dish.price}</Typography>
    </Stack>

    <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
      <Chip label={dish.category} sx={{ backgroundColor: 'rgba(56,189,248,0.18)', color: '#7dd3fc' }} />
      <Chip
        label={dish.isAvailable ? 'Available' : 'Out of stock'}
        sx={{
          backgroundColor: dish.isAvailable ? 'rgba(52,211,153,0.18)' : 'rgba(248,113,113,0.18)',
          color: dish.isAvailable ? '#6ee7b7' : '#fca5a5',
        }}
      />
      {(dish.tags || []).slice(0, 2).map((tag) => (
        <Chip key={`${dish._id}-${tag}`} label={tag} sx={{ backgroundColor: 'rgba(148,163,184,0.16)', color: '#cbd5e1' }} />
      ))}
    </Stack>

    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2.2 }}>
      <Typography sx={{ color: 'rgba(226,232,240,0.7)' }}>Live on customer menu</Typography>
      <Switch checked={Boolean(dish.isAvailable)} onChange={(event) => onToggle(dish, event.target.checked)} disabled={busy} />
    </Stack>

    <Stack direction="row" spacing={1.1} sx={{ mt: 1 }}>
      <Button onClick={() => onEdit(dish)} variant="contained" sx={{ borderRadius: 99, bgcolor: '#0ea5e9' }}>
        Edit Dish
      </Button>
      <Button
        onClick={() => onDelete(dish)}
        disabled={busy}
        sx={{ borderRadius: 99, color: '#fda4af', border: '1px solid rgba(244,63,94,0.22)' }}
      >
        Delete
      </Button>
    </Stack>
  </Box>
);

export default DishCard;
