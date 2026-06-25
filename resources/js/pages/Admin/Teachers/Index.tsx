import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import ArgonStatCard from '@/components/admin/ArgonStatCard';
import ArgonCard from '@/components/admin/ArgonCard';
import ArgonTable from '@/components/admin/ArgonTable';
import ArgonBadge from '@/components/admin/ArgonBadge';
import ArgonPagination from '@/components/admin/ArgonPagination';
import ArgonFormInput from '@/components/admin/ArgonFormInput';

interface Teacher {
  id: number;
  name: string;
  nip: string | null;
  position: string;
  subject: string | null;
  photo: string | null;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
  education: string | null;
  order: number;
  is_active: boolean;
  type: 'struktur' | 'guru';
  created_at: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface Props {
  teachers: {
    data: Teacher[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
  };
  filters: {
    search?: string;
    type?: string;
    status?: string;
  };
  stats: {
    total: number;
    struktur: number;
    guru: number;
    active: number;
  };
}

export default function TeachersIndex({ teachers, filters, stats }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [type, setType] = useState(filters.type || '');
  const [status, setStatus] = useState(filters.status || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/admin/teachers', { search, type, status }, { preserveState: true });
  };

  const handleDelete = (teacher: Teacher) => {
    if (confirm(`Apakah Anda yakin ingin menghapus ${teacher.name}?`)) {
      router.delete(`/admin/teachers/${teacher.id}`, {
        preserveScroll: true,
      });
    }
  };

  const resetFilters = () => {
    setSearch('');
    setType('');
    setStatus('');
    router.get('/admin/teachers', {}, { preserveState: true });
  };

  return (
    <AdminLayout>
      <Head title="Kelola Guru & Struktur" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Kelola Guru & Struktur</h1>
        <p className="text-white/80 text-sm">Manajemen data guru dan struktur organisasi SMK IT Baitul Aziz.</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <ArgonStatCard
          title="Total Data"
          value={stats.total}
          icon={<i className="ni ni-collection text-lg" />}
          gradient="bg-gradient-to-tl from-blue-500 to-violet-500"
          footer={<span className="text-slate-400 text-xs">Total Guru & Staff</span>}
        />
        <ArgonStatCard
          title="Struktur Organisasi"
          value={stats.struktur}
          icon={<i className="ni ni-settings text-lg" />}
          gradient="bg-gradient-to-tl from-purple-600 to-violet-500"
          footer={<span className="text-slate-400 text-xs">Pengurus & Staff</span>}
        />
        <ArgonStatCard
          title="Tenaga Pengajar"
          value={stats.guru}
          icon={<i className="ni ni-hat-3 text-lg" />}
          gradient="bg-gradient-to-tl from-emerald-500 to-teal-400"
          footer={<span className="text-slate-400 text-xs">Guru Bidang Studi</span>}
        />
        <ArgonStatCard
          title="Status Aktif"
          value={stats.active}
          icon={<i className="ni ni-single-02 text-lg" />}
          gradient="bg-gradient-to-tl from-orange-500 to-yellow-500"
          footer={<span className="text-slate-400 text-xs">Pendidik Aktif</span>}
        />
      </div>

      {/* Main card */}
      <ArgonCard
        title="Daftar Guru & Staff"
        headerRight={
          <Link
            href="/admin/teachers/create"
            className="inline-block px-4 py-2 bg-gradient-to-tl from-orange-500 to-yellow-500 text-white text-xs font-bold uppercase rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-px"
          >
            <i className="fas fa-plus mr-1.5" /> Tambah Data
          </Link>
        }
        noPadding
      >
        {/* Filters Form */}
        <div className="p-6 pb-2">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <ArgonFormInput
                  label="Cari Guru/Staff"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama, NIP, atau jabatan..."
                  icon="fas fa-search"
                  wrapperClassName="mb-0"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                  Tipe
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="text-sm w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-slate-700 focus:border-orange-500 focus:outline-none"
                >
                  <option value="">Semua Tipe</option>
                  <option value="struktur">Struktur</option>
                  <option value="guru">Guru</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="text-sm w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-slate-700 focus:border-orange-500 focus:outline-none"
                >
                  <option value="">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-tl from-orange-500 to-yellow-500 text-white text-xs font-bold uppercase rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <i className="fas fa-filter mr-1.5" /> Terapkan Filter
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 text-xs font-bold uppercase text-slate-400 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Table Layout */}
        <ArgonTable
          headers={[
            'Foto',
            'Nama',
            'NIP',
            'Jabatan',
            { label: 'Tipe', align: 'left' },
            { label: 'Status', align: 'left' },
            'Urutan',
            { label: 'Aksi', align: 'right' }
          ]}
        >
          {teachers.data.length === 0 ? (
            <tr>
              <td colSpan={8} className="p-8 text-center text-slate-400 text-sm">
                Tidak ada data guru atau staff yang ditemukan.
              </td>
            </tr>
          ) : (
            teachers.data.map((teacher) => (
              <tr key={teacher.id}>
                {/* Photo */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shadow-sm border border-gray-100">
                    {teacher.photo_url ? (
                      <img
                        src={teacher.photo_url}
                        alt={teacher.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <i className="fas fa-user text-sm" />
                      </div>
                    )}
                  </div>
                </td>

                {/* Name & Email */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                  <div className="flex flex-col justify-center">
                    <h6 className="mb-0 text-sm font-semibold leading-normal text-slate-700">
                      {teacher.name}
                    </h6>
                    {teacher.email && (
                      <p className="mb-0 text-xs text-slate-400">{teacher.email}</p>
                    )}
                  </div>
                </td>

                {/* NIP */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                  <span className="text-xs font-semibold leading-tight text-slate-500">
                    {teacher.nip || '-'}
                  </span>
                </td>

                {/* Position / Subject */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                  <div className="flex flex-col justify-center">
                    <span className="text-xs font-semibold leading-tight text-slate-700">{teacher.position}</span>
                    {teacher.subject && (
                      <span className="text-xxs text-slate-400">{teacher.subject}</span>
                    )}
                  </div>
                </td>

                {/* Type */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                  {teacher.type === 'struktur' ? (
                    <ArgonBadge variant="purple">Struktur</ArgonBadge>
                  ) : (
                    <ArgonBadge variant="info">Guru</ArgonBadge>
                  )}
                </td>

                {/* Status */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                  {teacher.is_active ? (
                    <ArgonBadge variant="success" gradient>Aktif</ArgonBadge>
                  ) : (
                    <ArgonBadge variant="danger">Nonaktif</ArgonBadge>
                  )}
                </td>

                {/* Order */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent text-xs font-semibold leading-tight text-slate-500">
                  {teacher.order}
                </td>

                {/* Actions */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      href={`/admin/teachers/${teacher.id}/edit`}
                      className="inline-flex items-center justify-center w-8 h-8 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <i className="fas fa-edit text-xs" />
                    </Link>
                    <button
                      onClick={() => handleDelete(teacher)}
                      className="inline-flex items-center justify-center w-8 h-8 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      <i className="fas fa-trash text-xs" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </ArgonTable>

        {/* Pagination */}
        <ArgonPagination
          links={teachers.links}
          from={teachers.data.length ? (teachers.current_page - 1) * teachers.per_page + 1 : 0}
          to={teachers.data.length ? (teachers.current_page - 1) * teachers.per_page + teachers.data.length : 0}
          total={teachers.total}
        />
      </ArgonCard>
    </AdminLayout>
  );
}
