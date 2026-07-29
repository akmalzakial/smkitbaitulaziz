import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import ImagePlaceholder from '@/components/ImagePlaceholder';
import ArgonCard from '@/components/admin/ArgonCard';
import ArgonBadge from '@/components/admin/ArgonBadge';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Gallery {
  id: number;
  title: string;
  description: string | null;
  image: string;
  category: string | null;
  is_featured: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
  user: User;
}

interface Props {
  gallery: Gallery;
}

const Show: React.FC<Props> = ({ gallery }) => {
  return (
    <AdminLayout>
      <Head title={`${gallery.title} - Detail Galeri - SMK IT Baitul Aziz`} />
      
      {/* Header and Back Link */}
      <div className="mb-6">
        <Link 
          href="/admin/gallery" 
          className="text-white hover:text-white/80 inline-flex items-center text-sm transition-colors mb-4"
        >
          <i className="fas fa-arrow-left mr-1.5" /> Kembali ke daftar galeri
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{gallery.title}</h1>
            <p className="text-white/80 text-sm">Detail data foto galeri SMK IT Baitul Aziz.</p>
          </div>
          
          <Link 
            href={`/admin/gallery/${gallery.id}/edit`} 
            className="inline-block px-4 py-2 bg-gradient-to-tl from-orange-500 to-yellow-500 text-white text-xs font-bold uppercase rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-px"
          >
            <i className="fas fa-edit mr-1.5" /> Edit
          </Link>
        </div>
      </div>
      
      <div className="max-w-4xl space-y-6">
        <ArgonCard title="Detail Informasi Foto">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6 pb-6 border-b border-gray-150">
            <div>
              <span className="block text-xs font-bold uppercase text-slate-400 mb-1">Kategori</span>
              {gallery.category ? (
                <ArgonBadge variant="info">{gallery.category}</ArgonBadge>
              ) : (
                <span className="text-sm font-semibold text-slate-500">-</span>
              )}
            </div>

            <div>
              <span className="block text-xs font-bold uppercase text-slate-400 mb-1">Ditambahkan Oleh</span>
              <span className="text-sm font-semibold text-slate-700">
                <i className="fas fa-user mr-1.5 text-slate-400" />
                {gallery.user.name}
              </span>
            </div>

            <div>
              <span className="block text-xs font-bold uppercase text-slate-400 mb-1">Tanggal Upload</span>
              <span className="text-sm font-semibold text-slate-700">
                <i className="fas fa-calendar mr-1.5 text-slate-400" />
                {new Date(gallery.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </span>
            </div>

            <div>
              <span className="block text-xs font-bold uppercase text-slate-400 mb-1">Unggulan</span>
              {gallery.is_featured ? (
                <ArgonBadge variant="success" gradient>Ya</ArgonBadge>
              ) : (
                <ArgonBadge variant="default">Tidak</ArgonBadge>
              )}
            </div>
          </div>

          {/* Photo Display */}
          <div className="rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center p-4 border border-gray-100 max-h-[500px]">
            {gallery.image ? (
              <img 
                src={gallery.image} 
                alt={gallery.title}
                className="w-full object-contain max-h-[460px] rounded-lg shadow-sm"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextEl = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextEl) {
                    nextEl.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <ImagePlaceholder 
              width="100%" 
              height="400px" 
              className={gallery.image ? 'hidden' : ''} 
            />
          </div>
          
          {/* Description */}
          {gallery.description && (
            <div className="mt-6 pt-6 border-t border-gray-150">
              <h6 className="text-slate-700 font-bold mb-2 text-sm">Deskripsi</h6>
              <p className="text-slate-500 text-sm leading-relaxed">{gallery.description}</p>
            </div>
          )}
        </ArgonCard>
      </div>
    </AdminLayout>
  );
};

export default Show;