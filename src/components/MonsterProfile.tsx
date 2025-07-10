import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { MonsterSprite } from './MonsterSprite';
import { StatBar } from './StatBar';
import { RenameMonster } from './RenameMonster';
import { Heart, Zap, Shield, Brain, Eye, LogOut, Edit3 } from 'lucide-react';
import { RenameUsername } from './RenameUsername';
import { AddFriendModal } from './AddFriendModal';

export const MonsterProfile: React.FC = () => {
  const { monster, user, actions, performMonsterAction, setError, logout, friends, fetchFriends } = useGameStore();
  const [showRename, setShowRename] = useState(false);
  const [showRenameUsername, setShowRenameUsername] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);

  if (!monster || !user) {
    return <div>No monster found!</div>;
  }

  useEffect(() => {
    fetchFriends && fetchFriends();
  }, [fetchFriends]);

  const handleAction = (actionType: 'feed' | 'train' | 'rest') => {
    try {
      performMonsterAction(actionType);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Action failed');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Logout failed');
    }
  };

  const canPerformAction = monster.actionsToday < 3;

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
          <div className="text-right">
            <p className="text-sm text-gray-400">Trainer</p>
            <div className="flex items-center justify-end gap-2">
              <p className="text-lg font-semibold">{user.username}</p>
              <button
                onClick={() => setShowRenameUsername(true)}
                className="p-1 text-gray-400 hover:text-purple-400 transition-colors duration-200 hover:scale-110"
                title="Edit display name"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">Friend Code:</span>
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 select-all">{user.uuid}</span>
              <button
                className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                onClick={() => setShowAddFriend(true)}
              >
                Add Friend
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monster Display */}
          <div className="monster-card p-6">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <h2 className="text-2xl font-bold">{monster.name}</h2>
                <button
                  onClick={() => setShowRename(true)}
                  className="p-1 text-gray-400 hover:text-purple-400 transition-colors duration-200 hover:scale-110"
                  title="Rename monster"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
                <span className={`px-2 py-1 rounded-full text-xs font-medium element-${monster.element.toLowerCase()}`}>
                  {monster.element}
                </span>
                <span className="px-2 py-1 rounded-full bg-gray-600 text-xs">
                  {monster.species}
                </span>
                <span className="px-2 py-1 rounded-full bg-gray-600 text-xs">
                  {monster.sizeCategory}
                </span>
              </div>
            </div>

            <MonsterSprite monster={monster} size={250} className="mb-4" />

            <div className="text-center text-sm text-gray-700">
              <p>Stage {monster.stage} • Created {monster.createdAt.toLocaleDateString()}</p>
              <p className="mt-2">
                Actions today: {monster.actionsToday}/3
              </p>
            </div>
          </div>

          {/* Stats and Actions */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="monster-card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Stats
              </h3>
              
              <div className="space-y-3">
                <StatBar 
                  label="Strength" 
                  value={monster.stats.strength} 
                  color="bg-red-500"
                />
                <StatBar 
                  label="Intelligence" 
                  value={monster.stats.intelligence} 
                  color="bg-blue-500"
                />
                <StatBar 
                  label="Fortitude" 
                  value={monster.stats.fortitude} 
                  color="bg-green-500"
                />
                <StatBar 
                  label="Agility" 
                  value={monster.stats.agility} 
                  color="bg-yellow-500"
                />
                <StatBar 
                  label="Perception" 
                  value={monster.stats.perception} 
                  color="bg-purple-500"
                />
                <StatBar 
                  label="Mood" 
                  value={monster.stats.mood} 
                  color="bg-pink-500"
                />
                <StatBar 
                  label="Energy" 
                  value={monster.stats.energy} 
                  color="bg-cyan-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="monster-card p-6">
              <h3 className="text-xl font-semibold mb-4">Daily Actions</h3>
              
              {!canPerformAction && (
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-yellow-800 text-sm font-semibold flex items-center gap-2 mb-4">
                  <span role="img" aria-label="clock">⏰</span>
                  You've used all your actions for today! Come back tomorrow.
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => handleAction('feed')}
                  disabled={!canPerformAction}
                  className="action-button bg-gradient-to-r from-green-600 to-emerald-600 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Feed Monster
                </button>
                
                <button
                  onClick={() => handleAction('train')}
                  disabled={!canPerformAction}
                  className="action-button bg-gradient-to-r from-blue-600 to-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Train Monster
                </button>
                
                <button
                  onClick={() => handleAction('rest')}
                  disabled={!canPerformAction}
                  className="action-button bg-gradient-to-r from-purple-600 to-pink-600 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Rest Monster
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Log */}
        {actions.length > 0 && (
          <div className="mt-8 monster-card p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Recent Actions
            </h3>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {actions.slice(0, 10).map((action) => (
                <div 
                  key={action.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      action.actionType === 'feed' ? 'bg-green-600' :
                      action.actionType === 'train' ? 'bg-blue-600' :
                      action.actionType === 'rename' ? 'bg-purple-600' :
                      'bg-purple-600'
                    }`}>
                      {action.actionType.charAt(0).toUpperCase() + action.actionType.slice(1)}
                    </span>
                    <span className="text-sm text-gray-700">
                      {action.result.message}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600">
                    {action.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Friends List */}
      <div className="monster-card p-6 mt-8">
        <h3 className="text-lg font-semibold mb-2 text-blue-700">Friends</h3>
        {friends && friends.length > 0 ? (
          <ul className="space-y-2">
            {friends.map((f) => (
              <li key={f.uuid} className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{f.username}</span>
                <span className="font-mono text-xs text-gray-400">{f.uuid}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No friends yet.</p>
        )}
      </div>

      {/* Rename Modal */}
      {showRename && (
        <RenameMonster
          currentName={monster.name}
          onClose={() => setShowRename(false)}
        />
      )}
      {/* Rename Username Modal */}
      {showRenameUsername && (
        <RenameUsername
          currentName={user.username}
          onClose={() => setShowRenameUsername(false)}
        />
      )}
      {/* Add Friend Modal */}
      {showAddFriend && (
        <AddFriendModal onClose={() => setShowAddFriend(false)} />
      )}
    </div>
  );
}; 