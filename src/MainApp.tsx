import React, { useState, useEffect } from 'react';
import { AppData, User } from './types/index.ts';
import { getStoredData, saveData } from './utils/storage.ts';
import Onboarding from './components/Onboarding.tsx';
import Dashboard from './components/Dashboard.tsx';
import Login from './components/Login.tsx';
import SignUp from './components/SignUp.tsx';

const App: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    console.log('🔍 App: Loading data from localStorage...');
    const storedData = getStoredData();
    if (storedData) {
      console.log('✅ App: Found stored data:', storedData);
      setData(storedData);
    } else {
      console.log('ℹ️ App: No stored data found, starting onboarding');
    }
    setIsLoading(false);
  }, []);

  const handleOnboardingComplete = (userData: AppData) => {
    setData(userData);
    saveData(userData);
  };

  const handleLogin = (email: string, password: string) => {
    // For demo purposes, we'll just check if the user exists in stored data
    const storedData = getStoredData();
    if (storedData && storedData.user.email === email) {
      setCurrentUser(storedData.user);
      setData(storedData);
      setShowLogin(false);
    } else {
      alert('Invalid credentials. Please try again or sign up.');
    }
  };

  const handleSignUp = (user: User) => {
    setCurrentUser(user);
    setShowSignUp(false);
    // User will go through onboarding after signup
  };

  const handleDataUpdate = (updatedData: AppData) => {
    setData(updatedData);
    saveData(updatedData);
  };

  const handleReset = () => {
    setData(null);
    localStorage.removeItem('badBudgetData');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading BadBudget...</p>
        </div>
      </div>
    );
  }

  if (showLogin) {
    return (
      <Login 
        onLogin={handleLogin} 
        onShowSignUp={() => {
          setShowLogin(false);
          setShowSignUp(true);
        }} 
      />
    );
  }

  if (showSignUp) {
    return (
      <SignUp 
        onSignUp={handleSignUp} 
        onBackToLogin={() => {
          setShowSignUp(false);
          setShowLogin(true);
        }} 
      />
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="card text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to BadBudget
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Your personal finance management tool
            </p>
            <div className="space-y-4">
              <button
                onClick={() => setShowLogin(true)}
                className="w-full btn-primary"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowSignUp(true)}
                className="w-full btn-secondary"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return <Onboarding onComplete={handleOnboardingComplete} user={currentUser} />;
  }

  return <Dashboard data={data} onDataUpdate={handleDataUpdate} onReset={handleReset} />;
};

export default App;
