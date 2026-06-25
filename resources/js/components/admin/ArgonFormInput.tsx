import React from 'react';

interface ArgonFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string; // e.g. "fas fa-user"
  error?: string;
  wrapperClassName?: string;
}

const ArgonFormInput: React.FC<ArgonFormInputProps> = ({
  label,
  icon,
  error,
  id,
  className = '',
  wrapperClassName = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={id}
          className="inline-block mb-2 ml-1 text-xs font-bold uppercase text-slate-400"
        >
          {label}
        </label>
      )}
      <div className="relative flex flex-wrap items-stretch w-full transition-all rounded-lg ease">
        {icon && (
          <span className="text-sm ease absolute z-50 -ml-px flex h-full items-center whitespace-nowrap rounded-lg rounded-tr-none rounded-br-none border border-r-0 border-transparent bg-transparent py-2 px-3 text-center font-normal text-slate-500 transition-all leading-5">
            <i className={icon} />
          </span>
        )}
        <input
          id={id}
          className={`text-sm focus:shadow-primary-outline ease w-full leading-5.6 relative -ml-px block min-w-0 flex-auto rounded-lg border border-solid bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:outline-none focus:transition-shadow ${
            error
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-300 focus:border-orange-500'
          } ${icon ? 'pl-9' : 'pl-3'} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 ml-1 text-xs text-red-500 font-semibold">{error}</p>
      )}
    </div>
  );
};

export default ArgonFormInput;
