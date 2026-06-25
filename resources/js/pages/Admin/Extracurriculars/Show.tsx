import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import ArgonCard from '@/components/admin/ArgonCard';
import ArgonBadge from '@/components/admin/ArgonBadge';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Extracurricular {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  schedule: string | null;
  coach: string | null;
  location: string | null;
  is_active: boolean;
  order: number;
  user_id: number | null;
  created_at: string;
  updated_at: string;
  user: User | null;
}

interface ShowProps {
  extracurricular: Extracurricular;
}

export default function Show({ extracurricular }: ShowProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <Head title={`Detail Ekstrakurikuler - ${extracurricular.name}`} />

      {/* Header and Back Link */}
      <div className="mb-6">
        <Link
          href={route('admin.extracurriculars.index')}
          className="text-white hover:text-white/80 inline-flex items-center text-sm transition-colors mb-4"
        >
          <i className="fas fa-arrow-left mr-1.5" /> Kembali ke Daftar Ekstrakurikuler
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Detail Ekstrakurikuler: {extracurricular.name}
            </h1>
            <p className="text-white/80 text-sm">
              Informasi lengkap kegiatan ekstrakurikuler SMK IT Baitul Aziz.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              href={route('admin.extracurriculars.edit', extracurricular.id)}
              className="inline-block px-4 py-2 bg-gradient-to-tl from-orange-500 to-yellow-500 text-white text-xs font-bold uppercase rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-px text-center"
            >
              <i className="fas fa-edit mr-1.5" /> Edit
            </Link>
            <Link
              href={route('admin.extracurriculars.destroy', extracurricular.id)}
              method="delete"
              as="button"
              type="button"
              className="inline-block px-4 py-2 bg-gradient-to-tl from-red-600 to-orange-600 text-white text-xs font-bold uppercase rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-px text-center"
            >
              <i className="fas fa-trash-alt mr-1.5" /> Hapus
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Image & Details */}
        <div className="lg:col-span-1 space-y-6">
          <ArgonCard title="Poster / Gambar">
            {extracurricular.image ? (
              <div className="rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center p-2 border border-gray-100 mb-4">
                <img
                  src={`/storage/${extracurricular.image}`}
                  alt={extracurricular.name}
                  className="w-full h-auto rounded-lg shadow-sm max-h-[300px] object-cover"
                />
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 text-center text-slate-400 mb-4">
                <i className="fas fa-image text-3xl mb-2 text-slate-300" />
                <p className="text-xs">Tidak ada gambar poster</p>
              </div>
            )}

            <hr className="h-px bg-gray-200 my-4" />

            <div className="space-y-3">
              <div>
                <span className="block text-xs font-bold uppercase text-slate-400 mb-1">Status</span>
                {extracurricular.is_active ? (
                  <ArgonBadge variant="success" gradient>Aktif</ArgonBadge>
                ) : (
                  <ArgonBadge variant="danger" gradient>Tidak Aktif</ArgonBadge>
                )}
              </div>

              <div>
                <span className="block text-xs font-bold uppercase text-slate-400 mb-0.5">Urutan Tampilan</span>
                <span className="text-sm font-semibold text-slate-700">{extracurricular.order}</span>
              </div>

              <div>
                <span className="block text-xs font-bold uppercase text-slate-400 mb-0.5">Slug URL</span>
                <code className="text-xs font-mono bg-slate-50 px-2 py-1 rounded text-orange-600 font-semibold break-all inline-block">
                  {extracurricular.slug}
                </code>
              </div>

              <div>
                <span className="block text-xs font-bold uppercase text-slate-400 mb-0.5">Dibuat</span>
                <span className="text-xs font-semibold text-slate-700 block">
                  <i className="far fa-clock mr-1 text-slate-400" />
                  {formatDate(extracurricular.created_at)}
                </span>
              </div>

              <div>
                <span className="block text-xs font-bold uppercase text-slate-400 mb-0.5">Terakhir Diperbarui</span>
                <span className="text-xs font-semibold text-slate-700 block">
                  <i className="far fa-edit mr-1 text-slate-400" />
                  {formatDate(extracurricular.updated_at)}
                </span>
              </div>

              {extracurricular.user && (
                <div>
                  <span className="block text-xs font-bold uppercase text-slate-400 mb-0.5">Oleh</span>
                  <span className="text-xs font-semibold text-slate-700 block">
                    <i className="far fa-user mr-1 text-slate-400" />
                    {extracurricular.user.name}
                  </span>
                </div>
              )}
            </div>
          </ArgonCard>
        </div>

        {/* Right Column: Info & Description */}
        <div className="lg:col-span-2 space-y-6">
          <ArgonCard title="Informasi Kegiatan">
            {/* Quick Metadata Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Jadwal Latihan</span>
                <span className="text-xs font-bold text-slate-700 flex items-center">
                  <i className="fas fa-calendar-alt mr-1.5 text-orange-500 text-[10px]" />
                  {extracurricular.schedule || '-'}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Pembina / Pelatih</span>
                <span className="text-xs font-bold text-slate-700 flex items-center">
                  <i className="fas fa-user-tie mr-1.5 text-orange-500 text-[10px]" />
                  {extracurricular.coach || '-'}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Lokasi Kegiatan</span>
                <span className="text-xs font-bold text-slate-700 flex items-center">
                  <i className="fas fa-map-marker-alt mr-1.5 text-orange-500 text-[10px]" />
                  {extracurricular.location || '-'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h6 className="text-slate-700 font-bold mb-2 text-sm">Deskripsi Kegiatan</h6>
                {extracurricular.description ? (
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-white p-4 rounded-lg border border-slate-100">
                    {extracurricular.description}
                  </p>
                ) : (
                  <p className="text-slate-400 italic text-xs">Tidak ada deskripsi yang ditambahkan.</p>
                )}
              </div>

              <hr className="h-px bg-gray-200 my-6" />

              <div>
                <h6 className="text-slate-700 font-bold mb-3 text-sm">Link Publik Terkait</h6>
                <div className="space-y-2">
                  <div>
                    <Link
                      href={route('extracurricular')}
                      className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors inline-flex items-center"
                      target="_blank"
                    >
                      <i className="fas fa-external-link-alt mr-2 text-xs" />
                      Lihat semua ekstrakurikuler di halaman publik →
                    </Link>
                  </div>
                  <div>
                    <Link
                      href={route('extracurricular.detail', extracurricular.slug)}
                      className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors inline-flex items-center"
                      target="_blank"
                    >
                      <i className="fas fa-external-link-alt mr-2 text-xs" />
                      Lihat detail ekstrakurikuler ini di halaman publik →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </ArgonCard>
        </div>
      </div>
    </AdminLayout>
  );
} 