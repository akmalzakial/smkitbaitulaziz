import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import ArgonStatCard from '@/components/admin/ArgonStatCard';
import ArgonCard from '@/components/admin/ArgonCard';
import ArgonTable from '@/components/admin/ArgonTable';
import ArgonBadge from '@/components/admin/ArgonBadge';
import ArgonPagination from '@/components/admin/ArgonPagination';
import ArgonFormInput from '@/components/admin/ArgonFormInput';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface Stats {
  total: number;
  admins: number;
  users: number;
}

export default function UsersIndex({
  auth,
  users,
  filters = {},
  stats
}: {
  auth: any;
  users: any;
  filters?: any;
  stats: Stats;
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data, setData, get, processing } = useForm({
    search: filters.search || '',
    role: filters.role || '',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    get(route('admin.users.index'), {
      preserveState: true,
      replace: true
    });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setData(e.target.name as any, e.target.value);
  };

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return (
        <ArgonBadge variant="purple" gradient>
          Admin
        </ArgonBadge>
      );
    }

    return (
      <ArgonBadge variant="info" gradient>
        User
      </ArgonBadge>
    );
  };

  const deleteUser = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      router.delete(route('admin.users.destroy', id), {
        onSuccess: () => {
          // Success notification is handled by Inertia
        },
      });
    }
  };

  return (
    <AdminLayout>
      <Head title="Kelola Pengguna - Admin Dashboard" />

      {/* Header text */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Kelola Pengguna</h1>
        <p className="text-white/80 text-sm">
          Kelola akun pengguna dan administrator sistem SMK IT Baitul Aziz.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ArgonStatCard
          title="Total Pengguna"
          value={stats.total}
          icon={<i className="ni ni-single-02 text-lg" />}
          gradient="bg-gradient-to-tl from-blue-500 to-violet-500"
          footer={<span className="text-slate-400 text-xs">Akun Terdaftar</span>}
        />
        <ArgonStatCard
          title="Administrator"
          value={stats.admins}
          icon={<i className="ni ni-settings-gear-65 text-lg" />}
          gradient="bg-gradient-to-tl from-purple-600 to-violet-500"
          footer={<span className="text-slate-400 text-xs">Akses Sistem Penuh</span>}
        />
        <ArgonStatCard
          title="User Biasa"
          value={stats.users}
          icon={<i className="ni ni-circle-08 text-lg" />}
          gradient="bg-gradient-to-tl from-emerald-500 to-teal-400"
          footer={<span className="text-slate-400 text-xs">Hak Akses Terbatas</span>}
        />
      </div>

      {/* Users Card List */}
      <ArgonCard
        title="Daftar Pengguna"
        headerRight={
          <Link
            href={route('admin.users.create')}
            className="inline-block px-4 py-2 bg-gradient-to-tl from-orange-500 to-yellow-500 text-white text-xs font-bold uppercase rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-px"
          >
            <i className="fas fa-plus mr-1.5" /> Tambah Pengguna
          </Link>
        }
        noPadding
      >
        {/* Search & Filter section */}
        <div className="p-6 pb-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <ArgonFormInput
                type="text"
                placeholder="Cari nama atau email..."
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="role-filter" className="block text-xs font-bold uppercase text-slate-400 mb-2">
                    Role
                  </label>
                  <select
                    id="role-filter"
                    name="role"
                    value={data.role}
                    onChange={handleFilterChange}
                    className="text-sm w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-slate-700 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">Semua Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setData({
                      search: '',
                      role: '',
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
            'Nama',
            'Email',
            { label: 'Role', align: 'left' },
            { label: 'Terdaftar', align: 'left' },
            { label: 'Aksi', align: 'right' }
          ]}
        >
          {users && Array.isArray(users.data) && users.data.length > 0 ? (
            users.data.map((user: User) => (
              <tr key={user.id}>
                {/* Name */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                  <div className="flex py-1">
                    <div className="my-auto">
                      <div className="inline-flex items-center justify-center mr-4 text-white bg-gradient-to-tl from-slate-600 to-slate-300 h-9 w-9 rounded-xl font-bold uppercase text-xs">
                        {user.name.substring(0, 2)}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <h6 className="mb-0 text-sm font-semibold leading-normal text-slate-700">
                        {user.name}
                      </h6>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                  <p className="mb-0 text-xs font-semibold leading-tight text-slate-400">
                    {user.email}
                  </p>
                </td>

                {/* Role */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                  {getRoleBadge(user.role)}
                </td>

                {/* Registered Date */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                  <span className="text-xs font-semibold leading-tight text-slate-400">
                    {new Date(user.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      href={route('admin.users.show', user.id)}
                      className="inline-flex items-center justify-center w-8 h-8 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Lihat Detail"
                    >
                      <i className="fas fa-eye text-xs" />
                    </Link>

                    <Link
                      href={route('admin.users.edit', user.id)}
                      className="inline-flex items-center justify-center w-8 h-8 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <i className="fas fa-edit text-xs" />
                    </Link>

                    {auth.user.id !== user.id && (
                      <button
                        type="button"
                        className="inline-flex items-center justify-center w-8 h-8 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                        title="Hapus"
                        onClick={() => deleteUser(user.id)}
                      >
                        <i className="fas fa-trash text-xs" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-6 text-center text-slate-400 text-sm">
                Tidak ada data pengguna yang ditemukan.
              </td>
            </tr>
          )}
        </ArgonTable>

        {/* Pagination links */}
        {users && (
          <ArgonPagination
            links={users.links}
            from={users.from}
            to={users.to}
            total={users.total}
          />
        )}
      </ArgonCard>
    </AdminLayout>
  );
}
