import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { X, UserPlus, Check } from 'lucide-react';

interface AddFriendModalProps {
  onClose: () => void;
}

export const AddFriendModal: React.FC<AddFriendModalProps> = ({ onClose }) => {
  const [friendCode, setFriendCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addFriend, error, setError } = useGameStore();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      await addFriend(friendCode);
      setSuccess(true);
      setFriendCode('');
    } catch (error) {
      // Error handled by store
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFriendCode('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl border border-blue-400/30 shadow-2xl p-6 w-full max-w-md backdrop-blur-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-400/20 rounded-lg">
              <UserPlus className="w-5 h-5 text-blue-700" />
            </div>
            <h3 className="text-xl font-bold text-blue-800">Add a Friend</h3>
          </div>
          <button
            onClick={handleCancel}
            className="text-blue-400 hover:text-blue-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="friendCode" className="block text-sm font-medium text-blue-700 mb-2">
              Friend Code (UUID)
            </label>
            <input
              type="text"
              id="friendCode"
              value={friendCode}
              onChange={(e) => setFriendCode(e.target.value)}
              placeholder="Enter your friend's code..."
              className="w-full px-4 py-3 bg-white/15 border-2 border-blue-400/20 rounded-xl text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
              maxLength={36}
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          {/* Error display */}
          {error && (
            <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400/50 rounded-lg p-3 text-green-700 text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />
              Friend added!
            </div>
          )}

          {/* Action buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-blue-200/50 hover:bg-blue-200/70 text-blue-900 font-medium rounded-xl transition-all duration-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !friendCode.trim()}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Add Friend</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 