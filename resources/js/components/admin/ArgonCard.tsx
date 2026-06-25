import React from 'react';

interface ArgonCardProps {
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

const ArgonCard: React.FC<ArgonCardProps> = ({ title, subtitle, headerRight, children, footer, className = '', noPadding = false }) => {
  return (
    <div className={`relative flex flex-col min-w-0 break-words bg-white border-0 border-transparent border-solid shadow-xl rounded-2xl bg-clip-border ${className}`}>
      {(title || headerRight) && (
        <div className="p-6 pb-0 mb-0 border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
          <div className="flex flex-wrap items-center justify-between">
            <div>
              {title && <h6 className="mb-1 text-slate-700 font-semibold">{title}</h6>}
              {subtitle && <p className="mb-0 text-sm leading-normal text-slate-400">{subtitle}</p>}
            </div>
            {headerRight && <div>{headerRight}</div>}
          </div>
        </div>
      )}
      <div className={noPadding ? 'flex-auto px-0 pt-0 pb-2' : 'flex-auto p-6'}>
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 rounded-b-2xl">
          {footer}
        </div>
      )}
    </div>
  );
};

export default ArgonCard;
