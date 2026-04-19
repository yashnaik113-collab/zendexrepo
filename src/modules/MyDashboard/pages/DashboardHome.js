import React from 'react';
import { Alert, Box, Grid, Stack, Typography } from '@mui/material';
import {
  AttachMoneyRounded,
  LocalDiningRounded,
  PendingActionsRounded,
  ReceiptLongRounded,
  SupervisorAccountRounded,
} from '@mui/icons-material';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import StatsCard from '../components/StatsCard';
import { useDashboard } from '../context/DashboardContext';

const cardShell = {
  p: 2.5,
  borderRadius: 4,
  border: '1px solid rgba(148,163,184,0.16)',
  background: 'rgba(15,23,42,0.72)',
  boxShadow: '0 24px 50px rgba(2,6,23,0.32)',
};

const COLORS = ['#38bdf8', '#f97316', '#a78bfa', '#34d399', '#f87171'];

const DashboardHome = () => {
  const { stats, foods, orders, admins, error, loading } = useDashboard();

  const dailyOrders = React.useMemo(() => {
    const grouped = orders.reduce((accumulator, order) => {
      const key = new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      accumulator[key] = accumulator[key] || { day: key, orders: 0, revenue: 0 };
      accumulator[key].orders += 1;
      accumulator[key].revenue += Number(order.totalPrice || 0);
      return accumulator;
    }, {});

    return Object.values(grouped).slice(-7);
  }, [orders]);

  const popularDishes = React.useMemo(() => {
    const grouped = orders.reduce((accumulator, order) => {
      order.items?.forEach((item) => {
        accumulator[item.foodName] = (accumulator[item.foodName] || 0) + item.quantity;
      });
      return accumulator;
    }, {});

    return Object.entries(grouped)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((left, right) => right.quantity - left.quantity)
      .slice(0, 5);
  }, [orders]);

  const orderStatusMix = React.useMemo(() => {
    const grouped = orders.reduce((accumulator, order) => {
      accumulator[order.orderStatus] = (accumulator[order.orderStatus] || 0) + 1;
      return accumulator;
    }, {});

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [orders]);

  return (
    <Box>
      {error && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6} lg={4}>
          <StatsCard
            icon={<ReceiptLongRounded />}
            label="Total Orders Today"
            value={stats.totalOrders}
            hint={loading.overview ? 'Syncing' : 'Live'}
            accent="#38bdf8"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <StatsCard
            icon={<AttachMoneyRounded />}
            label="Total Revenue"
            value={`Rs ${stats.totalRevenue}`}
            hint="Payments"
            accent="#34d399"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <StatsCard
            icon={<PendingActionsRounded />}
            label="Pending Orders"
            value={stats.pendingOrders}
            hint="Needs attention"
            accent="#f97316"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <StatsCard
            icon={<LocalDiningRounded />}
            label="Total Dishes"
            value={foods.length}
            hint="Live menu"
            accent="#a78bfa"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <StatsCard
            icon={<SupervisorAccountRounded />}
            label="Total Admins"
            value={admins.length}
            hint="Dashboard team"
            accent="#f43f5e"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        <Grid item xs={12} lg={7}>
          <Box sx={cardShell}>
            <Typography sx={{ fontWeight: 800, mb: 2 }}>Daily Orders & Revenue</Typography>
            <Box sx={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyOrders}>
                  <defs>
                    <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Area type="monotone" dataKey="orders" stroke="#38bdf8" fill="url(#ordersGradient)" />
                  <Area type="monotone" dataKey="revenue" stroke="#34d399" fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Box sx={cardShell}>
            <Typography sx={{ fontWeight: 800, mb: 2 }}>Popular Dishes</Typography>
            <Box sx={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularDishes}>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="quantity" radius={[10, 10, 0, 0]}>
                    {popularDishes.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Box sx={cardShell}>
            <Typography sx={{ fontWeight: 800, mb: 2 }}>Order Status Mix</Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
              <Box sx={{ height: 280, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={orderStatusMix} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95}>
                      {orderStatusMix.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} lg={7}>
          <Box sx={cardShell}>
            <Typography sx={{ fontWeight: 800, mb: 2 }}>Kitchen Overview</Typography>
            <Grid container spacing={2}>
              {[
                ['Successful Payments', stats.successfulPayments, '#34d399'],
                ['Out of Stock Dishes', foods.filter((food) => !food.isAvailable).length, '#f87171'],
                ['Preparing Orders', orders.filter((order) => order.orderStatus === 'preparing').length, '#f97316'],
                ['Delivered Orders', orders.filter((order) => order.orderStatus === 'delivered').length, '#38bdf8'],
              ].map(([label, value, color]) => (
                <Grid item xs={12} md={6} key={label}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: 'rgba(15,23,42,0.5)',
                      borderLeft: `4px solid ${color}`,
                    }}
                  >
                    <Typography sx={{ color: 'rgba(226,232,240,0.72)' }}>{label}</Typography>
                    <Typography sx={{ mt: 1, fontWeight: 800, fontSize: '1.8rem' }}>{value}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;
