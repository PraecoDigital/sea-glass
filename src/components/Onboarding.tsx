import React, { useState } from 'react';
import { DollarSign, Target, CreditCard, Home, TrendingUp } from 'lucide-react';
import { AppData, FixedCost, ExpenseType, User } from '../types/index.ts';
import { LIVING_EXPENSE_SUBCATEGORIES, LIABILITY_SUBCATEGORIES, INVESTMENT_SUBCATEGORIES } from '../types/index.ts';

interface OnboardingProps {
  onComplete: (data: AppData) => void;
  user?: User;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, user }) => {
  const [step, setStep] = useState(1);
  const [income, setIncome] = useState('');
  const [investmentMin, setInvestmentMin] = useState('');
  const [investmentMax, setInvestmentMax] = useState('');
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([]);
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    type: 'living-expense' as ExpenseType,
    classification: 'fixed' as 'fixed' | 'variable',
    subCategory: '',
  });

  const handleAddExpense = () => {
    if (!newExpense.name || !newExpense.amount || !newExpense.subCategory || !newExpense.classification) return;

    const expense: FixedCost = {
      id: Date.now().toString(),
      name: newExpense.name,
      amount: parseFloat(newExpense.amount),
      type: newExpense.type,
      classification: newExpense.classification,
      subCategory: newExpense.subCategory,
    };

    setFixedCosts([...fixedCosts, expense]);
    setNewExpense({ name: '', amount: '', type: 'living-expense', classification: 'fixed', subCategory: '' });
  };

  const handleRemoveExpense = (id: string) => {
    setFixedCosts(fixedCosts.filter(expense => expense.id !== id));
  };

  const handleComplete = () => {
    if (!income || !investmentMin || !investmentMax) return;

    const data: AppData = {
      user: user || {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email: 'demo@example.com',
        name: 'Demo User',
        createdAt: new Date().toISOString(),
      },
      income: parseFloat(income),
      investmentGoals: {
        min: parseFloat(investmentMin),
        max: parseFloat(investmentMax),
      },
      fixedCosts,
      currentBudget: {
        month: new Date().toISOString().slice(0, 7),
        variableAllocated: 0,
        investmentAllocated: 0,
      },
      spendingHistory: [],
      customSubcategories: [],
    };

    onComplete(data);
  };

  const totalFixedCosts = fixedCosts.reduce((sum, cost) => sum + cost.amount, 0);
  const remainingAfterFixed = parseFloat(income) - totalFixedCosts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to BadBudget{user ? `, ${user.name}` : ''}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Let's set up your personal budgeting system
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Step {step} of 3
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((step / 3) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Income and Investment Goals */}
        {step === 1 && (
          <div className="card animate-fade-in">
            <div className="flex items-center mb-6">
              <DollarSign className="w-8 h-8 text-primary-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Your Income & Investment Goals
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monthly Income
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="input-field pl-8"
                    placeholder="3000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Investment Goal
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={investmentMin}
                      onChange={(e) => setInvestmentMin(e.target.value)}
                      className="input-field pl-8"
                      placeholder="500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maximum Investment Goal
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={investmentMax}
                      onChange={(e) => setInvestmentMax(e.target.value)}
                      className="input-field pl-8"
                      placeholder="1500"
                    />
                  </div>
                </div>
              </div>

              {income && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Monthly Income:</strong> ${parseFloat(income).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!income || !investmentMin || !investmentMax}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Fixed Expenses */}
        {step === 2 && (
          <div className="card animate-fade-in">
            <div className="flex items-center mb-6">
              <CreditCard className="w-8 h-8 text-primary-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Your Fixed Expenses
              </h2>
            </div>

            <div className="space-y-6">
              {/* Add New Expense Form */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">Add New Expense</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={newExpense.name}
                    onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                    className="input-field"
                    placeholder="Expense name"
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      className="input-field pl-8"
                      placeholder="Amount"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <select
                    value={newExpense.type}
                    onChange={(e) => setNewExpense({ ...newExpense, type: e.target.value as ExpenseType })}
                    className="input-field"
                  >
                    <option value="living-expense">Living Expense</option>
                    <option value="liability">Liability</option>
                    <option value="investment">Investment</option>
                  </select>
                  <select
                    value={newExpense.classification}
                    onChange={(e) => setNewExpense({ ...newExpense, classification: e.target.value as 'fixed' | 'variable' })}
                    className="input-field"
                  >
                    <option value="fixed">Fixed</option>
                    <option value="variable">Variable</option>
                  </select>
                                      <select
                      value={newExpense.subCategory}
                      onChange={(e) => setNewExpense({ ...newExpense, subCategory: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select subcategory</option>
                      {(newExpense.type === 'living-expense' 
                        ? LIVING_EXPENSE_SUBCATEGORIES 
                        : newExpense.type === 'liability' 
                          ? LIABILITY_SUBCATEGORIES 
                          : INVESTMENT_SUBCATEGORIES).map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                </div>
                <button
                  onClick={handleAddExpense}
                  disabled={!newExpense.name || !newExpense.amount || !newExpense.subCategory || !newExpense.classification}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Expense
                </button>
              </div>

              {/* List of Expenses */}
              {fixedCosts.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">Your Fixed Expenses</h3>
                  <div className="space-y-2">
                    {fixedCosts.map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-center">
                          <span className="text-lg mr-3">
                            {expense.type === 'living-expense' ? <Home className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{expense.name}</p>
                            <p className="text-sm text-gray-500">{expense.subCategory}</p>
                            <p className="text-xs text-gray-400 capitalize">{expense.classification}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-900 dark:text-white mr-3">
                            ${expense.amount.toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleRemoveExpense(expense.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              {income && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-green-800 dark:text-green-200">
                        <strong>Total Fixed Costs:</strong> ${totalFixedCosts.toLocaleString()}
                      </p>
                      <p className="text-sm text-green-800 dark:text-green-200">
                        <strong>Remaining for AI Allocation:</strong> ${remainingAfterFixed.toLocaleString()}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(1)} className="btn-secondary">
                Previous
              </button>
              <button onClick={() => setStep(3)} className="btn-primary">
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review and Complete */}
        {step === 3 && (
          <div className="card animate-fade-in">
            <div className="flex items-center mb-6">
              <Target className="w-8 h-8 text-primary-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Review Your Setup
              </h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Income & Goals</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Monthly Income:</strong> ${parseFloat(income).toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Investment Range:</strong> ${parseFloat(investmentMin).toLocaleString()} - ${parseFloat(investmentMax).toLocaleString()}
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">Fixed Expenses</h3>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>Total Fixed Costs:</strong> ${totalFixedCosts.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>Available for AI Allocation:</strong> ${remainingAfterFixed.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-2">What's Next?</h3>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  You can now track your daily expenses and manage your budget. 
                  Use the configuration page to customize your subcategories and manage your budget settings.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(2)} className="btn-secondary">
                Previous
              </button>
              <button onClick={handleComplete} className="btn-primary">
                Complete Setup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
