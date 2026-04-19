import axios from 'axios';
import {
  adminCacheStorage,
  clearDashboardSession,
  tokenStorage,
  userStorage,
} from './storage';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const createDisplayName = (email = '') =>
  (email.split('@')[0] || 'chef admin')
    .split(/[._-]+/)
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
});

const createRequestError = (error) => {
  if (!error.response) {
    return new Error(
      'MealsOnTheWay backend is not reachable. Please make sure the backend server is running on port 5000.'
    );
  }

  return new Error(error.response?.data?.message || 'Request failed');
};

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearDashboardSession();
    }
    return Promise.reject(createRequestError(error));
  }
);

const mapAdminUser = (user) => ({
  id: user?.id || user?._id || user?.email,
  name: user?.name || createDisplayName(user?.email),
  email: user?.email || '',
  role: user?.role || 'admin',
  status: user?.status || 'active',
  createdAt: user?.createdAt || new Date().toISOString(),
  joinDate: user?.joinDate || user?.createdAt || new Date().toISOString(),
});

const saveSession = (token, user) => {
  tokenStorage.set(token);
  userStorage.set(user);
  adminCacheStorage.upsert(mapAdminUser(user));
};

const toDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });

export const authService = {
  async login(email, password) {
    const response = await api.post('/admin/login', {
      email: email.trim(),
      password,
    });
    const token = response.data.accessToken;
    tokenStorage.set(token);
    const current = await authService.getCurrentAdmin();
    saveSession(token, current);
    return { token, user: current };
  },

  async register(name, email, password) {
    await api.post('/admin/register', {
      name: name.trim(),
      email: email.trim(),
      password,
    });
    const result = await authService.login(email, password);
    const user = { ...result.user, name: name.trim() };
    saveSession(result.token, user);
    return { ...result, user };
  },

  async getCurrentAdmin() {
    const { data } = await api.get('/admin/current');
    return mapAdminUser(data);
  },

  getStoredAdmin() {
    return userStorage.get();
  },

  isAuthenticated() {
    return Boolean(tokenStorage.get());
  },

  logout() {
    clearDashboardSession();
  },
};

export const dashboardService = {
  async getStats() {
    const [{ data: statsResponse }, { data: foodsResponse }, { data: ordersResponse }] = await Promise.all([
      api.get('/admin/dashboard'),
      api.get('/foods'),
      api.get('/admin/orders'),
    ]);

    const foods = Array.isArray(foodsResponse) ? foodsResponse : [];
    const orders = ordersResponse?.data || [];

    return {
      totalOrders: statsResponse?.data?.data?.totalOrders || 0,
      successfulPayments: statsResponse?.data?.data?.successfulPayments || 0,
      pendingOrders: statsResponse?.data?.data?.pendingOrders || 0,
      totalRevenue: statsResponse?.data?.data?.totalRevenue || 0,
      totalDishes: foods.length,
      totalAdmins: adminCacheStorage.get().length || 1,
      foods,
      orders,
    };
  },
};

export const adminDirectoryService = {
  async getRegisteredAdmins(currentAdmin) {
    let registrations = [];

    try {
      const { data } = await api.get('/users');
      registrations = (data?.users || []).map((item) => ({
        id: item._id || item.id || item.email,
        name: item.name,
        email: item.email,
        role: item.role || 'registered user',
        status: 'active',
        joinDate: item.createdAt || new Date().toISOString(),
        createdAt: item.createdAt || new Date().toISOString(),
      }));
    } catch (error) {
      registrations = [];
    }

    const localAdmins = adminCacheStorage.get();
    const base = currentAdmin
      ? [
          {
            ...mapAdminUser(currentAdmin),
            role: currentAdmin.role || 'admin',
          },
        ]
      : [];

    const merged = [...base, ...localAdmins, ...registrations].reduce((accumulator, item) => {
      if (!item?.email) {
        return accumulator;
      }

      const existingIndex = accumulator.findIndex((entry) => entry.email === item.email);
      const normalized = {
        ...item,
        role: item.role || 'admin',
        status: item.status || 'active',
        joinDate: item.joinDate || item.createdAt || new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        accumulator[existingIndex] = {
          ...accumulator[existingIndex],
          ...normalized,
        };
        return accumulator;
      }

      accumulator.push(normalized);
      return accumulator;
    }, []);

    return merged.sort((left, right) => new Date(right.joinDate) - new Date(left.joinDate));
  },
};

export const orderService = {
  async getOrders() {
    const { data } = await api.get('/admin/orders');
    return data?.data || [];
  },

  async updateOrderStatus(orderId, orderStatus) {
    const { data } = await api.put(`/orders/${orderId}/status`, { orderStatus });
    return data?.data;
  },
};

export const foodService = {
  async getFoods() {
    const { data } = await api.get('/foods');
    return Array.isArray(data) ? data : [];
  },

  async createFood(payload) {
    const body = {
      foodName: payload.dishName.trim(),
      price: Number(payload.price),
      category: payload.category,
      description: payload.description.trim(),
      isAvailable: payload.isAvailable,
      tags: payload.tags,
      addons: payload.addons,
      foodImages: await Promise.all((payload.images || []).map((file) => toDataUrl(file))),
      rating: 4,
    };
    const { data } = await api.post('/admin/food', body);
    return data?.food;
  },

  async updateFood(foodId, payload) {
    const formData = new FormData();
    formData.append('name', payload.dishName.trim());
    formData.append('price', String(payload.price));
    formData.append('category', payload.category);
    formData.append('description', payload.description.trim());
    formData.append('isAvailable', String(payload.isAvailable));
    formData.append('tags', JSON.stringify(payload.tags));
    formData.append('addons', JSON.stringify(payload.addons));

    (payload.images || []).forEach((file) => {
      if (file instanceof File) {
        formData.append('foodImages', file);
      }
    });

    const { data } = await api.put(`/foods/${foodId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data?.food;
  },

  async deleteFood(foodId) {
    await api.delete(`/foods/${foodId}`);
    return foodId;
  },

  async toggleAvailability(foodId, isAvailable) {
    const { data } = await api.patch(`/admin/food/${foodId}/availability`, { isAvailable });
    return data?.data;
  },
};

export default api;
