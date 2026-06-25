import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
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

interface IndexProps {
  extracurriculars: Extracurricular[];
}

export default function Index({ extracurriculars }: IndexProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [extracurricularToDelete, setExtracurricularToDelete] = useState<Extracurricular | null>(null);

  // Filter ekstrakurikuler berdasarkan pencarian
  const filteredExtracurriculars = extracurriculars.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.coach && item.coach.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handler untuk konfirmasi hapus
  const handleDeleteClick = (extracurricular: Extracurricular) => {
    setExtracurricularToDelete(extracurricular);
    setIsDeleteModalOpen(true);
  };

  // Handler untuk proses hapus
  const handleDeleteConfirm = () => {
    if (extracurricularToDelete) {
      router.delete(route('admin.extracurriculars.destroy', extracurricularToDelete.id), {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setExtracurricularToDelete(null);
        }
      });
    }
  };

  // Handler untuk batalkan hapus
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setExtracurricularToDelete(null);
  };

  return (
    <AdminLayout>
      <Head title="Manajemen Ekstrakurikuler" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Ekstrakurikuler</h1>
        <p className="text-white/80 text-sm">
          Kelola daftar kegiatan ekstrakurikuler yang tersedia di SMK IT Baitul Aziz.
        </p>
      </div>

      {/* List Card */}
      <ArgonCard
        title="Daftar Ekstrakurikuler"
        headerRight={
          <Link
            href={route('admin.extracurriculars.create')}
            className="inline-block px-4 py-2 bg-gradient-to-tl from-orange-500 to-yellow-500 text-white text-xs font-bold uppercase rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-px"
          >
            <i className="fas fa-plus mr-1.5" /> Tambah Ekstrakurikuler
          </Link>
        }
        noPadding
      >
        {/* Search */}
        <div className="p-6 pb-2">
          <div className="flex justify-end">
            <div className="w-full md:w-72">
              <ArgonFormInput
                type="text"
                placeholder="Cari ekstrakurikuler..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon="fas fa-search"
                wrapperClassName="mb-0"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <ArgonTable
          headers={[
            'ID',
            'Nama',
            'Pembina',
            'Jadwal',
            { label: 'Status', align: 'left' },
            { label: 'Aksi', align: 'right' }
          ]}
        >
          {filteredExtracurriculars.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-slate-400 text-sm">
                Belum ada data ekstrakurikuler yang ditemukan.
              </td>
            </tr>
          ) : (
            filteredExtracurriculars.map((item) => (
              <tr key={item.id}>
                {/* ID */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent text-xs font-semibold leading-tight text-slate-400">
                  {item.id}
                </td>

                {/* Name & Location & Image */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gray-100 overflow-hidden shadow-sm border border-gray-100">
                      {item.image ? (
                        <img
                          src={`/storage/${item.image}`}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-400">
                          <i className="fas fa-image text-sm" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex flex-col justify-center">
                      <div className="text-sm font-semibold text-slate-700 leading-normal">{item.name}</div>
                      {item.location && <div className="text-xs text-slate-400">{item.location}</div>}
                    </div>
                  </div>
                </td>

                {/* Coach */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent text-xs font-semibold leading-tight text-slate-500">
                  {item.coach || '-'}
                </td>

                {/* Schedule */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent text-xs font-semibold leading-tight text-slate-500">
                  {item.schedule || '-'}
                </td>

                {/* Status */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                  {item.is_active ? (
                    <ArgonBadge variant="success" gradient>Aktif</ArgonBadge>
                  ) : (
                    <ArgonBadge variant="danger">Tidak Aktif</ArgonBadge>
                  )}
                </td>

                {/* Actions */}
                <td className="p-2 px-6 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      href={`/ekstrakurikuler/${item.slug}`}
                      className="inline-flex items-center justify-center w-8 h-8 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-lg transition-colors"
                      target="_blank"
                      title="Lihat"
                    >
                      <i className="fas fa-eye text-xs" />
                    </Link>
                    <Link
                      href={route('admin.extracurriculars.edit', item.id)}
                      className="inline-flex items-center justify-center w-8 h-8 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <i className="fas fa-edit text-xs" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(item)}
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
      </ArgonCard>

      {/* Delete Confirmation Modal */}
      <ArgonModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        title="Hapus Ekstrakurikuler"
        icon={<i className="fas fa-trash text-red-600 text-lg" />}
        iconBg="bg-red-100"
        footer={
          <>
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-xs font-bold uppercase text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md cursor-pointer transition-all duration-200"
              onClick={handleDeleteConfirm}
            >
              Hapus
            </button>
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-xs font-bold uppercase text-slate-400 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200"
              onClick={handleDeleteCancel}
            >
              Batal
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-500">
          Apakah Anda yakin ingin menghapus ekstrakurikuler "{extracurricularToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.
        </p>
      </ArgonModal>
    </AdminLayout>
  );
}