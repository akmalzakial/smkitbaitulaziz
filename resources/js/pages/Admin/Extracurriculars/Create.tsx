import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import ArgonCard from '@/components/admin/ArgonCard';
import ArgonFormInput from '@/components/admin/ArgonFormInput';

export default function Create() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    description: '',
    image: null as File | null,
    schedule: '',
    coach: '',
    location: '',
    is_active: true
  });

  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('admin.extracurriculars.store'), {
      onSuccess: () => {
        reset();
        setPreview(null);
      }
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setData('image', file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setData('image', null);
    setPreview(null);
  };

  return (
    <AdminLayout>
      <Head title="Tambah Ekstrakurikuler" />

      {/* Header and Back Link */}
      <div className="mb-6">
        <Link
          href={route('admin.extracurriculars.index')}
          className="text-white hover:text-white/80 inline-flex items-center text-sm transition-colors"
        >
          <i className="fas fa-arrow-left mr-1.5" /> Kembali ke Daftar Ekstrakurikuler
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2">Tambah Ekstrakurikuler Baru</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <ArgonCard title="Informasi Dasar & Detail">
              {/* Nama Ekstrakurikuler */}
              <ArgonFormInput
                label="Nama Ekstrakurikuler *"
                type="text"
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                error={errors.name}
                placeholder="Contoh: Pramuka, Futsal, Rohis..."
                icon="fas fa-heading"
                required
              />

              {/* Deskripsi */}
              <div className="mb-4">
                <label htmlFor="description" className="block text-xs font-bold uppercase text-slate-400 mb-2">
                  Deskripsi Lengkap
                </label>
                <textarea
                  id="description"
                  rows={5}
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="text-sm w-full rounded-lg border border-solid border-gray-300 bg-white py-2 px-3 text-slate-700 focus:border-orange-500 focus:outline-none focus:shadow-primary-outline transition-all"
                  placeholder="Jelaskan tentang kegiatan ekstrakurikuler ini, visi misi, atau prestasi..."
                />
                {errors.description && (
                  <p className="mt-2 text-xs text-red-500 font-semibold">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Pembina */}
                <ArgonFormInput
                  label="Nama Pembina"
                  type="text"
                  id="coach"
                  value={data.coach}
                  onChange={(e) => setData('coach', e.target.value)}
                  error={errors.coach}
                  placeholder="Nama Lengkap Pembina"
                  icon="fas fa-user-tie"
                  wrapperClassName="mb-0"
                />

                {/* Lokasi */}
                <ArgonFormInput
                  label="Lokasi Latihan"
                  type="text"
                  id="location"
                  value={data.location}
                  onChange={(e) => setData('location', e.target.value)}
                  error={errors.location}
                  placeholder="Lapangan, Aula, Lab..."
                  icon="fas fa-map-marker-alt"
                  wrapperClassName="mb-0"
                />
              </div>

              {/* Jadwal */}
              <ArgonFormInput
                label="Jadwal Kegiatan"
                type="text"
                id="schedule"
                value={data.schedule}
                onChange={(e) => setData('schedule', e.target.value)}
                error={errors.schedule}
                placeholder="Contoh: Setiap Hari Jumat, Pukul 14.00 - 16.00 WIB"
                icon="fas fa-calendar-alt"
                wrapperClassName="mt-4 mb-0"
              />
            </ArgonCard>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Logo / Foto Kegiatan */}
            <ArgonCard title="Logo / Foto">
              {!preview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex justify-center items-center flex-col cursor-pointer hover:border-orange-500 hover:bg-orange-500/5 transition-all duration-300 group bg-white">
                  <label
                    htmlFor="image"
                    className="w-full flex flex-col items-center cursor-pointer"
                  >
                    <div className="p-3 rounded-full bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors mb-3">
                      <i className="fas fa-upload text-orange-500 text-lg" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700 group-hover:text-orange-500 transition-colors text-center">
                      Klik untuk unggah foto
                    </p>
                    <p className="text-xs text-slate-400 mt-1 text-center">
                      Max 2MB (PNG/JPG/WebP)
                    </p>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                </div>
              ) : (
                <div className="relative group">
                  <div className="relative rounded-xl overflow-hidden shadow-md ring-2 ring-orange-500/20 bg-white">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex justify-end">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="bg-red-600 hover:bg-red-700 text-white p-1.5 px-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                      >
                        <i className="fas fa-trash text-xs" />
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {errors.image && (
                <p className="mt-2 text-xs text-red-500 font-semibold flex items-center">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  {errors.image}
                </p>
              )}
            </ArgonCard>

            {/* Status */}
            <ArgonCard title="Status">
              <div className="mb-4">
                <label htmlFor="is_active" className="block text-xs font-bold uppercase text-slate-400 mb-2">
                  Status Aktivitas
                </label>
                <div className="relative flex flex-wrap items-stretch w-full transition-all rounded-lg ease">
                  <span className="text-sm ease absolute z-50 -ml-px flex h-full items-center whitespace-nowrap rounded-lg rounded-tr-none rounded-br-none border border-r-0 border-transparent bg-transparent py-2 px-3 text-center font-normal text-slate-500 transition-all leading-5">
                    <i className="fas fa-info-circle" />
                  </span>
                  <select
                    id="is_active"
                    value={data.is_active ? '1' : '0'}
                    onChange={(e) => {
                      const isActive = e.target.value === '1';
                      setData('is_active', isActive as any);
                    }}
                    className="text-sm w-full rounded-lg border border-solid border-gray-300 bg-white py-2 pr-3 pl-9 text-slate-700 focus:border-orange-500 focus:outline-none focus:shadow-primary-outline transition-all"
                  >
                    <option value="1">Aktif</option>
                    <option value="0">Tidak Aktif</option>
                  </select>
                </div>
              </div>
              <p className="text-xxs text-slate-400">
                Ekstrakurikuler yang tidak aktif tidak akan ditampilkan di halaman publik.
              </p>
            </ArgonCard>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100 mt-6">
          <Link
            href={route('admin.extracurriculars.index')}
            className="px-4 py-2 text-xs font-bold uppercase text-slate-400 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={processing}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-tl from-orange-500 to-yellow-500 text-white text-xs font-bold uppercase rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <i className="fas fa-spinner animate-spin mr-1.5" />
                Menyimpan...
              </>
            ) : (
              <>
                <i className="fas fa-save mr-1.5" />
                Simpan Ekstrakurikuler
              </>
            )}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}