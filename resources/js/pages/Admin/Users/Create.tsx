import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import ArgonCard from '@/components/admin/ArgonCard';
import ArgonFormInput from '@/components/admin/ArgonFormInput';

export default function UserCreate() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.users.store'));
  };

  return (
    <AdminLayout>
      <Head title="Tambah Pengguna - Admin Dashboard" />
      
      {/* Header and Back Link */}
      <div className="mb-6">
        <Link
          href={route('admin.users.index')}
          className="inline-flex items-center text-sm text-white/80 hover:text-white mb-4 transition-colors"
        >
          <i className="fas fa-arrow-left mr-1.5" /> Kembali ke Daftar Pengguna
        </Link>
        
        <h1 className="text-2xl font-bold text-white mb-1">
          Tambah Pengguna Baru
        </h1>
        <p className="text-white/80 text-sm">
          Buat akun pengguna atau administrator baru untuk sistem SMK IT Baitul Aziz.
        </p>
      </div>
      
      <div className="max-w-3xl">
        <form onSubmit={handleSubmit}>
          <ArgonCard 
            title="Form Data Pengguna"
            footer={
              <div className="flex items-center justify-end space-x-3 w-full">
                <Link
                  href={route('admin.users.index')}
                  className="px-4 py-2 text-xs font-bold uppercase text-slate-400 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200"
                >
                  Batal
                </Link>
                
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-tl from-orange-500 to-yellow-500 text-white text-xs font-bold uppercase rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-save mr-1.5" />
                  {processing ? 'Menyimpan...' : 'Simpan Pengguna'}
                </button>
              </div>
            }
          >
            {/* Nama */}
            <ArgonFormInput
              label="Nama Lengkap *"
              type="text"
              id="name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              error={errors.name}
              placeholder="Masukkan nama lengkap"
              icon="fas fa-user"
              required
            />

            {/* Email */}
            <ArgonFormInput
              label="Email *"
              type="email"
              id="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              error={errors.email}
              placeholder="contoh@email.com"
              icon="fas fa-envelope"
              required
            />

            {/* Role */}
            <div className="mb-4">
              <label htmlFor="role" className="inline-block mb-2 ml-1 text-xs font-bold uppercase text-slate-400">
                Role *
              </label>
              <div className="relative flex flex-wrap items-stretch w-full transition-all rounded-lg ease">
                <span className="text-sm ease absolute z-50 -ml-px flex h-full items-center whitespace-nowrap rounded-lg rounded-tr-none rounded-br-none border border-r-0 border-transparent bg-transparent py-2 px-3 text-center font-normal text-slate-500 transition-all leading-5">
                  <i className="fas fa-shield-alt" />
                </span>
                <select
                  id="role"
                  value={data.role}
                  onChange={(e) => setData('role', e.target.value)}
                  className={`text-sm w-full rounded-lg border border-solid border-gray-300 bg-white py-2 pr-3 pl-9 text-slate-700 focus:border-orange-500 focus:outline-none focus:shadow-primary-outline transition-all ${
                    errors.role ? 'border-red-500' : ''
                  }`}
                  required
                >
                  <option value="user">User (Siswa/Calon Siswa)</option>
                  <option value="admin">Admin (Administrator)</option>
                </select>
              </div>
              {errors.role && (
                <p className="mt-1 ml-1 text-xs text-red-500 font-semibold">{errors.role}</p>
              )}
              <p className="mt-1 ml-1 text-xxs text-slate-400">
                User: Akses terbatas untuk pendaftaran PPDB. Admin: Akses penuh ke dashboard admin.
              </p>
            </div>

            {/* Password */}
            <ArgonFormInput
              label="Password *"
              type="password"
              id="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              error={errors.password}
              placeholder="Minimal 8 karakter"
              icon="fas fa-lock"
              required
            />

            {/* Confirm Password */}
            <ArgonFormInput
              label="Konfirmasi Password *"
              type="password"
              id="password_confirmation"
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              error={errors.password_confirmation}
              placeholder="Ulangi password"
              icon="fas fa-lock"
              required
            />
          </ArgonCard>
        </form>
      </div>
    </AdminLayout>
  );
}
