import React from 'react';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { AlternateEmailRounded, CalendarMonthRounded, ShieldRounded } from '@mui/icons-material';

const AdminCard = ({ admin }) => {
  const statusColor = admin.status === 'inactive' ? '#f59e0b' : '#34d399';
  const joined = admin.joinDate ? new Date(admin.joinDate).toLocaleDateString('en-IN') : 'Recently';

  return (
    <Box
      sx={{
        p: 2.2,
        borderRadius: 4,
        border: '1px solid rgba(148,163,184,0.16)',
        background: 'rgba(15,23,42,0.72)',
        backdropFilter: 'blur(18px)',
        boxShadow: '0 22px 50px rgba(2,6,23,0.28)',
      }}
    >
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.05rem' }}>{admin.name}</Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, color: 'rgba(226,232,240,0.75)' }}>
            <AlternateEmailRounded sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: '0.9rem' }}>{admin.email}</Typography>
          </Stack>
        </Box>
        <Chip
          label={admin.status || 'active'}
          size="small"
          sx={{
            alignSelf: 'flex-start',
            backgroundColor: `${statusColor}18`,
            color: statusColor,
            border: `1px solid ${statusColor}40`,
            textTransform: 'capitalize',
          }}
        />
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
        <Chip
          icon={<ShieldRounded sx={{ color: '#38bdf8 !important' }} />}
          label={admin.role || 'admin'}
          sx={{ backgroundColor: 'rgba(56,189,248,0.16)', color: '#7dd3fc', textTransform: 'capitalize' }}
        />
        <Chip
          icon={<CalendarMonthRounded sx={{ color: '#fbbf24 !important' }} />}
          label={`Joined ${joined}`}
          sx={{ backgroundColor: 'rgba(251,191,36,0.16)', color: '#fcd34d' }}
        />
      </Stack>

      <Stack direction="row" spacing={1.2} sx={{ mt: 2.5, flexWrap: 'wrap' }}>
        <Button size="small" variant="contained" sx={{ borderRadius: 99, bgcolor: '#0ea5e9' }}>
          View admin
        </Button>
        <Button
          size="small"
          disabled
          sx={{ borderRadius: 99, color: 'rgba(226,232,240,0.54)', border: '1px dashed rgba(148,163,184,0.25)' }}
        >
          Activate / Deactivate
        </Button>
        <Button
          size="small"
          disabled
          sx={{ borderRadius: 99, color: 'rgba(248,113,113,0.65)', border: '1px dashed rgba(248,113,113,0.25)' }}
        >
          Delete
        </Button>
      </Stack>
    </Box>
  );
};

export default AdminCard;
