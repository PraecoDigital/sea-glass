import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Calendar, 
  Target, 
  Home, 
  CreditCard,
  Moon,
  Sun,
  Settings
} from 'lucide-react';
import { AppData, DailyExpense, CategoryTotals } from '../types/index.ts';
import { saveData } from '../utils/storage.ts';
import { LIVING_EXPENSE_SUBCATEGORIES, LIABILITY_SUBCATEGORIES, INVESTMENT_SUBCATEGORIES } from '../types/index.ts';
import Configuration from './Configuration.tsx';

interface DashboardProps {
  data: AppData;
  onDataUpdate: (data: AppData) => void;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onDataUpdate, onReset }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingFixedCost, setEditingFixedCost] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: 'Living Expenses',
    subCategory: '',
    classification: 'variable' as 'fixed' | 'variable',
    date: new Date().toISOString().split('T')[0],
  });
  const [showConfiguration, setShowConfiguration] = useState(false);
  const [editingInvestmentRange, setEditingInvestmentRange] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<string | null>(null);
  const [investmentRangeForm, setInvestmentRangeForm] = useState({
    min: data.investmentGoals.min.toString(),
    max: data.investmentGoals.max.toString(),
  });

  useEffect(() => {
    // Check for dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Calculate category totals
  const calculateCategoryTotals = (): CategoryTotals => {
    const totals: CategoryTotals = {
      livingExpenses: 0,
      liabilities: 0,
      investments: 0,
      subcategoryBreakdown: {},
    };

    // Calculate totals from fixed costs
    data.fixedCosts.forEach(cost => {
      if (cost.type === 'living-expense') {
        totals.livingExpenses += cost.amount;
      } else if (cost.type === 'liability') {
        totals.liabilities += cost.amount;
      } else if (cost.type === 'investment') {
        totals.investments += cost.amount;
      }

      if (cost.subCategory) {
        totals.subcategoryBreakdown[cost.subCategory] = (totals.subcategoryBreakdown[cost.subCategory] || 0) + cost.amount;
      }
    });

    // Calculate totals from current month expenses
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentMonthHistory = data.spendingHistory.find(h => h.month === currentMonth);
    if (currentMonthHistory) {
      currentMonthHistory.dailyExpenses.forEach(expense => {
        if (expense.category === 'Living Expenses') {
          totals.livingExpenses += expense.amount;
        } else if (expense.category === 'Investments') {
          totals.investments += expense.amount;
        }

        totals.subcategoryBreakdown[expense.subCategory] = (totals.subcategoryBreakdown[expense.subCategory] || 0) + expense.amount;
      });
    }

    return totals;
  };

  const categoryTotals = calculateCategoryTotals();

  // Calculate total variable costs (all expenses classified as variable)
  const calculateTotalVariableCosts = (): number => {
    let totalVariable = 0;

    // Add variable fixed costs
    data.fixedCosts
      .filter(cost => cost.classification === 'variable')
      .forEach(cost => {
        totalVariable += cost.amount;
      });

    // Add variable expenses from current month
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentMonthHistory = data.spendingHistory.find(h => h.month === currentMonth);
    if (currentMonthHistory) {
      currentMonthHistory.dailyExpenses
        .filter(expense => expense.classification === 'variable')
        .forEach(expense => {
          totalVariable += expense.amount;
        });
    }

    return totalVariable;
  };

  const totalVariableCosts = calculateTotalVariableCosts();

  const totalFixedLivingCosts = data.fixedCosts
    .filter(cost => cost.classification === 'fixed' && cost.type === 'living-expense')
    .reduce((sum, cost) => sum + cost.amount, 0);

  // Get current month's spending (only variable expenses)
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthHistory = data.spendingHistory.find(h => h.month === currentMonth);
  const currentMonthSpending = currentMonthHistory?.dailyExpenses
    .filter(expense => expense.classification === 'variable')
    .reduce((sum, expense) => sum + expense.amount, 0) || 0;

  // Calculate spending by category for charts (only variable expenses)
  const spendingByCategory = currentMonthHistory?.dailyExpenses
    .filter(expense => expense.classification === 'variable')
    .reduce((acc, expense) => {
      acc[expense.subCategory] = (acc[expense.subCategory] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>) || {};

  const chartData = Object.entries(spendingByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  const COLORS = ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#EC4899'];

  const handleAddExpense = () => {
    if (!newExpense.amount || !newExpense.subCategory) return;

    const expense: DailyExpense = {
      id: Date.now().toString(),
      date: newExpense.date,
      category: newExpense.category,
      subCategory: newExpense.subCategory,
      classification: newExpense.classification,
      amount: parseFloat(newExpense.amount),
    };

    const updatedData = { ...data };
    const existingMonthIndex = updatedData.spendingHistory.findIndex(h => h.month === currentMonth);
    
    if (existingMonthIndex >= 0) {
      updatedData.spendingHistory[existingMonthIndex].dailyExpenses.push(expense);
    } else {
      updatedData.spendingHistory.push({
        month: currentMonth,
        dailyExpenses: [expense],
      });
    }

    onDataUpdate(updatedData);
    saveData(updatedData);
    
    setNewExpense({
      amount: '',
      category: 'Living Expenses',
      subCategory: '',
      classification: 'variable',
      date: new Date().toISOString().split('T')[0],
    });
    setShowExpenseForm(false);
  };

  const handleEditFixedCost = (fixedCost: FixedCost) => {
    setEditingFixedCost(fixedCost.id);
  };

  const handleSaveFixedCost = (updatedFixedCost: FixedCost) => {
    const updatedData = {
      ...data,
      fixedCosts: data.fixedCosts.map(cost => 
        cost.id === updatedFixedCost.id ? updatedFixedCost : cost
      ),
    };
    onDataUpdate(updatedData);
    saveData(updatedData);
    setEditingFixedCost(null);
  };

  const handleCancelEditFixedCost = () => {
    setEditingFixedCost(null);
  };

  const handleEditExpense = (expense: DailyExpense) => {
    setEditingExpense(expense.id);
  };

  const handleSaveExpense = (updatedExpense: DailyExpense) => {
    const updatedData = { ...data };
    const monthIndex = updatedData.spendingHistory.findIndex(h => h.month === currentMonth);
    
    if (monthIndex >= 0) {
      updatedData.spendingHistory[monthIndex].dailyExpenses = 
        updatedData.spendingHistory[monthIndex].dailyExpenses.map(exp => 
          exp.id === updatedExpense.id ? updatedExpense : exp
        );
    }
    
    onDataUpdate(updatedData);
    saveData(updatedData);
    setEditingExpense(null);
  };

  const handleCancelEditExpense = () => {
    setEditingExpense(null);
  };

  const handleSaveInvestmentRange = () => {
    const updatedData = {
      ...data,
      investmentGoals: {
        min: parseFloat(investmentRangeForm.min),
        max: parseFloat(investmentRangeForm.max),
      },
    };
    onDataUpdate(updatedData);
    saveData(updatedData);
    setEditingInvestmentRange(false);
  };

  const handleCancelEditInvestmentRange = () => {
    setInvestmentRangeForm({
      min: data.investmentGoals.min.toString(),
      max: data.investmentGoals.max.toString(),
    });
    setEditingInvestmentRange(false);
  };

  const handleEditSubcategory = (subcategoryName: string) => {
    setEditingSubcategory(subcategoryName);
  };

  const handleSaveSubcategory = (oldName: string, newName: string) => {
    const updatedData = { ...data };
    
    // Update fixed costs
    updatedData.fixedCosts = updatedData.fixedCosts.map(cost => 
      cost.subCategory === oldName ? { ...cost, subCategory: newName } : cost
    );
    
    // Update spending history
    updatedData.spendingHistory = updatedData.spendingHistory.map(month => ({
      ...month,
      dailyExpenses: month.dailyExpenses.map(expense => 
        expense.subCategory === oldName ? { ...expense, subCategory: newName } : expense
      ),
    }));
    
    onDataUpdate(updatedData);
    saveData(updatedData);
    setEditingSubcategory(null);
  };

  const handleDeleteExpense = (expenseId: string) => {
    const updatedData = { ...data };
    const monthIndex = updatedData.spendingHistory.findIndex(h => h.month === currentMonth);
    
    if (monthIndex >= 0) {
      updatedData.spendingHistory[monthIndex].dailyExpenses = 
        updatedData.spendingHistory[monthIndex].dailyExpenses.filter(exp => exp.id !== expenseId);
    }
    
    onDataUpdate(updatedData);
    saveData(updatedData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (showConfiguration) {
    return (
      <Configuration 
        data={data} 
        onDataUpdate={onDataUpdate} 
        onBackToDashboard={() => setShowConfiguration(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-primary-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">BadBudget</h1>
              {data.user && (
                <span className="ml-4 text-sm text-gray-600 dark:text-gray-300">
                  Welcome, {data.user.name}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowExpenseForm(!showExpenseForm)}
                className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                title="Add Expense"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowConfiguration(true)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Configuration"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Budget Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card card-hover">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Income</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(data.income)}</p>
              </div>
            </div>
          </div>

          <div className="card card-hover">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <CreditCard className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fixed Living Costs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalFixedLivingCosts)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {((totalFixedLivingCosts / data.income) * 100).toFixed(1)}% of income
                </p>
              </div>
            </div>
          </div>

          <div className="card card-hover">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Home className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Variable Costs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalVariableCosts)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {((totalVariableCosts / data.income) * 100).toFixed(1)}% of income
                </p>
              </div>
            </div>
          </div>

          <div className="card card-hover">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Investments</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{formatCurrency(categoryTotals.investments)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {((categoryTotals.investments / data.income) * 100).toFixed(1)}% of income
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Costs Management */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Fixed Costs Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.fixedCosts.filter(cost => cost.classification === 'fixed').map((fixedCost) => (
              <div key={fixedCost.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                {editingFixedCost === fixedCost.id ? (
                  <EditFixedCostForm
                    fixedCost={fixedCost}
                    onSave={handleSaveFixedCost}
                    onCancel={handleCancelEditFixedCost}
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-lg mr-3">
                        {fixedCost.type === 'living-expense' ? <Home className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{fixedCost.name}</p>
                        <p className="text-sm text-gray-500">
                          {editingSubcategory === fixedCost.subCategory ? (
                            <input
                              type="text"
                              defaultValue={fixedCost.subCategory}
                              onBlur={(e) => handleSaveSubcategory(fixedCost.subCategory || '', e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSaveSubcategory(fixedCost.subCategory || '', e.currentTarget.value)}
                              className="input-field text-xs"
                              autoFocus
                            />
                          ) : (
                            <span className="flex items-center">
                              {fixedCost.subCategory}
                              <button
                                onClick={() => handleEditSubcategory(fixedCost.subCategory || '')}
                                className="ml-1 text-blue-500 hover:text-blue-700 text-xs"
                              >
                                Edit
                              </button>
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">{fixedCost.classification}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(fixedCost.amount)}
                      </span>
                      <button
                        onClick={() => handleEditFixedCost(fixedCost)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {data.fixedCosts.filter(cost => cost.classification === 'fixed').length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 col-span-full text-center py-4">
                No fixed costs configured. Add them during onboarding.
              </p>
            )}
          </div>
        </div>

        {/* Variable Costs Management */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Variable Costs Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Variable Fixed Costs */}
            {data.fixedCosts.filter(cost => cost.classification === 'variable').map((variableCost) => (
              <div key={variableCost.id} className={`p-4 rounded-lg ${
                variableCost.type === 'liability' 
                  ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
                  : 'bg-gray-50 dark:bg-gray-700'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">
                      {variableCost.type === 'living-expense' ? <Home className="w-5 h-5" /> : 
                       variableCost.type === 'liability' ? <CreditCard className="w-5 h-5 text-red-600" /> : 
                       <Target className="w-5 h-5" />}
                    </span>
                    <div>
                      <p className={`font-medium ${
                        variableCost.type === 'liability' 
                          ? 'text-red-900 dark:text-red-100' 
                          : 'text-gray-900 dark:text-white'
                      }`}>{variableCost.name}</p>
                      <p className="text-sm text-gray-500">
                        {editingSubcategory === variableCost.subCategory ? (
                          <input
                            type="text"
                            defaultValue={variableCost.subCategory}
                            onBlur={(e) => handleSaveSubcategory(variableCost.subCategory || '', e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveSubcategory(variableCost.subCategory || '', e.currentTarget.value)}
                            className="input-field text-xs"
                            autoFocus
                          />
                        ) : (
                          <span className="flex items-center">
                            {variableCost.subCategory}
                            <button
                              onClick={() => handleEditSubcategory(variableCost.subCategory || '')}
                              className="ml-1 text-blue-500 hover:text-blue-700 text-xs"
                            >
                              Edit
                            </button>
                          </span>
                        )}
                      </p>
                      <p className={`text-xs capitalize ${
                        variableCost.type === 'liability' 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-gray-400'
                      }`}>{variableCost.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold ${
                      variableCost.type === 'liability' 
                        ? 'text-red-900 dark:text-red-100' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {formatCurrency(variableCost.amount)}
                    </span>
                    <button
                      onClick={() => handleEditFixedCost(variableCost)}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Variable Daily Expenses */}
            {currentMonthHistory?.dailyExpenses
              .filter(expense => expense.classification === 'variable')
              .map((expense) => (
                <div key={expense.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {editingSubcategory === expense.subCategory ? (
                            <input
                              type="text"
                              defaultValue={expense.subCategory}
                              onBlur={(e) => handleSaveSubcategory(expense.subCategory, e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSaveSubcategory(expense.subCategory, e.currentTarget.value)}
                              className="input-field text-xs"
                              autoFocus
                            />
                          ) : (
                            <span className="flex items-center">
                              {expense.subCategory}
                              <button
                                onClick={() => handleEditSubcategory(expense.subCategory)}
                                className="ml-1 text-blue-500 hover:text-blue-700 text-xs"
                              >
                                Edit
                              </button>
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-400 capitalize">{expense.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(expense.amount)}
                      </span>
                      <button
                        onClick={() => handleEditExpense(expense)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            
            {data.fixedCosts.filter(cost => cost.classification === 'variable').length === 0 && 
             (!currentMonthHistory || currentMonthHistory.dailyExpenses.filter(expense => expense.classification === 'variable').length === 0) && (
              <p className="text-sm text-gray-500 dark:text-gray-400 col-span-full text-center py-4">
                No variable costs configured. Add them during onboarding or as daily expenses.
              </p>
            )}
          </div>
        </div>

        {/* Investment Management */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Investment Management</h3>
          
          {/* Investment Target Comparison */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-green-900 dark:text-green-100">Investment Target Progress</h4>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-600" />
                {!editingInvestmentRange && (
                  <button
                    onClick={() => setEditingInvestmentRange(true)}
                    className="text-green-600 hover:text-green-700 text-sm"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
            
            {editingInvestmentRange ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                      Minimum Target
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600">$</span>
                      <input
                        type="number"
                        value={investmentRangeForm.min}
                        onChange={(e) => setInvestmentRangeForm({ ...investmentRangeForm, min: e.target.value })}
                        className="input-field pl-8 border-green-300 focus:border-green-500"
                        placeholder="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                      Maximum Target
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600">$</span>
                      <input
                        type="number"
                        value={investmentRangeForm.max}
                        onChange={(e) => setInvestmentRangeForm({ ...investmentRangeForm, max: e.target.value })}
                        className="input-field pl-8 border-green-300 focus:border-green-500"
                        placeholder="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveInvestmentRange}
                    disabled={!investmentRangeForm.min || !investmentRangeForm.max}
                    className="btn-primary text-sm px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEditInvestmentRange}
                    className="btn-secondary text-sm px-3 py-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-green-800 dark:text-green-200">Current Total</p>
                    <p className="text-lg font-bold text-green-900 dark:text-green-100">
                      {formatCurrency(categoryTotals.investments)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-800 dark:text-green-200">Target Range</p>
                    <p className="text-lg font-bold text-green-900 dark:text-green-100">
                      {formatCurrency(data.investmentGoals.min)} - {formatCurrency(data.investmentGoals.max)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-800 dark:text-green-200">Status</p>
                    <p className={`text-lg font-bold ${
                      categoryTotals.investments >= data.investmentGoals.min && categoryTotals.investments <= data.investmentGoals.max
                        ? 'text-green-600 dark:text-green-400'
                        : categoryTotals.investments < data.investmentGoals.min
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                    }`}>
                      {categoryTotals.investments >= data.investmentGoals.min && categoryTotals.investments <= data.investmentGoals.max
                        ? '✅ On Target'
                        : categoryTotals.investments < data.investmentGoals.min
                          ? '⚠️ Below Target'
                          : '📈 Above Target'
                      }
                    </p>
                  </div>
                </div>
                {categoryTotals.investments < data.investmentGoals.min && (
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                    You need {formatCurrency(data.investmentGoals.min - categoryTotals.investments)} more to reach your minimum target.
                  </p>
                )}
                {categoryTotals.investments > data.investmentGoals.max && (
                  <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                    Great job! You're {formatCurrency(categoryTotals.investments - data.investmentGoals.max)} above your maximum target.
                  </p>
                )}
              </>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Investment Fixed Costs */}
            {data.fixedCosts.filter(cost => cost.type === 'investment').map((investment) => (
              <div key={investment.id} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 mr-3 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">{investment.name}</p>
                      <p className="text-sm text-gray-500">
                        {editingSubcategory === investment.subCategory ? (
                          <input
                            type="text"
                            defaultValue={investment.subCategory}
                            onBlur={(e) => handleSaveSubcategory(investment.subCategory || '', e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveSubcategory(investment.subCategory || '', e.currentTarget.value)}
                            className="input-field text-xs"
                            autoFocus
                          />
                        ) : (
                          <span className="flex items-center">
                            {investment.subCategory}
                            <button
                              onClick={() => handleEditSubcategory(investment.subCategory || '')}
                              className="ml-1 text-blue-500 hover:text-blue-700 text-xs"
                            >
                              Edit
                            </button>
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 capitalize">{investment.classification}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-green-900 dark:text-green-100">
                      {formatCurrency(investment.amount)}
                    </span>
                    <button
                      onClick={() => handleEditFixedCost(investment)}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Investment Daily Expenses */}
            {currentMonthHistory?.dailyExpenses
              .filter(expense => expense.category === 'Investments')
              .map((expense) => (
                <div key={expense.id} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-3 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900 dark:text-green-100">
                          {editingSubcategory === expense.subCategory ? (
                            <input
                              type="text"
                              defaultValue={expense.subCategory}
                              onBlur={(e) => handleSaveSubcategory(expense.subCategory, e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSaveSubcategory(expense.subCategory, e.currentTarget.value)}
                              className="input-field text-xs"
                              autoFocus
                            />
                          ) : (
                            <span className="flex items-center">
                              {expense.subCategory}
                              <button
                                onClick={() => handleEditSubcategory(expense.subCategory)}
                                className="ml-1 text-blue-500 hover:text-blue-700 text-xs"
                              >
                                Edit
                              </button>
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                        <p className="text-xs text-green-600 dark:text-green-400 capitalize">{expense.classification}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-green-900 dark:text-green-100">
                        {formatCurrency(expense.amount)}
                      </span>
                      <button
                        onClick={() => handleEditExpense(expense)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            
            {data.fixedCosts.filter(cost => cost.type === 'investment').length === 0 && 
             (!currentMonthHistory || currentMonthHistory.dailyExpenses.filter(expense => expense.category === 'Investments').length === 0) && (
              <p className="text-sm text-gray-500 dark:text-gray-400 col-span-full text-center py-4">
                No investments configured. Add them during onboarding or as daily expenses.
              </p>
            )}
          </div>
        </div>

        {/* All Expenses Management */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">All Expenses</h3>
          <div className="space-y-4">
            {currentMonthHistory?.dailyExpenses.length > 0 ? (
              currentMonthHistory.dailyExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {editingExpense === expense.id ? (
                    <EditExpenseForm
                      expense={expense}
                      onSave={handleSaveExpense}
                      onCancel={handleCancelEditExpense}
                      onDelete={handleDeleteExpense}
                    />
                  ) : (
                    <>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {expense.subCategory}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(expense.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-400 capitalize">{expense.classification}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(expense.amount)}
                        </span>
                        <button
                          onClick={() => handleEditExpense(expense)}
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No expenses recorded yet
              </p>
            )}
          </div>
        </div>

        {/* Category Totals and Breakdown */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Totals & Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Living Expenses</h4>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{formatCurrency(categoryTotals.livingExpenses)}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">Liabilities</h4>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">{formatCurrency(categoryTotals.liabilities)}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Investments</h4>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{formatCurrency(categoryTotals.investments)}</p>
            </div>
          </div>
          
          {/* Subcategory Breakdown */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Subcategory Breakdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(categoryTotals.subcategoryBreakdown)
                .sort(([,a], [,b]) => b - a)
                .map(([subcategory, amount]) => (
                  <div key={subcategory} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {editingSubcategory === subcategory ? (
                        <input
                          type="text"
                          defaultValue={subcategory}
                          onBlur={(e) => handleSaveSubcategory(subcategory, e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSaveSubcategory(subcategory, e.currentTarget.value)}
                          className="input-field text-sm"
                          autoFocus
                        />
                      ) : (
                        <>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{subcategory}</span>
                          <button
                            onClick={() => handleEditSubcategory(subcategory)}
                            className="text-blue-500 hover:text-blue-700 text-xs"
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(amount)}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Charts and Spending Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Spending by Category Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spending by Category</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <p>No spending data yet. Add your first expense!</p>
              </div>
            )}
          </div>

          {/* Daily Expense Tracking */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Expense Tracking</h3>
              <button
                onClick={() => setShowExpenseForm(!showExpenseForm)}
                className="btn-primary flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </button>
            </div>

            {showExpenseForm && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4 animate-slide-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                        className="input-field pl-8"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                      className="input-field"
                    >
                      <option value="Living Expenses">Living Expenses</option>
                      <option value="Liabilities">Liabilities</option>
                      <option value="Investments">Investments</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Classification
                    </label>
                    <select
                      value={newExpense.classification}
                      onChange={(e) => setNewExpense({ ...newExpense, classification: e.target.value as 'fixed' | 'variable' })}
                      className="input-field"
                    >
                      <option value="fixed">Fixed</option>
                      <option value="variable">Variable</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subcategory
                    </label>
                    <select
                      value={newExpense.subCategory}
                      onChange={(e) => setNewExpense({ ...newExpense, subCategory: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select subcategory</option>
                      {(newExpense.category === 'Living Expenses' 
                        ? LIVING_EXPENSE_SUBCATEGORIES 
                        : newExpense.category === 'Liabilities' 
                          ? LIABILITY_SUBCATEGORIES 
                          : INVESTMENT_SUBCATEGORIES).map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddExpense}
                    disabled={!newExpense.amount || !newExpense.subCategory}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Expense
                  </button>
                  <button
                    onClick={() => setShowExpenseForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Current Month Spending Summary */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    This Month's Variable Spending
                  </p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {formatCurrency(currentMonthSpending)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Budget: {formatCurrency(data.currentBudget.variableAllocated)}
                  </p>
                  <p className={`text-sm font-medium ${
                    currentMonthSpending > data.currentBudget.variableAllocated 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {currentMonthSpending > data.currentBudget.variableAllocated ? (
                      <span className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Over budget
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <TrendingDown className="w-4 h-4 mr-1" />
                        Under budget
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Expenses */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Recent Expenses</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {currentMonthHistory?.dailyExpenses
                  .filter(expense => expense.classification === 'variable')
                  .slice(-5)
                  .reverse()
                  .map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    {editingExpense === expense.id ? (
                      <EditExpenseForm
                        expense={expense}
                        onSave={handleSaveExpense}
                        onCancel={handleCancelEditExpense}
                        onDelete={handleDeleteExpense}
                      />
                    ) : (
                      <>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {expense.subCategory}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(expense.date).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-400 capitalize">{expense.classification}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(expense.amount)}
                          </span>
                          <button
                            onClick={() => handleEditExpense(expense)}
                            className="text-blue-500 hover:text-blue-700 text-sm"
                          >
                            Edit
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {(!currentMonthHistory || currentMonthHistory.dailyExpenses.filter(expense => expense.classification === 'variable').length === 0) && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No expenses recorded yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit Fixed Cost Form Component
interface EditFixedCostFormProps {
  fixedCost: FixedCost;
  onSave: (fixedCost: FixedCost) => void;
  onCancel: () => void;
}

const EditFixedCostForm: React.FC<EditFixedCostFormProps> = ({ fixedCost, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: fixedCost.name,
    amount: fixedCost.amount.toString(),
    type: fixedCost.type,
    classification: fixedCost.classification,
    subCategory: fixedCost.subCategory || '',
  });

  const handleSave = () => {
    if (!formData.name || !formData.amount) return;
    
    const updatedFixedCost: FixedCost = {
      ...fixedCost,
      name: formData.name,
      amount: parseFloat(formData.amount),
      type: formData.type,
      classification: formData.classification,
      subCategory: formData.subCategory,
    };
    
    onSave(updatedFixedCost);
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="input-field text-sm"
        placeholder="Name"
      />
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="input-field text-sm pl-8"
          placeholder="Amount"
          step="0.01"
        />
      </div>
      <select
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'living-expense' | 'liability' })}
        className="input-field text-sm"
      >
        <option value="living-expense">Living Expense</option>
        <option value="liability">Liability</option>
      </select>
      <select
        value={formData.classification}
        onChange={(e) => setFormData({ ...formData, classification: e.target.value as 'fixed' | 'variable' })}
        className="input-field text-sm"
      >
        <option value="fixed">Fixed</option>
        <option value="variable">Variable</option>
      </select>
      <select
        value={formData.subCategory}
        onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
        className="input-field text-sm"
      >
        <option value="">Select subcategory</option>
        {(formData.type === 'living-expense' ? LIVING_EXPENSE_SUBCATEGORIES : LIABILITY_SUBCATEGORIES).map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.icon} {cat.name}
          </option>
        ))}
      </select>
      <div className="flex space-x-2">
        <button
          onClick={handleSave}
          disabled={!formData.name || !formData.amount}
          className="btn-primary text-sm px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="btn-secondary text-sm px-3 py-1"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Edit Expense Form Component
interface EditExpenseFormProps {
  expense: DailyExpense;
  onSave: (expense: DailyExpense) => void;
  onCancel: () => void;
  onDelete: (expenseId: string) => void;
}

const EditExpenseForm: React.FC<EditExpenseFormProps> = ({ expense, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState({
    date: expense.date,
    category: expense.category,
    subCategory: expense.subCategory,
    classification: expense.classification,
    amount: expense.amount.toString(),
  });

  const handleSave = () => {
    if (!formData.amount || !formData.subCategory) return;
    
    const updatedExpense: DailyExpense = {
      ...expense,
      date: formData.date,
      category: formData.category,
      subCategory: formData.subCategory,
      classification: formData.classification,
      amount: parseFloat(formData.amount),
    };
    
    onSave(updatedExpense);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="input-field text-sm"
        />
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="input-field text-sm pl-8"
            placeholder="Amount"
            step="0.01"
          />
        </div>
      </div>
      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        className="input-field text-sm"
      >
        <option value="Living Expenses">Living Expenses</option>
        <option value="Liabilities">Liabilities</option>
        <option value="Investments">Investments</option>
      </select>
      <select
        value={formData.classification}
        onChange={(e) => setFormData({ ...formData, classification: e.target.value as 'fixed' | 'variable' })}
        className="input-field text-sm"
      >
        <option value="fixed">Fixed</option>
        <option value="variable">Variable</option>
      </select>
      <select
        value={formData.subCategory}
        onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
        className="input-field text-sm"
      >
        <option value="">Select subcategory</option>
        {(formData.category === 'Living Expenses' 
          ? LIVING_EXPENSE_SUBCATEGORIES 
          : formData.category === 'Liabilities' 
            ? LIABILITY_SUBCATEGORIES 
            : INVESTMENT_SUBCATEGORIES).map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.icon} {cat.name}
          </option>
        ))}
      </select>
      <div className="flex space-x-2">
        <button
          onClick={handleSave}
          disabled={!formData.amount || !formData.subCategory}
          className="btn-primary text-sm px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="btn-secondary text-sm px-3 py-1"
        >
          Cancel
        </button>
        <button
          onClick={() => onDelete(expense.id)}
          className="btn-secondary text-sm px-3 py-1 text-red-600 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
