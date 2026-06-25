import React from 'react';

interface HeaderConfig {
  label: string;
  align?: 'left' | 'center' | 'right';
}

interface ArgonTableProps {
  headers: (string | HeaderConfig)[];
  children: React.ReactNode;
}

const ArgonTable: React.FC<ArgonTableProps> = ({ headers, children }) => {
  return (
    <div className="p-0 overflow-x-auto">
      <table className="items-center w-full mb-0 align-top border-collapse dark:border-white/40 text-slate-500">
        <thead className="align-bottom">
          <tr>
            {headers.map((header, idx) => {
              const label = typeof header === 'string' ? header : header.label;
              const align = typeof header === 'string' 
                ? (idx === 0 ? 'left' : idx === headers.length - 1 ? 'right' : 'left')
                : (header.align || 'left');

              const alignmentClass = 
                align === 'center' 
                  ? 'text-center' 
                  : align === 'right' 
                  ? 'text-right' 
                  : 'text-left';

              return (
                <th
                  key={idx}
                  className={`px-6 py-3 font-bold uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70 ${alignmentClass}`}
                >
                  {label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default ArgonTable;
