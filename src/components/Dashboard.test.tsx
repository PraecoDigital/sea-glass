import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';
import { AppData } from '../types/index';

// Mock the storage and supabase utilities
jest.mock('../utils/storage', () => ({
  saveData: jest.fn(),
}));

jest.mock('../utils/supabase', () => ({
  signOut: jest.fn(),
}));

// Mock the Configuration component
jest.mock('./Configuration', () => {
  return function MockConfiguration() {
    return <div data-testid="configuration">Configuration</div>;
  };
});

describe('Dashboard - Monthly Income Card Allocation Display', () => {
  const mockData: AppData = {
    user: {
      id: 'test-user',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date().toISOString(),
    },
    income: 5000,
    investmentGoals: {
      min: 500,
      max: 1000,
    },
    fixedCosts: [
      {
        id: '1',
        name: 'Rent',
        amount: 1500,
        type: 'liability',
        classification: 'fixed',
        subCategory: 'Rent/Mortgage',
      },
      {
        id: '2',
        name: 'Groceries',
        amount: 400,
        type: 'living-expense',
        classification: 'variable',
        subCategory: 'Groceries',
      },
    ],
    currentBudget: {
      month: '2024-01',
      variableAllocated: 800,
      investmentAllocated: 600,
    },
    spendingHistory: [],
    customSubcategories: [],
    benchmarkPercentages: {
      livingExpenses: 70,
      liabilities: 20,
      investments: 10,
    },
  };

  const mockOnDataUpdate = jest.fn();
  const mockOnReset = jest.fn();
  const mockOnSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows unallocated balance when income is not fully allocated', () => {
    render(
      <Dashboard
        data={mockData}
        onDataUpdate={mockOnDataUpdate}
        onReset={mockOnReset}
        onSignOut={mockOnSignOut}
      />
    );

    // Check that the monthly income is displayed
    expect(screen.getByText('$5,000')).toBeInTheDocument();

    // Check that unallocated balance is shown
    // Total allocated = 1500 (rent) + 400 (groceries) + 800 (variable) + 600 (investment) = 3300
    // Unallocated = 5000 - 3300 = 1700
    expect(screen.getByText('$1,700 unallocated')).toBeInTheDocument();
  });

  test('shows 100% allocated when income is fully allocated', () => {
    const fullyAllocatedData: AppData = {
      ...mockData,
      currentBudget: {
        month: '2024-01',
        variableAllocated: 2000,
        investmentAllocated: 1100,
      },
    };

    render(
      <Dashboard
        data={fullyAllocatedData}
        onDataUpdate={mockOnDataUpdate}
        onReset={mockOnReset}
        onSignOut={mockOnSignOut}
      />
    );

    // Check that the monthly income is displayed
    expect(screen.getByText('$5,000')).toBeInTheDocument();

    // Check that 100% allocated is shown
    // Total allocated = 1500 (rent) + 400 (groceries) + 2000 (variable) + 1100 (investment) = 5000
    expect(screen.getByText('100% allocated')).toBeInTheDocument();
  });

  test('shows 100% allocated when income is over-allocated', () => {
    const overAllocatedData: AppData = {
      ...mockData,
      currentBudget: {
        month: '2024-01',
        variableAllocated: 2500,
        investmentAllocated: 1200,
      },
    };

    render(
      <Dashboard
        data={overAllocatedData}
        onDataUpdate={mockOnDataUpdate}
        onReset={mockOnReset}
        onSignOut={mockOnSignOut}
      />
    );

    // Check that the monthly income is displayed
    expect(screen.getByText('$5,000')).toBeInTheDocument();

    // Check that 100% allocated is shown (even when over-allocated)
    // Total allocated = 1500 (rent) + 400 (groceries) + 2500 (variable) + 1200 (investment) = 5600
    expect(screen.getByText('100% allocated')).toBeInTheDocument();
  });
});
