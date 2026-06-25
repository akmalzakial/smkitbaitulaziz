import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import ArgonStatCard from '@/components/admin/ArgonStatCard';
import ArgonCard from '@/components/admin/ArgonCard';
import ArgonBadge from '@/components/admin/ArgonBadge';

interface Stats {
  total: number;
  menunggu: number;
  verifikasi: number;
  diterima: number;
  ditolak: number;
  cadangan: number;
}

interface JurusanItem {
  nama: string;
  total: number;
  kuota?: number;
}

interface RecentApp {
  id: number;
  nama_lengkap: string;
  registration_number?: string;
  nomor_pendaftaran?: string;
  jurusan_1: string;
  created_at: string;
  status: string;
}

interface Props {
  auth: any;
  stats?: Stats;
  jurusan?: JurusanItem[];
  recent?: RecentApp[];
}

export default function AdminPpdbDashboard({
  stats = {
    total: 0,
    menunggu: 0,
    verifikasi: 0,
    diterima: 0,
    ditolak: 0,
    cadangan: 0
  },
  jurusan = [],
  recent = []
}: Props) {
  return (
    <AdminLayout>
      <Head title="Dashboard PPDB - Admin Dashboard" />

      {/* Header section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">
          Dashboard SPMB
        </h1>
        <p className="mt-1 text-white/80 text-sm">
          Ringkasan dan statistik pendaftaran peserta didik baru SMK IT Baitul Aziz.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ArgonStatCard
          title="Total Pendaftar"
          value={stats.total}
          icon={<i className="fas fa-users text-lg" />}
          gradient="bg-gradient-to-tl from-blue-600 to-cyan-500"
          footer={
            <Link href={route('admin.spmb.index')} className="text-xs text-slate-400 hover:text-orange-500 font-bold uppercase transition-colors">
              Lihat Semua <i className="fas fa-arrow-right ml-1" />
            </Link>
          }
        />

        <ArgonStatCard
          title="Pendaftar Diterima"
          value={stats.diterima}
          icon={<i className="fas fa-user-check text-lg" />}
          gradient="bg-gradient-to-tl from-emerald-600 to-teal-500"
          footer={
            <Link href={`${route('admin.spmb.index')}?status=diterima`} className="text-xs text-slate-400 hover:text-orange-500 font-bold uppercase transition-colors">
              Lihat Diterima <i className="fas fa-arrow-right ml-1" />
            </Link>
          }
        />

        <ArgonStatCard
          title="Menunggu Verifikasi"
          value={stats.menunggu}
          icon={<i className="fas fa-user-clock text-lg" />}
          gradient="bg-gradient-to-tl from-orange-500 to-yellow-500"
          footer={
            <Link href={`${route('admin.spmb.index')}?status=menunggu`} className="text-xs text-slate-400 hover:text-orange-500 font-bold uppercase transition-colors">
              Lihat Menunggu <i className="fas fa-arrow-right ml-1" />
            </Link>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Status Breakdown Grid */}
          <ArgonCard title="Status Pendaftaran">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatusCard
                title="Menunggu Verifikasi"
                count={stats.menunggu}
                variant="warning"
                icon="fas fa-clock"
                href={`${route('admin.spmb.index')}?status=menunggu`}
              />

              <StatusCard
                title="Verifikasi Dokumen"
                count={stats.verifikasi}
                variant="info"
                icon="fas fa-book-open"
                href={`${route('admin.spmb.index')}?status=verifikasi`}
              />

              <StatusCard
                title="Diterima"
                count={stats.diterima}
                variant="success"
                icon="fas fa-check-circle"
                href={`${route('admin.spmb.index')}?status=diterima`}
              />

              <StatusCard
                title="Ditolak"
                count={stats.ditolak}
                variant="danger"
                icon="fas fa-times-circle"
                href={`${route('admin.spmb.index')}?status=ditolak`}
              />

              <StatusCard
                title="Cadangan"
                count={stats.cadangan}
                variant="purple"
                icon="fas fa-archive"
                href={`${route('admin.spmb.index')}?status=cadangan`}
              />

              <StatusCard
                title="Total Pendaftar"
                count={stats.total}
                variant="default"
                icon="fas fa-folder"
                href={route('admin.spmb.index')}
              />
            </div>
          </ArgonCard>

          {/* Pendaftar Per Jurusan */}
          <ArgonCard title="Pendaftar per Jurusan">
            <div className="space-y-4">
              {jurusan.map((item, index) => (
                <div key={index} className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                        <i className="fas fa-graduation-cap text-base" />
                      </div>
                      <div>
                        <h6 className="text-slate-800 font-bold text-sm mb-0.5">{item.nama}</h6>
                        <p className="text-slate-400 text-xs font-semibold">
                          {item.total} Pendaftar
                          {item.kuota && ` (Kuota: ${item.kuota})`}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`${route('admin.spmb.index')}?jurusan=${encodeURIComponent(item.nama)}`}
                      className="text-xs font-bold text-orange-500 hover:text-orange-600 uppercase transition-colors"
                    >
                      Lihat List
                    </Link>
                  </div>

                  {/* Progress bar */}
                  {item.kuota && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-orange-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (item.total / item.kuota) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-[10px] font-bold text-slate-400">
                        <span>{Math.round((item.total / item.kuota) * 100)}% Terisi</span>
                        <span>{item.total} / {item.kuota} Kuota</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ArgonCard>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Pendaftar Terbaru */}
          <ArgonCard 
            title="Pendaftar Terbaru"
            footer={
              <Link
                href={route('admin.spmb.index')}
                className="text-xs text-orange-500 hover:text-orange-600 font-bold uppercase transition-colors inline-block"
              >
                Lihat Semua Pendaftar
              </Link>
            }
          >
            <div className="divide-y divide-gray-100">
              {recent.length === 0 ? (
                <div className="py-6 text-center text-slate-400">
                  <i className="far fa-clipboard text-3xl mb-2 text-slate-300" />
                  <p className="text-xs">Belum ada pendaftar baru</p>
                </div>
              ) : (
                recent.map((app, index) => (
                  <div key={index} className="py-3.5 first:pt-0 last:pb-0">
                    <Link href={route('admin.spmb.show', app.id)} className="block hover:opacity-85 group">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h6 className="text-slate-800 font-bold text-sm mb-0.5 truncate group-hover:text-orange-500 transition-colors">
                            {app.nama_lengkap}
                          </h6>
                          <p className="text-slate-400 text-xs font-semibold truncate mb-1">
                            {app.registration_number || app.nomor_pendaftaran || '-'} • {app.jurusan_1}
                          </p>
                          <div className="flex items-center text-[10px] text-slate-400 font-bold">
                            <i className="far fa-clock mr-1" />
                            {new Date(app.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                        </div>

                        <StatusBadge status={app.status} />
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </ArgonCard>

          {/* Quick Links */}
          <ArgonCard title="Aksi Cepat">
            <div className="space-y-3">
              <Link
                href={route('admin.spmb.index')}
                className="flex items-center p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 group transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center mr-3 transition-colors text-orange-600">
                  <i className="fas fa-users text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <h6 className="text-slate-850 font-bold text-xs truncate">Lihat Semua Pendaftar</h6>
                  <p className="text-slate-400 text-[10px] font-semibold truncate">Kelola data pendaftaran SPMB</p>
                </div>
              </Link>

              <Link
                href={route('admin.spmb.export')}
                className="flex items-center p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 group transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center mr-3 transition-colors text-emerald-600">
                  <i className="fas fa-file-excel text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <h6 className="text-slate-855 font-bold text-xs truncate">Export Data Pendaftar</h6>
                  <p className="text-slate-400 text-[10px] font-semibold truncate">Unduh data Excel (.xlsx)</p>
                </div>
              </Link>

              <Link
                href={`${route('admin.spmb.index')}?status=diterima`}
                className="flex items-center p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 group transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-teal-100 group-hover:bg-teal-200 flex items-center justify-center mr-3 transition-colors text-teal-600">
                  <i className="fas fa-check-double text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <h6 className="text-slate-855 font-bold text-xs truncate">Pendaftar Diterima</h6>
                  <p className="text-slate-400 text-[10px] font-semibold truncate">Lihat pendaftar yang lolos</p>
                </div>
              </Link>
            </div>
          </ArgonCard>
        </div>
      </div>
    </AdminLayout>
  );
}

// Component untuk menampilkan status badge
const StatusBadge = ({ status }: { status: string }) => {
  const normalizedStatus = status ? status.toLowerCase() : 'menunggu';

  if (normalizedStatus === 'diterima') {
    return <ArgonBadge variant="success">Diterima</ArgonBadge>;
  }
  if (normalizedStatus === 'ditolak') {
    return <ArgonBadge variant="danger">Ditolak</ArgonBadge>;
  }
  if (normalizedStatus === 'verifikasi') {
    return <ArgonBadge variant="info">Verifikasi</ArgonBadge>;
  }
  if (normalizedStatus === 'cadangan') {
    return <ArgonBadge variant="purple">Cadangan</ArgonBadge>;
  }
  
  return <ArgonBadge variant="warning">Menunggu</ArgonBadge>;
};

// Component untuk mini status card widget
interface StatusCardProps {
  title: string;
  count: number;
  variant: 'success' | 'danger' | 'warning' | 'info' | 'purple' | 'default';
  icon: string;
  href: string;
}

const StatusCard = ({ title, count, variant, icon, href }: StatusCardProps) => {
  const styleConfigs = {
    success: {
      bg: 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-100',
      text: 'text-emerald-700',
      iconClass: 'text-emerald-500 bg-emerald-100'
    },
    danger: {
      bg: 'bg-red-50 hover:bg-red-100/80 border-red-100',
      text: 'text-red-700',
      iconClass: 'text-red-500 bg-red-100'
    },
    warning: {
      bg: 'bg-amber-50 hover:bg-amber-100/80 border-amber-100',
      text: 'text-amber-700',
      iconClass: 'text-amber-500 bg-amber-100'
    },
    info: {
      bg: 'bg-blue-50 hover:bg-blue-100/80 border-blue-100',
      text: 'text-blue-700',
      iconClass: 'text-blue-500 bg-blue-100'
    },
    purple: {
      bg: 'bg-purple-50 hover:bg-purple-100/80 border-purple-100',
      text: 'text-purple-700',
      iconClass: 'text-purple-500 bg-purple-100'
    },
    default: {
      bg: 'bg-slate-50 hover:bg-slate-100/80 border-slate-250',
      text: 'text-slate-700',
      iconClass: 'text-slate-500 bg-slate-200'
    }
  };

  const config = styleConfigs[variant] || styleConfigs.default;

  return (
    <Link 
      href={href}
      className={`block p-4 border rounded-xl transition-all duration-300 hover:shadow-md ${config.bg}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.iconClass}`}>
          <i className={icon} />
        </div>
        <span className="text-2xl font-black text-slate-800 tracking-tight leading-none">
          {count}
        </span>
      </div>
      <h6 className={`text-[10px] font-bold uppercase ${config.text} truncate`}>
        {title}
      </h6>
    </Link>
  );
}; 