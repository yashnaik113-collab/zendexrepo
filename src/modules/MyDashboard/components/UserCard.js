import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Email, Lock } from '@mui/icons-material';

const UserCard = ({ user }) => {
  return (
    <Card
      sx={{
        bgcolor: '#16213e',
        color: 'white',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(233, 69, 96, 0.3)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: '#e94560',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              fontWeight: 700,
              mr: 2,
            }}
          >
            {user.email.charAt(0).toUpperCase()}
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              User
            </Typography>
            <Chip label="Active" size="small" sx={{ bgcolor: '#4ecca3', color: '#1a1a2e', fontSize: '0.7rem' }} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Email sx={{ fontSize: 18, mr: 1, color: '#e94560' }} />
          <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
            {user.email}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Lock sx={{ fontSize: 18, mr: 1, color: '#e94560' }} />
          <Typography variant="body2" sx={{ letterSpacing: 2 }}>
            {'•'.repeat(8)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserCard;
