import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Alert,
} from '@mui/material';
import { Refresh, People, Dashboard } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import UserCard from '../components/UserCard';
import { userService } from '../services/api';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const { showToast, ToastComponent } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await userService.getUsers();
      setUsers(Array.isArray(data) ? data : data.users || []);
      showToast('Users loaded successfully', 'success');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch users';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
    window.location.href = '/login';
  };

  return (
    <Box sx={{ bgcolor: '#0f0f23', minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ p: 3, pt: 10 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
              Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and view all registered users
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchUsers}
              disabled={loading}
              sx={{
                borderColor: '#e94560',
                color: '#e94560',
                '&:hover': { borderColor: '#d63d56', bgcolor: 'rgba(233,69,96,0.1)' },
              }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                bgcolor: '#e94560',
                '&:hover': { bgcolor: '#d63d56' },
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                bgcolor: '#16213e',
                borderRadius: 3,
                borderLeft: '4px solid #e94560',
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: 'rgba(233,69,96,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <People sx={{ color: '#e94560', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                    {loading ? '-' : users.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                bgcolor: '#16213e',
                borderRadius: 3,
                borderLeft: '4px solid #4ecca3',
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: 'rgba(78,204,163,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Dashboard sx={{ color: '#4ecca3', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                    {loading ? '-' : users.length > 0 ? '1' : '0'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Sessions
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'white', mb: 3 }}>
            Registered Users
          </Typography>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#e94560' }} />
            </Box>
          )}

          {error && !loading && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && users.length === 0 && (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              No users found. Be the first to register!
            </Alert>
          )}

          <Grid container spacing={3}>
            {!loading && users.map((user, index) => (
              <Grid item xs={12} sm={6} md={4} key={user._id || user.id || index}>
                <UserCard user={user} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      <ToastComponent />
    </Box>
  );
};

export default DashboardPage;
