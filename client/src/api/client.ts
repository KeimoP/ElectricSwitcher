
// API client with GitHub Pages (static) mode detection and fallback
import { mockStorage } from '../data/mockStorage';

// Check if we're running on GitHub Pages (no backend)
const isStaticMode = () => {
  return window.location.hostname.includes('github.io') || 
         process.env.NODE_ENV === 'static' ||
         localStorage.getItem('use-static-mode') === 'true';
};

// Common fetch options
const defaultOptions = {
  headers: { 'Content-Type': 'application/json' }
};

export const apiClient = {
  // Auth endpoints
  async smartIdLogin(personalCode: string) {
    if (isStaticMode()) {
      const user = await mockStorage.getUserByPersonalCode(personalCode);
      if (!user) throw new Error('User not found');
      await mockStorage.loginUser(user.id);
      return user;
    }
    
    const response = await fetch('/api/auth/smart-id', {
      method: 'POST',
      ...defaultOptions,
      body: JSON.stringify({ personalCode })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    return response.json();
  },
  
  // User endpoints
  async getCurrentUser() {
    if (isStaticMode()) {
      const userId = await mockStorage.getCurrentUserId();
      if (!userId) return null;
      return mockStorage.getUser(userId);
    }
    
    const response = await fetch('/api/me');
    if (response.status === 401) return null;
    if (!response.ok) throw new Error('Failed to get current user');
    return response.json();
  },
  
  async registerUser(userData: any) {
    if (isStaticMode()) {
      return mockStorage.createUser(userData);
    }
    
    const response = await fetch('/api/users', {
      method: 'POST',
      ...defaultOptions,
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
  },
  
  async updateUserProfile(userData: any) {
    if (isStaticMode()) {
      const userId = await mockStorage.getCurrentUserId();
      if (!userId) throw new Error('Not authenticated');
      return mockStorage.updateUser(userId, userData);
    }
    
    const response = await fetch('/api/me', {
      method: 'PATCH',
      ...defaultOptions,
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Update failed');
    }
    
    return response.json();
  },
  
  // Plans endpoints
  async getPlans() {
    if (isStaticMode()) {
      return mockStorage.getPlans();
    }
    
    const response = await fetch('/api/plans');
    if (!response.ok) throw new Error('Failed to fetch plans');
    return response.json();
  },
  
  // Switch endpoints
  async requestPlanSwitch(switchData: any) {
    if (isStaticMode()) {
      const userId = await mockStorage.getCurrentUserId();
      if (!userId) throw new Error('Not authenticated');
      
      return mockStorage.createSwitch({
        ...switchData,
        userId,
        requestedAt: new Date(),
        status: 'pending'
      });
    }
    
    const response = await fetch('/api/switches', {
      method: 'POST',
      ...defaultOptions,
      body: JSON.stringify(switchData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Switch request failed');
    }
    
    return response.json();
  },
  
  async getUserSwitches() {
    if (isStaticMode()) {
      const userId = await mockStorage.getCurrentUserId();
      if (!userId) throw new Error('Not authenticated');
      return mockStorage.getUserSwitches(userId);
    }
    
    const response = await fetch('/api/switches');
    if (!response.ok) throw new Error('Failed to fetch switches');
    return response.json();
  },

  // Helper to toggle static mode (for testing)
  setStaticMode(enabled: boolean) {
    localStorage.setItem('use-static-mode', enabled ? 'true' : 'false');
    window.location.reload();
  }
};
