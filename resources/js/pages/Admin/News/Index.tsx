import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import ImagePlaceholder from '@/components/ImagePlaceholder';
import ArgonCard from '@/components/admin/ArgonCard';
import ArgonTable from '@/components/admin/ArgonTable';
import ArgonBadge from '@/components/admin/ArgonBadge';
import ArgonFormInput from '@/components/admin/ArgonFormInput';
import ArgonModal from '@/components/admin/ArgonModal';

interface User {
  id: number;
  name: string;
  email: string;
}

interface News {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  image: string;
  category: string | null;
  is_featured: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
  user: User;
}

interface Props {
  news: News[];
}

const Index: React.FC<Props> = ({ news }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<News | null>(null);

  // Mendapatkan kategori unik dari data berita
  const categories = ['all', ...new Set(news.map(item => item.category).filter((c): c is string => Boolean(c)))];

  // Filter berita berdasarkan pencarian dan kategori
  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.summary && item.summary.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Menangani proses penghapusan
  const confirmDelete = (item: News) => {
    setNewsToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (newsToDelete) {
      router.delete(`/admin/news/${newsToDelete.slug}`, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setNewsToDelete(null);
        },
      });
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setNewsToDelete(null);
  };

  return (
    <AdminLayout>
      <Head title="Kelola Berita - SMK IT Baitul Aziz" />

      {/* Header text */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Manajemen Berita</h1>
        <p className="text-white/80 text-sm">
          Kelola publikasi artikel, pengumuman, dan berita sekolah SMK IT Baitul Aziz.
        </p>
      </div>

      {/* News list card */}
      <ArgonCard
        title="Daftar Berita"
        headerRight={
          <Link
            href="/admin/news/create"
            className="inline-block px-4 py-2 bg-gradient-to-tl from-orange-500 to-yellow-500 text-white text-xs font-bold uppercase rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-px"
          >
            <i className="fas fa-plus mr-1.5" /> Tambah Berita
          </Link>
        }
        noPadding
      >
        {/* Search and Filters */}
        <div className="p-6 pb-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <ArgonFormInput
                type="text"
                placeholder="Cari berita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon="fas fa-search"
                wrapperClassName="mb-0"
              />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="category" className="text-xs font-bold uppercase text-slate-400 whitespace-nowrap">Kategori:</label>
              <select
                id="category"
                className="text-sm rounded-lg border border-gray-300 bg-white py-2 px-3 text-slate-700 focus:border-orange-500 focus:outline-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category === 'all' ? 'Semua Kategori' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table structure */}
        <ArgonTable
          headers={[
            'Gambar',
            'Judul',
            { label: 'Kategori', align: 'left' },
            { label: 'Unggulan', align: 'left' },
            { label: 'Penulis', align: 'left' },
            { label: 'Tanggal', align: 'left' },
            { label: 'Aksi', align: 'right' }
          ]}
        >
          {filteredNews.length > 0 ? (
            filteredNews.map((item) => (
              <tr key={item.id}>
                {/* Image thumbnail */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                  <div className="w-16 h-16 relative bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
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
                      height="100%"
                      className={item.image ? 'hidden' : ''}
                    />
                  </div>
                </td>

                {/* Title */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                  <div className="flex flex-col justify-center">
                    <h6 className="mb-0 text-sm font-semibold leading-normal text-slate-700 truncate max-w-xs">
                      {item.title}
                    </h6>
                    {item.summary && (
                      <p className="mb-0 text-xs text-slate-400 truncate max-w-xs">
                        {item.summary}
                      </p>
                    )}
                  </div>
                </td>

                {/* Category */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                  {item.category ? (
                    <ArgonBadge variant="info">
                      {item.category}
                    </ArgonBadge>
                  ) : (
                    <span className="text-slate-400 text-xs">-</span>
                  )}
                </td>

                {/* Is Featured */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                  {item.is_featured ? (
                    <ArgonBadge variant="success" gradient>
                      Ya
                    </ArgonBadge>
                  ) : (
                    <ArgonBadge variant="default">
                      Tidak
                    </ArgonBadge>
                  )}
                </td>

                {/* Writer */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent text-sm text-slate-500">
                  {item.user.name}
                </td>

                {/* Date */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                  <span className="text-xs font-semibold leading-tight text-slate-400">
                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      href={`/admin/news/${item.slug}`}
                      className="inline-flex items-center justify-center w-8 h-8 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Lihat"
                    >
                      <i className="fas fa-eye text-xs" />
                    </Link>
                    <Link
                      href={`/admin/news/${item.slug}/edit`}
                      className="inline-flex items-center justify-center w-8 h-8 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <i className="fas fa-edit text-xs" />
                    </Link>
                    <button
                      onClick={() => confirmDelete(item)}
                      className="inline-flex items-center justify-center w-8 h-8 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      <i className="fas fa-trash text-xs" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-8 text-center text-slate-400 text-sm">
                Tidak ada data berita yang ditemukan.
              </td>
            </tr>
          )}
        </ArgonTable>
      </ArgonCard>

      {/* Confirmation Modal */}
      <ArgonModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        title="Hapus Berita"
        icon={<i className="fas fa-exclamation-triangle text-red-600 text-lg" />}
        iconBg="bg-red-100"
        footer={
          <>
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-xs font-bold uppercase text-red-500 bg-red-600 hover:bg-red-700 rounded-lg shadow-md cursor-pointer transition-all duration-200"
              onClick={handleDelete}
            >
              Hapus
            </button>
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-xs font-bold uppercase text-slate-400 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200"
              onClick={cancelDelete}
            >
              Batal
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-500">
          Apakah Anda yakin ingin menghapus berita ini? Tindakan ini tidak dapat dibatalkan.
        </p>
      </ArgonModal>
    </AdminLayout>
  );
};

export default Index;