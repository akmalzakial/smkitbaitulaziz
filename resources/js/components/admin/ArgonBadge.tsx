import React from 'react';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'default' | 'purple';

interface ArgonBadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  gradient?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, { solid: string; gradient: string }> = {
  success: {
    solid: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    gradient: 'bg-gradient-to-tl from-emerald-500 to-teal-400 text-white',
  },
  danger: {
    solid: 'bg-red-100 text-red-700 border border-red-200',
    gradient: 'bg-gradient-to-tl from-red-600 to-orange-600 text-white',
  },
  warning: {
    solid: 'bg-amber-100 text-amber-700 border border-amber-200',
    gradient: 'bg-gradient-to-tl from-amber-500 to-yellow-500 text-white',
  },
  info: {
    solid: 'bg-blue-100 text-blue-700 border border-blue-200',
    gradient: 'bg-gradient-to-tl from-blue-500 to-cyan-500 text-white',
  },
  purple: {
    solid: 'bg-purple-100 text-purple-700 border border-purple-200',
    gradient: 'bg-gradient-to-tl from-purple-600 to-violet-500 text-white',
  },
  default: {
    solid: 'bg-gray-100 text-gray-600 border border-gray-200',
    gradient: 'bg-gradient-to-tl from-slate-600 to-slate-300 text-white',
  },
};

const ArgonBadge: React.FC<ArgonBadgeProps> = ({ variant = 'default', children, gradient = false, className = '' }) => {
  const classes = gradient ? variantClasses[variant].gradient : variantClasses[variant].solid;
  
  return (
    <span className={`px-2.5 text-xs rounded-lg py-1.5 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none ${classes} ${className}`}>
      {children}
    </span>
  );
};

export default ArgonBadge;
