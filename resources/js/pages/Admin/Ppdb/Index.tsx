import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import ArgonCard from '@/components/admin/ArgonCard';
import ArgonTable from '@/components/admin/ArgonTable';
import ArgonBadge from '@/components/admin/ArgonBadge';
import ArgonPagination from '@/components/admin/ArgonPagination';
import ArgonFormInput from '@/components/admin/ArgonFormInput';

interface AdminPpdbIndexProps {
  auth: any;
  applications: {
    data: any[];
    links: any[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    [key: string]: any;
  };
  filters?: {
    search?: string;
    status?: string;
    jurusan?: string;
    tahun?: string | number;
  };
}

export default function AdminPpdbIndex({ auth, applications, filters = {} }: AdminPpdbIndexProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data, setData, get, processing } = useForm({
    search: filters.search || '',
    status: filters.status || '',
    jurusan: filters.jurusan || '',
    tahun: filters.tahun || new Date().getFullYear()
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    get(route('admin.spmb.index'), {
      preserveState: true,
      replace: true
    });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setData(e.target.name as any, e.target.value);
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status ? status.toLowerCase() : 'menunggu';

    const statusConfig: Record<string, { variant: string; text: string; icon: string }> = {
      'menunggu': { variant: 'warning', text: 'Menunggu', icon: 'fa fa-clock' },
      'verifikasi': { variant: 'info', text: 'Verifikasi', icon: 'fa fa-user-check' },
      'diterima': { variant: 'success', text: 'Diterima', icon: 'fa fa-check-circle' },
      'ditolak': { variant: 'danger', text: 'Ditolak', icon: 'fa fa-exclamation-triangle' },
      'cadangan': { variant: 'purple', text: 'Cadangan', icon: 'fa fa-book' }
    };

    const config = statusConfig[statusLower] || statusConfig['menunggu'];

    return (
      <ArgonBadge variant={config.variant as any} gradient>
        <i className={`${config.icon} mr-1 text-[10px]`} />
        {config.text}
      </ArgonBadge>
    );
  };

  const deleteApplication = (id: number | string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data pendaftaran ini?')) {
      router.delete(route('admin.spmb.destroy', id), {
        onSuccess: () => {
          // Success notification is handled by Inertia
        },
      });
    }
  };

