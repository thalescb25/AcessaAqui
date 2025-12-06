// Enhanced localStorage with persistence
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting ${key} in storage:`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      return false;
    }
  },

  // Initialize data from mockData if not exists
  init: (key, mockData) => {
    const existing = storage.get(key);
    if (!existing || existing.length === 0) {
      storage.set(key, mockData);
      return mockData;
    }
    return existing;
  }
};

// Storage keys
export const STORAGE_KEYS = {
  BUILDINGS: 'buildings',
  COMPANIES: 'companies',
  VISITORS: 'visitors',
  USERS: 'users',
  PLANS: 'plans',
  SETTINGS: 'settings',
  BUILDING_SETTINGS: 'building_settings'
};
