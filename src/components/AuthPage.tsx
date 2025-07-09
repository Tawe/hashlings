import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured } from '../utils/supabaseClient';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, register, isLoading, error } = useGameStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      await login(email, password);
    } else {
      await register(email, password);
    }
  };

  // Show setup message if Supabase is not configured
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🐾 Hashlings
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Setup Required
            </p>
          </div>

          <div className="monster-card p-8">
            <div className="flex items-center mb-4 text-yellow-400">
              <AlertCircle className="w-6 h-6 mr-2" />
              <span className="font-semibold">Supabase Configuration Required</span>
            </div>
            
            <p className="text-gray-300 mb-4">
              To use authentication features, you need to set up Supabase:
            </p>
            
            <ol className="text-gray-300 text-sm space-y-2 mb-6">
              <li>1. Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">supabase.com</a> and create a free account</li>
              <li>2. Create a new project</li>
              <li>3. Go to Project Settings → API</li>
              <li>4. Copy your Project URL and anon public key</li>
              <li>5. Create a <code className="bg-gray-700 px-1 rounded">.env</code> file in your project root</li>
              <li>6. Add your credentials:</li>
            </ol>
            
            <div className="bg-gray-800 p-4 rounded-lg text-sm font-mono text-gray-300">
              REACT_APP_SUPABASE_URL=your-project-url<br/>
              REACT_APP_SUPABASE_ANON_KEY=your-anon-key
            </div>
            
            <p className="text-gray-400 text-sm mt-4">
              After setting up, restart your development server.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-md w-full z-10">
        {/* Header with fun animations */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <h1 className="text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              🐾 Hashlings
            </h1>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-semibold text-white mb-2">
              {isLogin ? 'Welcome Back, Trainer!' : 'Join the Adventure!'}
            </p>
            <p className="text-gray-300 text-lg">
              {isLogin 
                ? 'Your monster is waiting for you!' 
                : 'Create your first monster companion'
              }
            </p>
          </div>
        </div>

        {/* Main card with glassmorphism effect */}
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field with fun styling */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-2 flex items-center">
                <Mail className="w-4 h-4 mr-2 text-purple-300" />
                Email Address
              </label>
              <div className="relative group">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trainer@hashlings.com"
                  className="w-full pl-4 pr-4 py-4 bg-white/15 border-2 border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 group-hover:border-purple-300"
                  disabled={isLoading}
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Password field with fun styling */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-white mb-2 flex items-center">
                <Lock className="w-4 h-4 mr-2 text-purple-300" />
                Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-12 py-4 bg-white/15 border-2 border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 group-hover:border-purple-300"
                  disabled={isLoading}
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error display with better styling */}
            {error && (
              <div className="bg-red-500/20 border-2 border-red-400/50 rounded-xl p-4 text-red-200 text-sm backdrop-blur-sm">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-red-300" />
                  {error}
                </div>
              </div>
            )}

            {/* Submit button with fun animations */}
            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password.trim()}
              className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  <span className="text-lg">
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </span>
                </div>
              ) : (
                <span className="text-lg">
                  {isLogin ? '🚀 Sign In' : '✨ Create Account'}
                </span>
              )}
            </button>
          </form>

          {/* Toggle between login/signup */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              {isLogin 
                ? "🎮 New trainer? Create an account" 
                : "🔑 Already have an account? Sign in"
              }
            </button>
          </div>
        </div>

        {/* Fun features list */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-1 gap-3 text-gray-300">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">✨</span>
              <span>Create unique monsters from your email</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🎮</span>
              <span>Feed, train, and care for your monster daily</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🌟</span>
              <span>Watch them grow and evolve over time</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">💾</span>
              <span>Your progress is saved automatically</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 