import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Edit3, X, Check, Sparkles } from 'lucide-react';

interface RenameUsernameProps {
  currentName: string;
  onClose: () => void;
}

export const RenameUsername: React.FC<RenameUsernameProps> = ({ currentName, onClose }) => {
  const [newName, setNewName] = useState(currentName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { renameUsername, error, setError } = useGameStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() === currentName) {
      onClose();
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await renameUsername(newName);
      onClose();
    } catch (error) {
      // Error is handled by the store
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setNewName(currentName);
    setError(null);
    onClose();
  };

  const isValidName = newName.trim().length > 2 && newName.trim().length <= 20;
  const hasChanged = newName.trim() !== currentName;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl border border-yellow-400/30 shadow-2xl p-6 w-full max-w-md backdrop-blur-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-yellow-400/20 rounded-lg">
              <Edit3 className="w-5 h-5 text-yellow-700" />
            </div>
            <h3 className="text-xl font-bold text-yellow-800">Change Display Name</h3>
          </div>
          <button
            onClick={handleCancel}
            className="text-yellow-400 hover:text-yellow-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-yellow-700 mb-2">
              New Display Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="displayName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new display name..."
                className="w-full px-4 py-3 bg-white/15 border-2 border-yellow-400/20 rounded-xl text-yellow-900 placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300"
                maxLength={20}
                disabled={isSubmitting}
                autoFocus
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Sparkles className={`w-4 h-4 ${isValidName ? 'text-green-400' : 'text-yellow-400'}`} />
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-yellow-500">
                {newName.length}/20 characters
              </span>
              {hasChanged && (
                <span className="text-xs text-yellow-700 font-medium">
                  ✨ Name changed!
                </span>
              )}
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-yellow-200/50 hover:bg-yellow-200/70 text-yellow-900 font-medium rounded-xl transition-all duration-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isValidName || !hasChanged}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Fun tip */}
        <div className="mt-4 p-3 bg-yellow-200/30 border border-yellow-400/20 rounded-lg">
          <p className="text-sm text-yellow-700">
            💡 This name is just for display. You will still log in with your email.
          </p>
        </div>
      </div>
    </div>
  );
}; 