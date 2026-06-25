import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../layouts/AdminLayout';
import ArgonStatCard from '@/components/admin/ArgonStatCard';
import ArgonCard from '@/components/admin/ArgonCard';

interface DashboardProps {
  stats?: {
    totalGalleries: number;
    totalNews: number;
    totalExtracurriculars: number;
    totalTeachers: number;
    totalPpdb: number;
    ppdbPending: number;
    ppdbVerified: number;
    ppdbAccepted: number;
    ppdbRejected: number;
  };
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const stats = props.stats || {
    totalGalleries: 0,
    totalNews: 0,
    totalExtracurriculars: 0,
    totalTeachers: 0,
    totalPpdb: 0,
    ppdbPending: 0,
    ppdbVerified: 0,
    ppdbAccepted: 0,
    ppdbRejected: 0
  };

  const quickMenus = [
    {
      title: 'Kelola Galeri',
      description: 'Manajemen foto kegiatan sekolah',
      icon: 'ni ni-image',
      iconColor: 'text-blue-500',
      link: '/admin/gallery',
      bg: 'bg-gradient-to-tl from-blue-500 to-violet-500'
    },
    {
      title: 'Kelola Berita',
      description: 'Publikasi artikel & pengumuman',
      icon: 'ni ni-paper-diploma',
      iconColor: 'text-emerald-500',
      link: '/admin/news',
      bg: 'bg-gradient-to-tl from-emerald-500 to-teal-400'
    },
    {
      title: 'Data SPMB',
      description: 'Verifikasi pendaftar baru',
      icon: 'ni ni-single-02',
      iconColor: 'text-orange-500',
      link: '/admin/spmb',
      bg: 'bg-gradient-to-tl from-orange-500 to-orange-600'
    },
    {
      title: 'Guru & Staff',
      description: 'Data tenaga pendidik',
      icon: 'ni ni-hat-3',
      iconColor: 'text-indigo-500',
      link: '/admin/teachers',
      bg: 'bg-gradient-to-tl from-indigo-500 to-indigo-700'
    }
  ];

