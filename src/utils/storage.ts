import { AppData } from '../types';

const STORAGE_KEY = 'badBudgetData';

export const getStoredData = (): AppData | null => {
  try {
    console.log('🔍 Storage: Attempting to read from localStorage...');
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('✅ Storage: Successfully loaded data:', parsed);
      return parsed;
    } else {
      console.log('ℹ️ Storage: No data found in localStorage');
      return null;
    }
  } catch (error) {
    console.error('❌ Storage: Error reading from localStorage:', error);
    return null;
  }
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const clearData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

export const initializeData = (): AppData => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  return {
    user: {
      id: generateUserId(),
      email: 'demo@example.com',
      name: 'Demo User',
      createdAt: new Date().toISOString(),
    },
    income: 0,
    investmentGoals: {
      min: 0,
      max: 0,
    },
    fixedCosts: [],
    currentBudget: {
      month: currentMonth,
      variableAllocated: 0,
      investmentAllocated: 0,
    },
    spendingHistory: [],
    customSubcategories: [],
  };
};

const generateUserId = (): string => {
  return 'user_' + Math.random().toString(36).substr(2, 9);
};
