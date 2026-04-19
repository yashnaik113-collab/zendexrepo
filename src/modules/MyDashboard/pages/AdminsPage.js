import React from 'react';
import { Alert, Box, Grid, Typography } from '@mui/material';
import AdminCard from '../components/AdminCard';
import { useDashboard } from '../context/DashboardContext';

const AdminsPage = () => {
  const { admins } = useDashboard();

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Registered Admins
      </Typography>
      <Typography sx={{ color: 'rgba(226,232,240,0.72)', mb: 3 }}>
        This panel shows current dashboard admins and available registration records from the existing APIs.
      </Typography>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>
        View is live. Delete and activate/deactivate controls are displayed, but your current backend does not expose those admin management endpoints yet.
      </Alert>

      <Box 
        sx={{ 
          height: 'calc(100vh - 250px)', 
          overflowY: 'auto', 
          pr: 1,
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: '10px' },
          '&::-webkit-scrollbar-thumb:hover': { background: 'rgba(255,255,255,0.2)' }
        }}
      >
        <Grid container spacing={2.5}>
          {admins.map((admin) => (
            <Grid item xs={12} md={6} xl={4} key={admin.email}>
              <AdminCard admin={admin} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminsPage;
