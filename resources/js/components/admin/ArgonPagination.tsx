import React from 'react';
import { Link } from '@inertiajs/react';

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface ArgonPaginationProps {
  links: PaginationLink[];
  from?: number;
  to?: number;
  total?: number;
}

const ArgonPagination: React.FC<ArgonPaginationProps> = ({ links, from, to, total }) => {
  if (!links || links.length <= 3) return null;

  return (
    <div className="p-4 border-t border-gray-100">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {from && to && total && (
          <div className="text-sm text-slate-400">
            Menampilkan <span className="font-semibold text-slate-600">{from}</span> - <span className="font-semibold text-slate-600">{to}</span> dari <span className="font-semibold text-slate-600">{total}</span> data
          </div>
        )}

        <div className="flex items-center space-x-1">
          {links.map((link, i) => (
            <Link
              key={i}
              href={link.url || '#'}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                link.active
                  ? 'bg-gradient-to-tl from-orange-500 to-yellow-500 text-white shadow-md'
                  : link.url
                    ? 'bg-white text-slate-500 hover:bg-gray-100 hover:text-slate-700 border border-gray-200'
                    : 'bg-gray-50 text-slate-300 cursor-default border border-gray-100'
              }`}
              preserveScroll
            >
              <span dangerouslySetInnerHTML={{ __html: link.label }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArgonPagination;
