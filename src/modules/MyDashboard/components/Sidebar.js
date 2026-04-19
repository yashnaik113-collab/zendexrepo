import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  Typography,
} from '@mui/material';
import {
  DashboardRounded,
  GroupRounded,
  Inventory2Rounded,
  LogoutRounded,
  NotificationsActiveRounded,
  ReceiptLongRounded,
  SettingsRounded,
  StorefrontRounded,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 290;

const navigationItems = [
  { label: 'Dashboard Home', icon: <DashboardRounded />, to: '/dashboard' },
  { label: 'Registered Admins', icon: <GroupRounded />, to: '/dashboard/admins' },
  { label: 'Orders Management', icon: <ReceiptLongRounded />, to: '/dashboard/orders' },
  { label: 'Food Management', icon: <StorefrontRounded />, to: '/dashboard/foods' },
  { label: 'Notifications', icon: <NotificationsActiveRounded />, to: '/dashboard/notifications' },
  { label: 'Settings', icon: <SettingsRounded />, to: '/dashboard/settings' },
];

const SidebarContent = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 2.5,
        color: 'white',
        background:
          'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(15,23,42,0.92) 58%, rgba(30,41,59,0.95) 100%)',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <Avatar sx={{ bgcolor: '#f97316', width: 50, height: 50 }}>
          <Inventory2Rounded />
        </Avatar>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.05rem' }}>Mealsontheway</Typography>
          <Typography sx={{ color: 'rgba(226,232,240,0.7)', fontSize: '0.88rem' }}>
            Chef Dashboard
          </Typography>
        </Box>
      </Stack>

      <Box
        sx={{
          p: 2,
          borderRadius: 4,
          border: '1px solid rgba(148,163,184,0.18)',
          background:
            'linear-gradient(135deg, rgba(249,115,22,0.2) 0%, rgba(14,165,233,0.1) 100%)',
          boxShadow: '0 18px 50px rgba(2,6,23,0.35)',
          mb: 3,
        }}
      >
        <Typography sx={{ fontWeight: 800, mb: 0.5 }}>{user?.name || 'Head Chef'}</Typography>
        <Typography sx={{ fontSize: '0.88rem', color: 'rgba(226,232,240,0.75)' }}>
          {user?.email || 'admin@mealsontheway.com'}
        </Typography>
        <Typography sx={{ fontSize: '0.82rem', color: '#fdba74', mt: 1 }}>
          Live orders, dishes, and customer sync all from one panel.
        </Typography>
      </Box>

      <Stack spacing={1.1} sx={{ flexGrow: 1 }}>
        {navigationItems.map((item) => (
          <Box
            key={item.to}
            component={NavLink}
            to={item.to}
            onClick={onClose}
            sx={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 1.4,
              px: 2,
              py: 1.45,
              borderRadius: 3,
              textDecoration: 'none',
              color: isActive ? 'white' : 'rgba(226,232,240,0.78)',
              background: isActive
                ? 'linear-gradient(135deg, rgba(249,115,22,0.88) 0%, rgba(14,165,233,0.7) 100%)'
                : 'transparent',
              border: isActive ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
              boxShadow: isActive ? '0 18px 30px rgba(15,23,42,0.3)' : 'none',
              transition: 'all 0.25s ease',
              '&:hover': {
                background: isActive
                  ? 'linear-gradient(135deg, rgba(249,115,22,0.9) 0%, rgba(14,165,233,0.74) 100%)'
                  : 'rgba(30,41,59,0.75)',
              },
            })}
          >
            {item.icon}
            <Typography sx={{ fontWeight: 700 }}>{item.label}</Typography>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ borderColor: 'rgba(148,163,184,0.15)', my: 2 }} />

      <Button
        onClick={handleLogout}
        startIcon={<LogoutRounded />}
        sx={{
          justifyContent: 'flex-start',
          color: '#fecaca',
          borderRadius: 3,
          px: 2,
          py: 1.25,
          background: 'rgba(127,29,29,0.35)',
          '&:hover': {
            background: 'rgba(153,27,27,0.48)',
          },
        }}
      >
        Logout
      </Button>
    </Box>
  );
};

const Sidebar = ({ mobileOpen, onClose }) => (
  <>
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: 'block', lg: 'none' },
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          borderRight: '1px solid rgba(148,163,184,0.15)',
          background: 'transparent',
        },
      }}
    >
      <SidebarContent onClose={onClose} />
    </Drawer>

    <Drawer
      variant="permanent"
      open
      sx={{
        display: { xs: 'none', lg: 'block' },
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          borderRight: '1px solid rgba(148,163,184,0.15)',
          background: 'transparent',
        },
      }}
    >
      <SidebarContent />
    </Drawer>
  </>
);

export default Sidebar;
