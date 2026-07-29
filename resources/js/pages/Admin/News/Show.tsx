import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import ImagePlaceholder from '@/components/ImagePlaceholder';
import ArgonCard from '@/components/admin/ArgonCard';
import ArgonBadge from '@/components/admin/ArgonBadge';

interface GalleryItem {
  id: number;
  image: string;
  title?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface News {
  id: number;
  title: string;
  summary: string | null;
  content: string;
  image: string | null;
  category: string | null;
  is_featured: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
  user: User;
  galleries?: GalleryItem[];
}

interface Props {
  news: News;
}

const Show: React.FC<Props> = ({ news }) => {
  return (
    <AdminLayout>
      <Head title={`${news.title} - Detail Berita - Admin Dashboard`} />
      
      {/* Header and Back Link */}
      <div className="mb-6">
        <Link 
          href="/admin/news" 
          className="text-white hover:text-white/80 inline-flex items-center text-sm transition-colors mb-4"
        >
          <i className="fas fa-arrow-left mr-1.5" /> Kembali ke Daftar Berita
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{news.title}</h1>
            <p className="text-white/80 text-sm">Detail data berita / artikel SMK IT Baitul Aziz.</p>
          </div>
          
          <Link 
            href={`/admin/news/${news.id}/edit`} 
            className="inline-block px-4 py-2 bg-gradient-to-tl from-orange-500 to-yellow-500 text-white text-xs font-bold uppercase rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-px text-center"
          >
            <i className="fas fa-edit mr-1.5" /> Edit Berita
          </Link>
        </div>
      </div>
      
      <div className="max-w-4xl space-y-6">
        <ArgonCard title="Detail Informasi Berita">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6 pb-6 border-b border-gray-150">
            <div>
              <span className="block text-xs font-bold uppercase text-slate-400 mb-1">Kategori</span>
              {news.category ? (
                <ArgonBadge variant="info">{news.category}</ArgonBadge>
              ) : (
                <span className="text-sm font-semibold text-slate-500">-</span>
              )}
            </div>

            <div>
              <span className="block text-xs font-bold uppercase text-slate-400 mb-1">Penulis</span>
              <span className="text-sm font-semibold text-slate-700 block mt-1">
                <i className="fas fa-user mr-1.5 text-slate-400" />
                {news.user.name}
              </span>
            </div>

            <div>
              <span className="block text-xs font-bold uppercase text-slate-400 mb-1">Tanggal Rilis</span>
              <span className="text-sm font-semibold text-slate-700 block mt-1">
                <i className="fas fa-calendar mr-1.5 text-slate-400" />
                {new Date(news.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </span>
            </div>

            <div>
              <span className="block text-xs font-bold uppercase text-slate-400 mb-1">Unggulan</span>
              {news.is_featured ? (
                <ArgonBadge variant="success" gradient>Ya</ArgonBadge>
              ) : (
                <ArgonBadge variant="default">Tidak</ArgonBadge>
              )}
            </div>
          </div>

          {/* Photo Display */}
          {news.image && (
            <div className="rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center p-4 border border-gray-100 max-h-[500px] mb-6">
              <img 
                src={news.image} 
                alt={news.title}
                className="w-full object-contain max-h-[460px] rounded-lg shadow-sm"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const next = e.currentTarget.nextElementSibling as HTMLElement | null;
                  if (next) next.style.display = 'flex';
                }}
              />
              <ImagePlaceholder 
                width="100%" 
                height="400px" 
                className="hidden" 
              />
            </div>
          )}

          {/* Galeri Foto Berita (Jika ada) */}
          {news.galleries && news.galleries.length > 0 && (
            <div className="mb-6 pb-6 border-b border-gray-150">
              <h6 className="text-slate-700 font-bold mb-3 text-sm flex items-center gap-2">
                <i className="fas fa-images text-orange-500" />
                Galeri Foto ({news.galleries.length} Foto)
              </h6>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {news.galleries.map((item) => (
                  <div key={item.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <img 
                      src={item.image} 
                      alt={item.title || news.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Summary / Ringkasan */}
          {news.summary && (
            <div className="mb-6 p-4 bg-orange-50/50 border-l-4 border-orange-500 rounded-lg">
              <h6 className="text-orange-700 font-bold mb-1 text-sm">Ringkasan</h6>
              <p className="text-slate-600 text-sm leading-relaxed italic">"{news.summary}"</p>
            </div>
          )}

          {/* Content / Konten */}
          <div className="mt-6 pt-6 border-t border-gray-150">
            <h6 className="text-slate-700 font-bold mb-4 text-sm">Konten Lengkap</h6>
            <div 
              className="prose max-w-none text-slate-600 text-sm leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </div>
        </ArgonCard>
      </div>
    </AdminLayout>
  );
};

export default Show; 