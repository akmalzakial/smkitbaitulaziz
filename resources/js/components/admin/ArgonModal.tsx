import React, { useEffect } from 'react';

interface ArgonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  iconBg?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

const ArgonModal: React.FC<ArgonModalProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  iconBg = 'bg-red-100',
  children,
  footer,
  maxWidth = 'sm:max-w-lg',
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed z-[100] inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity duration-300"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal Content */}
        <div className={`inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all duration-300 sm:my-8 sm:align-middle ${maxWidth} sm:w-full animate-[fadeUp_0.3s_ease-out]`}>
          {/* Header */}
          <div className="bg-white px-6 pt-6 pb-4">
            <div className="flex items-start">
              {icon && (
                <div className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl ${iconBg} sm:mx-0`}>
                  {icon}
                </div>
              )}
              <div className={`${icon ? 'ml-4' : ''} text-left flex-1`}>
                <h3 className="text-lg leading-6 font-semibold text-slate-700">{title}</h3>
                <div className="mt-2">
                  {children}
                </div>
              </div>
              <button
                onClick={onClose}
                className="ml-auto -mt-1 p-1 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                <i className="fas fa-times" />
              </button>
            </div>
          </div>

          {/* Footer */}
          {footer && (
            <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArgonModal;
