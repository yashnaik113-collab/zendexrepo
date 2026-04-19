import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, IconButton, Stack, Typography, useMediaQuery } from '@mui/material';
import { MenuOpen, Refresh } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Sidebar from './Sidebar';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);
  const { lastSynced, refreshAll, loading } = useDashboard();
  const { user } = useAuth();

  React.useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(56,189,248,0.14), transparent 24%), radial-gradient(circle at bottom right, rgba(249,115,22,0.14), transparent 24%), linear-gradient(145deg, #020617 0%, #0f172a 55%, #111827 100%)',
        color: 'white',
      }}
    >
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box
        sx={{
          ml: { lg: '290px' },
          minHeight: '100vh',
          px: { xs: 2, md: 4 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{
            mb: 3,
            p: { xs: 2, md: 2.5 },
            borderRadius: 4,
            border: '1px solid rgba(148,163,184,0.18)',
            background: 'rgba(15,23,42,0.66)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 24px 60px rgba(2, 6, 23, 0.34)',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton
              onClick={() => setSidebarOpen((current) => !current)}
              sx={{
                display: { lg: 'none' },
                color: 'white',
                border: '1px solid rgba(148,163,184,0.18)',
              }}
            >
              <MenuOpen />
            </IconButton>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Mealsontheway Chef Command
              </Typography>
              <Typography sx={{ color: 'rgba(226,232,240,0.72)', fontSize: '0.95rem' }}>
                Signed in as {user?.name || 'Admin'} with live menu and order visibility.
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
              <Typography sx={{ fontSize: '0.82rem', color: 'rgba(148,163,184,0.8)' }}>
                Last sync
              </Typography>
              <Typography sx={{ fontWeight: 700, color: '#f8fafc' }}>
                {lastSynced ? lastSynced.toLocaleTimeString('en-IN') : 'Waiting for sync'}
              </Typography>
            </Box>
            <IconButton
              onClick={() => refreshAll({ silent: false })}
              disabled={loading.action}
              sx={{
                color: '#f8fafc',
                border: '1px solid rgba(148,163,184,0.18)',
                background: 'rgba(15,23,42,0.4)',
              }}
            >
              <Refresh />
            </IconButton>
          </Stack>
        </Stack>

        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
