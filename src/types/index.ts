export interface FixedCost {
  id: string;
  name: string;
  amount: number;
  type: 'living-expense' | 'liability' | 'investment';
  classification: 'fixed' | 'variable';
  subCategory?: string;
}

export interface InvestmentGoals {
  min: number;
  max: number;
}

export interface CurrentBudget {
  month: string;
  variableAllocated: number;
  investmentAllocated: number;
}

export interface DailyExpense {
  id: string;
  date: string;
  category: string;
  subCategory: string;
  amount: number;
  classification: 'fixed' | 'variable';
}

export interface SpendingHistory {
  month: string;
  dailyExpenses: DailyExpense[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AppData {
  user: User;
  income: number;
  investmentGoals: InvestmentGoals;
  fixedCosts: FixedCost[];
  currentBudget: CurrentBudget;
  spendingHistory: SpendingHistory[];
  customSubcategories: CustomSubcategory[];
}

export type ExpenseType = 'living-expense' | 'liability' | 'investment';

export interface SubCategory {
  name: string;
  icon: string;
  isCustom?: boolean;
}

export interface CustomSubcategory {
  id: string;
  name: string;
  icon: string;
  type: 'living-expense' | 'liability' | 'investment';
  isVisible: boolean;
}

export const LIVING_EXPENSE_SUBCATEGORIES: SubCategory[] = [
  { name: 'Groceries', icon: '🍎' },
  { name: 'Transportation', icon: '🚗' },
  { name: 'Utilities', icon: '⚡' },
  { name: 'Entertainment', icon: '🎬' },
  { name: 'Healthcare', icon: '🏥' },
  { name: 'Pet Supplies', icon: '🐕' },
  { name: 'Coffee', icon: '☕' },
  { name: 'Dining Out', icon: '🍽️' },
  { name: 'Shopping', icon: '🛍️' },
  { name: 'Other', icon: '📦' },
];

export const LIABILITY_SUBCATEGORIES: SubCategory[] = [
  { name: 'Rent/Mortgage', icon: '🏠' },
  { name: 'Car Payment', icon: '🚙' },
  { name: 'Student Loans', icon: '🎓' },
  { name: 'Credit Cards', icon: '💳' },
  { name: 'Insurance', icon: '🛡️' },
  { name: 'Other Loans', icon: '💰' },
];

export const INVESTMENT_SUBCATEGORIES: SubCategory[] = [
  { name: '401(k)', icon: '📈' },
  { name: 'IRA', icon: '🏦' },
  { name: 'Stocks', icon: '📊' },
  { name: 'Bonds', icon: '📋' },
  { name: 'Real Estate', icon: '🏘️' },
  { name: 'Crypto', icon: '₿' },
  { name: 'Emergency Fund', icon: '🛟' },
  { name: 'Other Investments', icon: '💎' },
];

export interface EditFormData {
  id: string;
  name: string;
  amount: number;
  type: 'living-expense' | 'liability' | 'investment';
  classification: 'fixed' | 'variable';
  subCategory: string;
}

export interface EditExpenseFormData {
  id: string;
  date: string;
  category: string;
  subCategory: string;
  amount: number;
  classification: 'fixed' | 'variable';
}

export interface CategoryTotals {
  livingExpenses: number;
  liabilities: number;
  investments: number;
  subcategoryBreakdown: Record<string, number>;
}

