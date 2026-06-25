import React from 'react';

interface ArgonStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  footer?: React.ReactNode;
}

const ArgonStatCard: React.FC<ArgonStatCardProps> = ({ title, value, icon, gradient, footer }) => {
  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white shadow-xl rounded-2xl bg-clip-border hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex-auto p-4">
        <div className="flex flex-row -mx-3">
          <div className="flex-none w-2/3 max-w-full px-3">
            <div>
              <p className="mb-0 font-sans text-sm font-semibold leading-normal uppercase text-slate-400">
                {title}
              </p>
              <h5 className="mb-2 font-bold text-slate-700 text-xl">{value}</h5>
              {footer && (
                <p className="mb-0 text-sm">
                  {footer}
                </p>
              )}
            </div>
          </div>
          <div className="px-3 text-right basis-1/3">
            <div className={`inline-block w-12 h-12 text-center rounded-full ${gradient} shadow-lg`}>
              <div className="flex items-center justify-center w-full h-full text-white">
                {icon}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArgonStatCard;