  return (
    <AdminLayout>
      <Head title="Kelola Pendaftaran SPMB - Admin Dashboard" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Kelola Pendaftaran SPMB</h1>
        <p className="text-white/80 text-sm">
          Kelola dan verifikasi status pendaftaran peserta didik baru SMK IT Baitul Aziz.
        </p>
      </div>

      {/* Main card */}
      <ArgonCard
        title="Daftar Pendaftar"
        headerRight={
          <a
            href={route('admin.spmb.export')}
            className="inline-block px-4 py-2 bg-gradient-to-tl from-orange-500 to-yellow-500 text-white text-xs font-bold uppercase rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-px cursor-pointer"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fas fa-download mr-1.5" /> Export Data
          </a>
        }
        noPadding
      >
        {/* Search and Filters */}
        <div className="p-6 pb-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <ArgonFormInput
                type="text"
                placeholder="Cari nama atau nomor pendaftaran..."
                value={data.search}
                onChange={(e) => setData('search', e.target.value)}
                icon="fas fa-search"
                wrapperClassName="mb-0"
              />
            </form>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="inline-flex items-center px-4 py-2 bg-gray-50 border border-gray-200 text-slate-600 text-xs font-bold uppercase rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
              >
                <i className="fas fa-filter mr-1.5" /> Filter
              </button>
            </div>
          </div>

          {isFilterOpen && (
            <div className="mt-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="status-filter" className="block text-xs font-bold uppercase text-slate-400 mb-2">
                    Status
                  </label>
                  <select
                    id="status-filter"
                    name="status"
                    value={data.status}
                    onChange={handleFilterChange}
                    className="text-sm w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-slate-700 focus:border-orange-500 focus:outline-none"
                    aria-label="Filter berdasarkan status"
                  >
                    <option value="">Semua Status</option>
                    <option value="Menunggu">Menunggu</option>
                    <option value="Verifikasi">Verifikasi</option>
                    <option value="Diterima">Diterima</option>
                    <option value="Ditolak">Ditolak</option>
                    <option value="Cadangan">Cadangan</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="jurusan-filter" className="block text-xs font-bold uppercase text-slate-400 mb-2">
                    Jurusan
                  </label>
                  <select
                    id="jurusan-filter"
                    name="jurusan"
                    value={data.jurusan}
                    onChange={handleFilterChange}
                    className="text-sm w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-slate-700 focus:border-orange-500 focus:outline-none"
                    aria-label="Filter berdasarkan jurusan"
                  >
                    <option value="">Semua Jurusan</option>
                    <option value="PPLG (Program Pengembangan Perangkat Lunak dan Gim)">PPLG (Program Pengembangan Perangkat Lunak dan Gim)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="tahun-filter" className="block text-xs font-bold uppercase text-slate-400 mb-2">
                    Tahun
                  </label>
                  <select
                    id="tahun-filter"
                    name="tahun"
                    value={data.tahun}
                    onChange={handleFilterChange}
                    className="text-sm w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-slate-700 focus:border-orange-500 focus:outline-none"
                    aria-label="Filter berdasarkan tahun"
                  >
                    <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                    <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
                    <option value={new Date().getFullYear() - 2}>{new Date().getFullYear() - 2}</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setData({
                      search: '',
                      status: '',
                      jurusan: '',
                      tahun: new Date().getFullYear()
                    });
                  }}
                  className="px-4 py-2 text-xs font-bold uppercase text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Reset
                </button>

                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={processing}
                  className="px-4 py-2 bg-gradient-to-tl from-orange-500 to-yellow-500 text-white text-xs font-bold uppercase rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Terapkan Filter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table layout */}
        <ArgonTable
          headers={[
            'No. Pendaftaran',
            'Nama Lengkap',
            'Asal Sekolah',
            'Tanggal Daftar',
            { label: 'Status', align: 'left' },
            { label: 'Aksi', align: 'right' }
          ]}
        >
          {applications && Array.isArray(applications.data) && applications.data.length > 0 ? (
            applications.data.map((app) => (
              <tr key={app.id}>
                {/* Registration Number */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent text-sm font-semibold text-slate-700">
                  {app.nomor_pendaftaran}
                </td>

                {/* Full Name */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent text-sm font-semibold text-slate-700">
                  {app.nama_lengkap}
                </td>

                {/* School */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent text-xs font-semibold leading-tight text-slate-500">
                  {app.sekolah_asal}
                </td>

                {/* Registration Date */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent text-xs font-semibold leading-tight text-slate-500">
                  {new Date(app.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </td>

                {/* Status Badge */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                  {getStatusBadge(app.status)}
                </td>

                {/* Actions */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      href={route('admin.spmb.show', app.id)}
                      className="inline-flex items-center justify-center w-8 h-8 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Lihat Detail"
                    >
                      <i className="fas fa-eye text-xs" />
                    </Link>

                    <Link
                      href={`${route('admin.spmb.show', app.id)}?action=edit`}
                      className="inline-flex items-center justify-center w-8 h-8 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded-lg transition-colors"
                      title="Edit Status"
                    >
                      <i className="fas fa-edit text-xs" />
                    </Link>

                    <button
                      type="button"
                      className="inline-flex items-center justify-center w-8 h-8 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                      title="Hapus"
                      onClick={() => deleteApplication(app.id)}
                    >
                      <i className="fas fa-trash text-xs" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-8 text-center text-slate-400 text-sm">
                Tidak ada data pendaftaran yang ditemukan.
              </td>
            </tr>
          )}
        </ArgonTable>

        {/* Pagination links */}
        {applications && applications.links && (
          <ArgonPagination
            links={applications.links}
            from={applications.from}
            to={applications.to}
            total={applications.total}
          />
        )}
      </ArgonCard>
    </AdminLayout>
  );
}