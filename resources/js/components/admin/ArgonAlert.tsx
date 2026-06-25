import React from 'react';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface ArgonAlertProps {
  variant: AlertVariant;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const variantConfig: Record<AlertVariant, { bg: string; border: string; text: string; icon: string }> = {
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    icon: 'fas fa-check-circle text-emerald-500',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    icon: 'fas fa-exclamation-circle text-red-500',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    icon: 'fas fa-exclamation-triangle text-amber-500',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    icon: 'fas fa-info-circle text-blue-500',
  },
};

const ArgonAlert: React.FC<ArgonAlertProps> = ({ variant, children, onClose, className = '' }) => {
  const config = variantConfig[variant];

  return (
    <div className={`${config.bg} ${config.border} border ${config.text} px-4 py-3 rounded-xl relative flex items-start gap-3 ${className}`} role="alert">
      <i className={`${config.icon} mt-0.5`} />
      <div className="flex-1 text-sm">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto opacity-50 hover:opacity-100 transition-opacity"
        >
          <i className="fas fa-times text-sm" />
        </button>
      )}
    </div>
  );
};

export default ArgonAlert;
