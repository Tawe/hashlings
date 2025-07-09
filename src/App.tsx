import React, { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { LandingPage } from './components/LandingPage';
import { MonsterProfile } from './components/MonsterProfile';
import { AuthPage } from './components/AuthPage';
import { supabase } from './utils/supabaseClient';

function ConfirmEmailScreen({ email }: { email: string }) {
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [resendMessage, setResendMessage] = useState('');

  const handleResend = async () => {
    setResendStatus('loading');
    setResendMessage('');
    if (!supabase) {
      setResendStatus('error');
      setResendMessage('Supabase is not configured.');
      return;
    }
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) {
      setResendStatus('error');
      setResendMessage('Failed to resend confirmation email. Please try again later.');
    } else {
      setResendStatus('success');
      setResendMessage('Confirmation email resent! Please check your inbox.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-yellow-100 to-yellow-200">
      <div className="max-w-md w-full bg-white/80 rounded-2xl shadow-xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4 text-yellow-700">Confirm Your Email</h2>
        <p className="text-lg text-yellow-800 mb-4">
          Please confirm your email address to start playing Hashlings.
        </p>
        <p className="mb-6 text-yellow-700">
          We sent a confirmation link to:
          <br />
          <span className="font-mono text-yellow-900">{email}</span>
        </p>
        <p className="text-sm text-yellow-600 mb-2">
          Didn&apos;t get the email? Check your spam folder or click below to resend.
        </p>
        <div className="flex flex-col gap-3 items-center">
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            onClick={() => window.location.reload()}
          >
            I&apos;ve Confirmed My Email
          </button>
          <button
            className="bg-white border border-yellow-400 text-yellow-700 font-semibold px-6 py-2 rounded-lg transition-colors hover:bg-yellow-100 disabled:opacity-50"
            onClick={handleResend}
            disabled={resendStatus === 'loading'}
          >
            {resendStatus === 'loading' ? 'Resending...' : 'Resend Confirmation Email'}
          </button>
          {resendStatus !== 'idle' && (
            <div className={
              resendStatus === 'success'
                ? 'text-green-700 font-medium'
                : 'text-red-700 font-medium'
            }>
              {resendMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const { monster, isLoading, error, setError, isAuthenticated, initializeAuth, authUser } = useGameStore();

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

  // Check for email confirmation
  const isEmailConfirmed = authUser?.email_confirmed_at || authUser?.confirmed_at;

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
      ) : !isEmailConfirmed ? (
        <ConfirmEmailScreen email={authUser?.email || ''} />
      ) : monster ? (
        <MonsterProfile />
      ) : (
        <LandingPage />
      )}
    </div>
  );
}

export default App;
