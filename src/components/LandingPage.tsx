import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export const LandingPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const { createUser, isLoading, error } = useGameStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      createUser(username.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🐾 Hashlings
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Generate Your Unique Monster
          </p>
          <p className="text-gray-400">
            Enter your username to create a one-of-a-kind monster companion
          </p>
        </div>

        <div className="monster-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isLoading}
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="w-full action-button bg-gradient-to-r from-purple-600 to-pink-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Monster...
                </div>
              ) : (
                'Create My Monster'
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>✨ Each username creates a unique monster</p>
          <p>🎮 Care for your monster daily</p>
          <p>🌟 Watch them grow and evolve</p>
        </div>
      </div>
    </div>
  );
}; 