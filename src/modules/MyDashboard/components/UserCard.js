import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { CalendarMonth, Email, Person } from '@mui/icons-material';

const UserCard = ({ user }) => {
  const createdAtDate = user.createdAt ? new Date(user.createdAt) : null;
  const isNewlyRegistered = createdAtDate
    ? Date.now() - createdAtDate.getTime() <= 24 * 60 * 60 * 1000
    : false;
  const createdDate = user.createdAt
    ? createdAtDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Just now';

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
            {(user.name || user.email).charAt(0).toUpperCase()}
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {user.name || 'Zendex User'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
              <Chip
                label="Active"
                size="small"
                sx={{ bgcolor: '#4ecca3', color: '#1a1a2e', fontSize: '0.7rem' }}
              />
              {isNewlyRegistered && (
                <Chip
                  label="Newly Registered"
                  size="small"
                  sx={{ bgcolor: '#facc15', color: '#1a1a2e', fontSize: '0.7rem', fontWeight: 700 }}
                />
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Person sx={{ fontSize: 18, mr: 1, color: '#e94560' }} />
          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
            {user.name || 'No name provided'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Email sx={{ fontSize: 18, mr: 1, color: '#e94560' }} />
          <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
            {user.email}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarMonth sx={{ fontSize: 18, mr: 1, color: '#e94560' }} />
          <Typography variant="body2">Added {createdDate}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserCard;
