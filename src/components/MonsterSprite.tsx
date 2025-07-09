import React from 'react';
import { Monster } from '../types/game';
import { getElementColor } from '../utils/monsterGenerator';

interface MonsterSpriteProps {
  monster: Monster;
  size?: number;
  className?: string;
}

export const MonsterSprite: React.FC<MonsterSpriteProps> = ({ 
  monster, 
  size = 200,
  className = ''
}) => {
  const elementColor = getElementColor(monster.element);
  
  // Simple SVG representation based on species
  const getSpritePath = () => {
    switch (monster.species) {
      case 'Drake':
        return (
          <path 
            d="M50 150 Q100 50 150 150 L150 180 L50 180 Z" 
            fill={elementColor === 'monster-fire' ? '#ff6b35' : '#4ecdc4'}
            stroke="#fff"
            strokeWidth="2"
          />
        );
      case 'Golem':
        return (
          <rect 
            x="60" y="100" width="80" height="80" 
            fill={elementColor === 'monster-metal' ? '#95a5a6' : '#8b4513'}
            stroke="#fff"
            strokeWidth="2"
            rx="10"
          />
        );
      case 'Phoenix':
        return (
          <path 
            d="M100 50 Q120 30 140 50 Q120 70 100 50 M80 80 Q100 60 120 80" 
            fill={elementColor === 'monster-fire' ? '#ff6b35' : '#f1c40f'}
            stroke="#fff"
            strokeWidth="2"
          />
        );
      default:
        return (
          <circle 
            cx="100" cy="100" r="40" 
            fill={elementColor === 'monster-fire' ? '#ff6b35' : '#4ecdc4'}
            stroke="#fff"
            strokeWidth="2"
          />
        );
    }
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 200 200"
        className="drop-shadow-lg"
      >
        {/* Background glow */}
        <defs>
          <radialGradient id={`glow-${monster.element}`}>
            <stop offset="0%" stopColor={`var(--tw-gradient-from-${elementColor})`} stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        
        {/* Glow effect */}
        <circle 
          cx="100" cy="100" r="80" 
          fill={`url(#glow-${monster.element})`}
        />
        
        {/* Monster sprite */}
        {getSpritePath()}
        
        {/* Element indicator */}
        <circle 
          cx="160" cy="40" r="15" 
          fill={`bg-${elementColor}`}
          stroke="#fff"
          strokeWidth="2"
        />
        <text 
          x="160" y="45" 
          textAnchor="middle" 
          fill="#fff" 
          fontSize="12" 
          fontWeight="bold"
        >
          {monster.element.charAt(0)}
        </text>
        
        {/* Size indicator */}
        <text 
          x="100" y="190" 
          textAnchor="middle" 
          fill="#fff" 
          fontSize="14" 
          fontWeight="bold"
        >
          {monster.sizeCategory}
        </text>
      </svg>
    </div>
  );
}; 