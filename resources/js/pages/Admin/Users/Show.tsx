import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import ArgonCard from '@/components/admin/ArgonCard';
import ArgonBadge from '@/components/admin/ArgonBadge';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  ppdb?: any;
}

export default function UserShow({ user }: { user: UserData }) {
  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return (
        <ArgonBadge variant="purple" gradient>
          Administrator
        </ArgonBadge>
      );
    }
    
    return (
      <ArgonBadge variant="info" gradient>
        User
      </ArgonBadge>
    );
  };

  return (
    <AdminLayout>
      <Head title={`Detail Pengguna: ${user.name} - Admin Dashboard`} />
      
      {/* Header and Back Link */}
      <div className="mb-6">
        <Link
          href={route('admin.users.index')}
          className="text-white hover:text-white/80 inline-flex items-center text-sm transition-colors mb-4"
        >
          <i className="fas fa-arrow-left mr-1.5" /> Kembali ke Daftar Pengguna
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Detail Pengguna: {user.name}
            </h1>
            <p className="text-white/80 text-sm">
              Informasi lengkap tentang akun pengguna SMK IT Baitul Aziz.
            </p>
          </div>
          
          <Link
            href={route('admin.users.edit', user.id)}
            className="inline-block px-4 py-2 bg-gradient-to-tl from-orange-500 to-yellow-500 text-white text-xs font-bold uppercase rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-px"
          >
            <i className="fas fa-edit mr-1.5" /> Edit Pengguna
          </Link>
        </div>
      </div>
      
      <div className="max-w-3xl space-y-6">
        {/* User Information Card */}
        <ArgonCard title="Informasi Pengguna">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Nama Lengkap
              </label>
              <div className="flex items-center text-slate-700 font-semibold text-sm py-1.5">
                <i className="fas fa-user mr-2.5 text-slate-400" />
                {user.name}
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Email
              </label>
              <div className="flex items-center text-slate-700 font-semibold text-sm py-1.5">
                <i className="fas fa-envelope mr-2.5 text-slate-400" />
                {user.email}
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                Role / Hak Akses
              </label>
              <div>
                {getRoleBadge(user.role)}
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Terdaftar Sejak
              </label>
              <div className="flex items-center text-slate-700 font-semibold text-sm py-1.5">
                <i className="fas fa-calendar-alt mr-2.5 text-slate-400" />
                {new Date(user.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </ArgonCard>
        
        {/* SPMB Information if exists */}
        {user.ppdb && (
          <ArgonCard title="Informasi Pendaftaran SPMB">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Nomor Pendaftaran</p>
                <p className="text-base font-bold text-slate-700">{user.ppdb.nomor_pendaftaran}</p>
              </div>
              
              <Link
                href={route('admin.spmb.show', user.ppdb.id)}
                className="inline-block px-4 py-2 bg-gradient-to-tl from-blue-600 to-cyan-500 text-white text-xs font-bold uppercase rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <i className="fas fa-file-alt mr-1.5" /> Lihat Detail SPMB
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Status Pendaftaran</p>
                <p className="text-sm font-semibold text-slate-700 mt-1">{user.ppdb.status || 'Menunggu'}</p>
              </div>
              
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Tanggal Daftar</p>
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  {new Date(user.ppdb.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </ArgonCard>
        )}
        
        {/* No SPMB Message */}
        {!user.ppdb && user.role === 'user' && (
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 text-center">
            <i className="fas fa-file-signature text-slate-300 text-3xl mb-2" />
            <p className="text-slate-500 text-sm">
              Pengguna ini belum melakukan pendaftaran SPMB.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
