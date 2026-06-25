import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import ArgonCard from '@/components/admin/ArgonCard';
import ArgonStatCard from '@/components/admin/ArgonStatCard';
import ArgonPagination from '@/components/admin/ArgonPagination';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface MessagesProps {
  messages: {
    data: ContactMessage[];
    links: PaginationLink[];
    from: number;
    to: number;
    total: number;
  };
  filters: {
    search?: string;
    status?: string;
  };
  stats: {
    total: number;
    unread: number;
    read: number;
  };
  flash?: {
    success?: string;
  };
}

export default function Index({ messages, filters, stats, flash }: MessagesProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('admin.messages.index'), { search, status }, { preserveState: true });
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    router.get(route('admin.messages.index'), { search, status: newStatus }, { preserveState: true });
  };

  const markAsRead = (id: number) => {
    router.put(route('admin.messages.read', id), {}, { preserveScroll: true });
  };

  const deleteMessage = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
      router.delete(route('admin.messages.destroy', id));
    }
  };

  return (
    <AdminLayout>
      <Head title="Pesan Masuk (Inbox)" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Kotak Masuk Pesan</h1>
        <p className="text-white/80 text-sm mt-1">
          Daftar pesan, pertanyaan, atau masukan yang dikirimkan oleh pengunjung melalui halaman kontak.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ArgonStatCard
          title="Total Pesan"
          value={stats.total}
          gradient="bg-gradient-to-tl from-slate-600 to-slate-400"
          icon={<i className="ni ni-email-83 text-lg" />}
        />
        <ArgonStatCard
          title="Pesan Belum Dibaca"
          value={stats.unread}
          gradient="bg-gradient-to-tl from-red-600 to-orange-500"
          icon={<i className="ni ni-notification-70 text-lg" />}
        />
        <ArgonStatCard
          title="Pesan Telah Dibaca"
          value={stats.read}
          gradient="bg-gradient-to-tl from-emerald-600 to-teal-400"
          icon={<i className="ni ni-check-bold text-lg" />}
        />
      </div>

      {flash?.success && (
        <div className="mb-6 p-4 bg-emerald-500 text-white rounded-2xl shadow-lg flex items-center">
          <i className="fas fa-check-circle mr-2 text-lg" />
          <span className="font-semibold text-sm">{flash.success}</span>
        </div>
      )}

      {/* Main Inbox Card */}
      <ArgonCard
        title="Daftar Pesan Masuk"
        headerRight={
          <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-2">
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-xs focus:shadow-primary-outline ease rounded-lg border border-solid border-gray-300 bg-white py-2 px-3 text-gray-700 transition-all placeholder:text-gray-500 focus:outline-none focus:border-orange-500"
            >
              <option value="">Semua Status</option>
              <option value="unread">Belum Dibaca</option>
              <option value="read">Sudah Dibaca</option>
            </select>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Cari pesan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-xs focus:shadow-primary-outline ease w-40 sm:w-60 rounded-lg border border-solid border-gray-300 bg-white py-2 pl-3 pr-8 text-gray-700 transition-all placeholder:text-gray-500 focus:outline-none focus:border-orange-500"
              />
              <button type="submit" className="absolute right-2.5 text-slate-400 hover:text-slate-600">
                <i className="fas fa-search text-xs" />
              </button>
            </div>
          </form>
        }
        noPadding
      >
        <div className="overflow-x-auto">
          <table className="items-center w-full mb-0 align-top border-collapse text-slate-500">
            <thead className="align-bottom">
              <tr>
                <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-[0.65rem] tracking-wider text-slate-400 opacity-70">
                  Pengirim
                </th>
                <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-[0.65rem] tracking-wider text-slate-400 opacity-70">
                  Subjek
                </th>
                <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-[0.65rem] tracking-wider text-slate-400 opacity-70">
                  Status
                </th>
                <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-[0.65rem] tracking-wider text-slate-400 opacity-70">
                  Tanggal
                </th>
                <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-[0.65rem] tracking-wider text-slate-400 opacity-70">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {messages.data.length > 0 ? (
                messages.data.map((msg) => (
                  <tr key={msg.id} className={!msg.is_read ? 'bg-orange-50/30 font-semibold' : ''}>
                    <td className="p-4 align-middle bg-transparent border-b border-gray-200 shadow-none">
                      <div className="flex px-2 py-1">
                        <div className="flex flex-col justify-center">
                          <h6 className={`mb-0 text-sm leading-normal ${!msg.is_read ? 'font-bold text-slate-800' : 'text-slate-700'}`}>
                            {msg.name}
                          </h6>
                          <p className="mb-0 text-xs text-slate-400 leading-normal">
                            {msg.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle bg-transparent border-b border-gray-200 shadow-none">
                      <div className="px-2">
                        <p className={`mb-0 text-sm leading-normal truncate max-w-xs ${!msg.is_read ? 'font-bold text-slate-800' : 'text-slate-700'}`}>
                          {msg.subject}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-center align-middle bg-transparent border-b border-gray-200 shadow-none">
                      <span className={`inline-block px-2.5 py-1 text-xs font-bold text-center uppercase align-baseline rounded-md ${
                        msg.is_read
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {msg.is_read ? 'Dibaca' : 'Baru'}
                      </span>
                    </td>
                    <td className="p-4 text-center align-middle bg-transparent border-b border-gray-200 shadow-none">
                      <span className="text-xs font-semibold text-slate-400">
                        {new Date(msg.created_at).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>
                    <td className="p-4 text-center align-middle bg-transparent border-b border-gray-200 shadow-none">
                      <div className="flex justify-center items-center gap-1.5">
                        <Link
                          href={route('admin.messages.show', msg.id)}
                          className="px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                          title="Baca Pesan"
                        >
                          Detail
                        </Link>
                        {!msg.is_read && (
                          <button
                            onClick={() => markAsRead(msg.id)}
                            className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                            title="Tandai Dibaca"
                          >
                            <i className="fas fa-check" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                          title="Hapus Pesan"
                        >
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm text-slate-400 bg-transparent border-b border-gray-200">
                    Tidak ada pesan masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ArgonPagination
          links={messages.links}
          from={messages.from}
          to={messages.to}
          total={messages.total}
        />
      </ArgonCard>
    </AdminLayout>
  );
}
