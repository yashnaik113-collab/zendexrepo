const TOKEN_KEY = 'motw-admin-token';
const USER_KEY = 'motw-admin-user';
const ADMIN_CACHE_KEY = 'motw-admin-cache';
const NOTIFICATIONS_KEY = 'motw-dashboard-notifications';
const SETTINGS_KEY = 'motw-dashboard-settings';

const defaultSettings = {
  refreshInterval: 8000,
  soundEnabled: false,
  compactMode: false,
};

const parseStoredValue = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    if (!value) {
      return fallback;
    }
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export const userStorage = {
  get: () => parseStoredValue(USER_KEY, null),
  set: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clear: () => localStorage.removeItem(USER_KEY),
};

export const adminCacheStorage = {
  get: () => parseStoredValue(ADMIN_CACHE_KEY, []),
  set: (admins) => localStorage.setItem(ADMIN_CACHE_KEY, JSON.stringify(admins)),
  upsert: (admin) => {
    if (!admin?.email) {
      return [];
    }

    const existing = adminCacheStorage.get();
    const normalized = {
      id: admin.id || admin._id || admin.email,
      name: admin.name || 'Admin',
      email: admin.email,
      role: admin.role || 'admin',
      status: admin.status || 'active',
      joinDate: admin.joinDate || admin.createdAt || new Date().toISOString(),
    };
    const next = [normalized, ...existing.filter((item) => item.email !== normalized.email)];
    adminCacheStorage.set(next);
    return next;
  },
  clear: () => localStorage.removeItem(ADMIN_CACHE_KEY),
};

export const notificationStorage = {
  get: () => parseStoredValue(NOTIFICATIONS_KEY, []),
  set: (notifications) => localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications)),
  push: (notification) => {
    const existing = notificationStorage.get();
    const next = [notification, ...existing].slice(0, 40);
    notificationStorage.set(next);
    return next;
  },
  clear: () => localStorage.removeItem(NOTIFICATIONS_KEY),
};

export const settingsStorage = {
  get: () => ({ ...defaultSettings, ...parseStoredValue(SETTINGS_KEY, {}) }),
  set: (settings) => localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)),
  update: (partialSettings) => {
    const next = { ...settingsStorage.get(), ...partialSettings };
    settingsStorage.set(next);
    return next;
  },
};

export const clearDashboardSession = () => {
  tokenStorage.clear();
  userStorage.clear();
};
