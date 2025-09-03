import React, { useState, useEffect } from 'react';
import { AppData } from './types/index';
import { getStoredData, saveData, initializeData } from './utils/storage';
import { getCurrentUser, onAuthStateChange, saveUserData, getUserData, testSupabaseConnection } from './utils/supabase';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import SignUp from './components/SignUp';

const App: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Test Supabase connection first
        await testSupabaseConnection();
        
        // Check for authenticated user
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
          
          // Try to load user data from Supabase
          try {
            const userData = await getUserData(user.id);
            if (userData) {
              setData(userData);
            } else {
              // Fallback to localStorage
              const storedData = getStoredData();
              if (storedData) {
                setData(storedData);
              }
            }
          } catch (error) {
            console.log('No user data in Supabase, checking localStorage...');
            const storedData = getStoredData();
            if (storedData) {
              setData(storedData);
            }
          }
        } else {
          // Check localStorage for demo data
          const storedData = getStoredData();
          if (storedData) {
            setData(storedData);
          }
        }
      } catch (error) {
        console.log('No authenticated user, checking localStorage...');
        const storedData = getStoredData();
        if (storedData) {
          setData(storedData);
        }
      }
      setIsLoading(false);
    };

    initializeApp();

    // Set up auth state listener
    const { data: { subscription } } = onAuthStateChange((user) => {
      setCurrentUser(user);
      if (!user) {
        setData(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleOnboardingComplete = async (userData: AppData) => {
    // Update user data with current user info
    const updatedUserData = {
      ...userData,
      user: {
        id: currentUser?.id || userData.user.id,
        email: currentUser?.email || userData.user.email,
        name: currentUser?.user_metadata?.name || userData.user.name,
        createdAt: currentUser?.created_at || userData.user.createdAt,
      },
    };
    
    setData(updatedUserData);
    saveData(updatedUserData);
    
    // Save to Supabase if user is authenticated
    if (currentUser) {
      try {
        await saveUserData(currentUser.id, updatedUserData);
      } catch (error) {
        console.error('Failed to save to Supabase:', error);
      }
    }
  };

  const handleLogin = async (user: any) => {
    setCurrentUser(user);
    setShowLogin(false);
    
    // Try to load user data from Supabase
    try {
      const userData = await getUserData(user.id);
      if (userData) {
        setData(userData);
      } else {
        // User has no data, will go through onboarding
        setData(null);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      // User has no data, will go through onboarding
      setData(null);
    }
  };

  const handleSignUp = async (user: any) => {
    setCurrentUser(user);
    setShowSignUp(false);
    // User will go through onboarding after signup
  };

  const handleDataUpdate = async (updatedData: AppData) => {
    setData(updatedData);
    saveData(updatedData);
    
    // Save to Supabase if user is authenticated
    if (currentUser) {
      try {
        await saveUserData(currentUser.id, updatedData);
      } catch (error) {
        console.error('Failed to save to Supabase:', error);
      }
    }
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

  return <Dashboard data={data} onDataUpdate={handleDataUpdate} onReset={handleReset} onSignOut={() => setCurrentUser(null)} />;
};

export default App;
