import React from 'react';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { useDashboard } from '../context/DashboardContext';

const NotificationsPage = () => {
  const { notifications, markNotificationRead, clearNotifications } = useDashboard();

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Notifications
          </Typography>
          <Typography sx={{ color: 'rgba(226,232,240,0.72)' }}>
            New orders, status changes, registrations, and stock alerts all appear here.
          </Typography>
        </Box>
        <Button onClick={clearNotifications} sx={{ borderRadius: 99, color: '#fca5a5', border: '1px solid rgba(244,63,94,0.2)' }}>
          Clear all
        </Button>
      </Stack>

      <Stack spacing={2}>
        {notifications.map((notification) => (
          <Box
            key={notification.id}
            sx={{
              p: 2.2,
              borderRadius: 4,
              border: '1px solid rgba(148,163,184,0.16)',
              background: notification.read ? 'rgba(15,23,42,0.55)' : 'rgba(15,23,42,0.78)',
            }}
          >
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
              <Box>
                <Typography sx={{ fontWeight: 800 }}>{notification.title}</Typography>
                <Typography sx={{ mt: 0.6, color: 'rgba(226,232,240,0.74)' }}>{notification.description}</Typography>
                <Typography sx={{ mt: 0.8, fontSize: '0.82rem', color: 'rgba(148,163,184,0.82)' }}>
                  {new Date(notification.createdAt).toLocaleString('en-IN')}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                {!notification.read && <Chip label="New" sx={{ backgroundColor: 'rgba(249,115,22,0.18)', color: '#fdba74' }} />}
                <Button onClick={() => markNotificationRead(notification.id)} sx={{ borderRadius: 99, color: '#7dd3fc' }}>
                  Mark read
                </Button>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default NotificationsPage;
