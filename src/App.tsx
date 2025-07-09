import React, { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { LandingPage } from './components/LandingPage';
import { MonsterProfile } from './components/MonsterProfile';
import { AuthPage } from './components/AuthPage';

function App() {
  const { monster, isLoading, error, setError, isAuthenticated, initializeAuth } = useGameStore();

  // Initialize authentication on app start
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  return (
    <div className="App">
      {/* Global Error Display */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isAuthenticated ? (
        <AuthPage />
      ) : monster ? (
        <MonsterProfile />
      ) : (
        <LandingPage />
      )}
    </div>
  );
}

export default App;
