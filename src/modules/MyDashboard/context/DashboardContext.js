import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  adminDirectoryService,
  dashboardService,
  foodService,
  orderService,
} from '../services/api';
import { notificationStorage, settingsStorage } from '../services/storage';
import { useAuth } from './AuthContext';

const DashboardContext = createContext(null);

const buildNotification = ({ type, title, description, entityId }) => ({
  id: `${type}-${entityId || Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  type,
  title,
  description,
  entityId,
  createdAt: new Date().toISOString(),
  read: false,
});

const formatOrderStatusLabel = (status) =>
  ({
    placed: 'Placed',
    preparing: 'Being prepared',
    'out-for-delivery': 'Out for delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  }[status] || status);

export const DashboardProvider = ({ children }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    successfulPayments: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalDishes: 0,
    totalAdmins: 0,
  });
  const [admins, setAdmins] = useState([]);
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [notifications, setNotifications] = useState(notificationStorage.get());
  const [settings, setSettings] = useState(settingsStorage.get());
  const [lastSynced, setLastSynced] = useState(null);
  const [loading, setLoading] = useState({
    overview: true,
    admins: true,
    orders: true,
    foods: true,
    action: false,
  });
  const [error, setError] = useState('');
  const previousOrdersRef = useRef([]);
  const previousFoodsRef = useRef([]);
  const previousAdminsRef = useRef([]);

  const appendNotification = useCallback((notification) => {
    setNotifications((current) => notificationStorage.push(notification));
  }, []);

  const detectChanges = useCallback(
    ({ nextOrders, nextFoods, nextAdmins }) => {
      const previousOrders = previousOrdersRef.current;
      const previousFoods = previousFoodsRef.current;
      const previousAdmins = previousAdminsRef.current;

      if (previousOrders.length) {
        nextOrders.forEach((order) => {
          const previousOrder = previousOrders.find((item) => item._id === order._id);
          if (!previousOrder) {
            appendNotification(
              buildNotification({
                type: 'order',
                title: 'New order received',
                description: `Order ${String(order._id).slice(-6)} arrived from ${
                  order.userId?.name || 'a customer'
                }.`,
                entityId: order._id,
              })
            );
            return;
          }

          if (previousOrder.orderStatus !== order.orderStatus) {
            appendNotification(
              buildNotification({
                type: 'status',
                title: 'Order updated',
                description: `Order ${String(order._id).slice(-6)} is now ${formatOrderStatusLabel(
                  order.orderStatus
                )}.`,
                entityId: order._id,
              })
            );
          }

          if (previousOrder.paymentStatus !== order.paymentStatus && order.paymentStatus === 'success') {
            appendNotification(
              buildNotification({
                type: 'payment',
                title: 'Payment confirmed',
                description: `Order ${String(order._id).slice(-6)} was paid successfully.`,
                entityId: order._id,
              })
            );
          }
        });
      }

      if (previousFoods.length) {
        nextFoods.forEach((food) => {
          const previousFood = previousFoods.find((item) => item._id === food._id);
          if (!previousFood) {
            appendNotification(
              buildNotification({
                type: 'dish',
                title: 'New dish added',
                description: `${food.foodName} is now live on the menu.`,
                entityId: food._id,
              })
            );
            return;
          }

          if (previousFood.isAvailable && !food.isAvailable) {
            appendNotification(
              buildNotification({
                type: 'stock',
                title: 'Dish marked out of stock',
                description: `${food.foodName} is unavailable for customers right now.`,
                entityId: food._id,
              })
            );
          }
        });
      }

      if (previousAdmins.length && nextAdmins.length > previousAdmins.length) {
        const newest = nextAdmins[0];
        appendNotification(
          buildNotification({
            type: 'admin',
            title: 'New admin registered',
            description: `${newest.name} joined the dashboard team.`,
            entityId: newest.email,
          })
        );
      }

      previousOrdersRef.current = nextOrders;
      previousFoodsRef.current = nextFoods;
      previousAdminsRef.current = nextAdmins;
    },
    [appendNotification]
  );

  const refreshAll = useCallback(
    async ({ silent = false } = {}) => {
      if (!user) {
        return;
      }

      if (!silent) {
        setLoading((current) => ({ ...current, overview: true, admins: true, orders: true, foods: true }));
      }

      setError('');

      try {
        const [statsPayload, nextOrders, nextFoods, nextAdmins] = await Promise.all([
          dashboardService.getStats(),
          orderService.getOrders(),
          foodService.getFoods(),
          adminDirectoryService.getRegisteredAdmins(user),
        ]);

        setStats({
          totalOrders: statsPayload.totalOrders,
          successfulPayments: statsPayload.successfulPayments,
          pendingOrders: statsPayload.pendingOrders,
          totalRevenue: statsPayload.totalRevenue,
          totalDishes: nextFoods.length,
          totalAdmins: nextAdmins.length,
        });
        setOrders(nextOrders);
        setFoods(nextFoods);
        setAdmins(nextAdmins);
        setLastSynced(new Date());
        detectChanges({ nextOrders, nextFoods, nextAdmins });
      } catch (err) {
        setError(err.message || 'Unable to load dashboard data');
      } finally {
        setLoading((current) => ({ ...current, overview: false, admins: false, orders: false, foods: false }));
      }
    },
    [detectChanges, user]
  );

  useEffect(() => {
    refreshAll({ silent: false });
  }, [refreshAll]);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      refreshAll({ silent: true });
    }, settings.refreshInterval);

    return () => window.clearInterval(interval);
  }, [refreshAll, settings.refreshInterval, user]);

  const runAction = useCallback(async (action) => {
    setLoading((current) => ({ ...current, action: true }));
    setError('');
    try {
      const result = await action();
      await refreshAll({ silent: true });
      return result;
    } catch (err) {
      setError(err.message || 'Action failed');
      throw err;
    } finally {
      setLoading((current) => ({ ...current, action: false }));
    }
  }, [refreshAll]);

  const updateOrderStatus = useCallback(
    async (orderId, status) =>
      runAction(async () => {
        const updated = await orderService.updateOrderStatus(orderId, status);
        appendNotification(
          buildNotification({
            type: 'status',
            title: 'Order status changed',
            description: `Order ${String(orderId).slice(-6)} moved to ${formatOrderStatusLabel(status)}.`,
            entityId: orderId,
          })
        );
        return updated;
      }),
    [appendNotification, runAction]
  );

  const createDish = useCallback(
    async (payload) =>
      runAction(async () => {
        const created = await foodService.createFood(payload);
        appendNotification(
          buildNotification({
            type: 'dish',
            title: 'Dish published',
            description: `${payload.dishName} was added to the live customer menu.`,
            entityId: created?._id || payload.dishName,
          })
        );
        return created;
      }),
    [appendNotification, runAction]
  );

  const updateDish = useCallback(
    async (foodId, payload) =>
      runAction(async () => {
        const updated = await foodService.updateFood(foodId, payload);
        appendNotification(
          buildNotification({
            type: 'dish',
            title: 'Dish updated',
            description: `${payload.dishName} was updated on the customer menu.`,
            entityId: foodId,
          })
        );
        return updated;
      }),
    [appendNotification, runAction]
  );

  const deleteDish = useCallback(
    async (foodId, foodName) =>
      runAction(async () => {
        await foodService.deleteFood(foodId);
        appendNotification(
          buildNotification({
            type: 'dish',
            title: 'Dish removed',
            description: `${foodName} was removed from the live menu.`,
            entityId: foodId,
          })
        );
      }),
    [appendNotification, runAction]
  );

  const toggleDishAvailability = useCallback(
    async (foodId, isAvailable, foodName) =>
      runAction(async () => {
        const updated = await foodService.toggleAvailability(foodId, isAvailable);
        appendNotification(
          buildNotification({
            type: 'stock',
            title: isAvailable ? 'Dish back in stock' : 'Dish out of stock',
            description: `${foodName} is now ${isAvailable ? 'available' : 'unavailable'} for customers.`,
            entityId: foodId,
          })
        );
        return updated;
      }),
    [appendNotification, runAction]
  );

  const markNotificationRead = useCallback((id) => {
    setNotifications((current) => {
      const next = current.map((item) => (item.id === id ? { ...item, read: true } : item));
      notificationStorage.set(next);
      return next;
    });
  }, []);

  const clearNotifications = useCallback(() => {
    notificationStorage.clear();
    setNotifications([]);
  }, []);

  const updateSettings = useCallback((partialSettings) => {
    const next = settingsStorage.update(partialSettings);
    setSettings(next);
  }, []);

  const value = useMemo(
    () => ({
      stats,
      admins,
      orders,
      foods,
      notifications,
      settings,
      loading,
      error,
      lastSynced,
      refreshAll,
      updateOrderStatus,
      createDish,
      updateDish,
      deleteDish,
      toggleDishAvailability,
      markNotificationRead,
      clearNotifications,
      updateSettings,
    }),
    [
      admins,
      clearNotifications,
      createDish,
      deleteDish,
      error,
      foods,
      lastSynced,
      loading,
      markNotificationRead,
      notifications,
      orders,
      refreshAll,
      settings,
      stats,
      toggleDishAvailability,
      updateDish,
      updateOrderStatus,
      updateSettings,
    ]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};
