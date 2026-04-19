import React from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';

const StatsCard = ({ icon, label, value, hint, accent = '#38bdf8' }) => (
  <Box
    sx={{
      p: 2.4,
      borderRadius: 4,
      border: '1px solid rgba(148,163,184,0.18)',
      background: 'linear-gradient(160deg, rgba(15,23,42,0.84) 0%, rgba(30,41,59,0.74) 100%)',
      boxShadow: '0 24px 55px rgba(2,6,23,0.35)',
      minHeight: 170,
    }}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
      <Box
        sx={{
          width: 54,
          height: 54,
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `${accent}20`,
          color: accent,
        }}
      >
        {icon}
      </Box>
      <Chip
        label={hint}
        size="small"
        sx={{
          backgroundColor: 'rgba(15,23,42,0.68)',
          color: 'rgba(226,232,240,0.78)',
          border: '1px solid rgba(148,163,184,0.18)',
        }}
      />
    </Stack>

    <Typography sx={{ mt: 3.2, color: 'rgba(226,232,240,0.75)', fontSize: '0.95rem' }}>{label}</Typography>
    <Typography sx={{ mt: 0.8, fontSize: { xs: '1.8rem', md: '2.3rem' }, fontWeight: 800 }}>
      {value}
    </Typography>
  </Box>
);

export default StatsCard;