  return (
    <AdminLayout>
      <Head title="Dashboard Admin" />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <ArgonStatCard
          title="Total Galeri"
          value={stats.totalGalleries}
          icon={<i className="ni ni-image text-lg" />}
          gradient="bg-gradient-to-tl from-blue-500 to-violet-500"
          footer={<span className="text-emerald-500 font-bold text-xs"><i className="fas fa-arrow-up mr-1" />Data Terbaru</span>}
        />
        <ArgonStatCard
          title="Total Berita"
          value={stats.totalNews}
          icon={<i className="ni ni-paper-diploma text-lg" />}
          gradient="bg-gradient-to-tl from-red-600 to-orange-600"
          footer={<span className="text-slate-400 text-xs">Artikel Terpublikasi</span>}
        />
        <ArgonStatCard
          title="Pendaftar SPMB"
          value={stats.totalPpdb}
          icon={<i className="ni ni-single-02 text-lg" />}
          gradient="bg-gradient-to-tl from-emerald-500 to-teal-400"
          footer={
            <span className="text-xs">
              <span className="text-orange-500 font-bold">{stats.ppdbPending}</span> Menunggu Verifikasi
            </span>
          }
        />
        <ArgonStatCard
          title="Total Guru"
          value={stats.totalTeachers}
          icon={<i className="ni ni-hat-3 text-lg" />}
          gradient="bg-gradient-to-tl from-orange-500 to-yellow-500"
          footer={<span className="text-xs text-slate-400">Tenaga Pendidik Aktif</span>}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="xl:col-span-2">
          <ArgonCard
            title="Aksi Cepat"
            headerRight={
              <Link href="/admin/dashboard" className="bg-gradient-to-tl from-orange-500 to-yellow-500 text-white text-xs font-bold uppercase px-4 py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-px">
                Lihat Semua
              </Link>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickMenus.map((menu, i) => (
                <Link
                  key={i}
                  href={menu.link}
                  className="group flex flex-col relative overflow-hidden bg-white border border-gray-100 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className={`w-12 h-12 rounded-xl ${menu.bg} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${menu.icon} text-white text-lg`} />
                  </div>
                  <h4 className="font-bold text-slate-700 text-sm">{menu.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{menu.description}</p>
                </Link>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="font-semibold text-slate-700 mb-3 text-sm">Shortcut Tambah Data</h4>
              <div className="flex flex-wrap gap-2">
                <Link href="/admin/news/create" className="inline-flex items-center px-4 py-2 bg-gray-50 text-slate-600 rounded-lg hover:bg-orange-50 hover:text-orange-600 border border-gray-200 hover:border-orange-200 transition-all text-sm">
                  <i className="fas fa-plus mr-2 text-xs" /> Tulis Berita
                </Link>
                <Link href="/admin/gallery/create" className="inline-flex items-center px-4 py-2 bg-gray-50 text-slate-600 rounded-lg hover:bg-orange-50 hover:text-orange-600 border border-gray-200 hover:border-orange-200 transition-all text-sm">
                  <i className="fas fa-plus mr-2 text-xs" /> Upload Galeri
                </Link>
                <Link href="/admin/teachers/create" className="inline-flex items-center px-4 py-2 bg-gray-50 text-slate-600 rounded-lg hover:bg-orange-50 hover:text-orange-600 border border-gray-200 hover:border-orange-200 transition-all text-sm">
                  <i className="fas fa-plus mr-2 text-xs" /> Data Guru
                </Link>
              </div>
            </div>
          </ArgonCard>
        </div>

        {/* Sidebar Cards */}
        <div className="xl:col-span-1 space-y-6">
          {/* SPMB Summary */}
          <ArgonCard title="Ringkasan SPMB">
            <div className="relative">
              <div className="border-l-2 border-gray-100 ml-3 space-y-6 pb-2">
                <div className="relative pl-8">
                  <div className="absolute left-0 -ml-1.5 mt-1.5 w-3 h-3 bg-amber-500 rounded-full border-2 border-white shadow-sm" />
                  <h5 className="font-semibold text-slate-700 text-sm">Menunggu Verifikasi</h5>
                  <p className="text-slate-400 text-xs mt-0.5">Siswa baru mendaftar</p>
                  <span className="inline-block mt-2 px-2.5 py-1 bg-amber-50 text-amber-600 text-xs rounded-lg font-bold">
                    {stats.ppdbPending} Siswa
                  </span>
                </div>
                <div className="relative pl-8">
                  <div className="absolute left-0 -ml-1.5 mt-1.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm" />
                  <h5 className="font-semibold text-slate-700 text-sm">Terverifikasi</h5>
                  <p className="text-slate-400 text-xs mt-0.5">Berkas lengkap</p>
                  <span className="inline-block mt-2 px-2.5 py-1 bg-blue-50 text-blue-600 text-xs rounded-lg font-bold">
                    {stats.ppdbVerified} Siswa
                  </span>
                </div>
                <div className="relative pl-8">
                  <div className="absolute left-0 -ml-1.5 mt-1.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                  <h5 className="font-semibold text-slate-700 text-sm">Diterima</h5>
                  <p className="text-slate-400 text-xs mt-0.5">Lulus seleksi</p>
                  <span className="inline-block mt-2 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs rounded-lg font-bold">
                    {stats.ppdbAccepted} Siswa
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <Link href="/admin/spmb" className="text-orange-500 text-sm font-semibold hover:text-orange-600 transition-colors">
                  Lihat Semua Pendaftar &rarr;
                </Link>
              </div>
            </div>
          </ArgonCard>

          {/* System Info */}
          <ArgonCard title="Info Sistem">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Versi</span>
                <span className="text-sm font-semibold text-slate-700">v2.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Status</span>
                <span className="text-xs px-2.5 py-1 bg-gradient-to-tl from-emerald-500 to-teal-400 text-white rounded-lg font-bold">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Last Update</span>
                <span className="text-sm text-slate-600">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </ArgonCard>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
