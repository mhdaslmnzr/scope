// frontend/components/ui/Badge.tsx
import React from 'react';

type Tone = 'blue' | 'green' | 'red' | 'purple' | 'gray' | 'yellow' | 'orange' | 'teal';

interface BadgeProps {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}

const toneMap: Record<Tone, string> = {
  blue: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
  green: 'bg-green-100 text-green-700 ring-1 ring-green-200',
  red: 'bg-red-100 text-red-700 ring-1 ring-red-200',
  purple: 'bg-purple-100 text-purple-700 ring-1 ring-purple-200',
  gray: 'bg-gray-100 text-gray-700 ring-1 ring-gray-200',
  yellow: 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200',
  orange: 'bg-orange-100 text-orange-700 ring-1 ring-orange-200',
  teal: 'bg-teal-100 text-teal-700 ring-1 ring-teal-200',
};

const Badge: React.FC<BadgeProps> = ({ children, tone = 'blue', className = '' }) => (
  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${toneMap[tone]} ${className}`}>{children}</span>
);

export default Badge;
