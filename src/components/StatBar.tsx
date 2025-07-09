import React from 'react';

interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
  showValue?: boolean;
}

export const StatBar: React.FC<StatBarProps> = ({ 
  label, 
  value, 
  maxValue = 100, 
  color = 'bg-blue-500',
  showValue = true 
}) => {
  const percentage = Math.min(100, (value / maxValue) * 100);
  
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-800">{label}</span>
        {showValue && (
          <span className="text-xs text-gray-700">{value}/{maxValue}</span>
        )}
      </div>
      <div className="stat-bar">
        <div 
          className={`stat-fill ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}; 