import React, { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import ArgonCard from '@/components/admin/ArgonCard';
import ArgonFormInput from '@/components/admin/ArgonFormInput';

const Create: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Daftar kategori yang tersedia
  const availableCategories = ['Kegiatan Sekolah', 'Ekstrakurikuler', 'Prestasi', 'Fasilitas', 'Lainnya'];

  // Menangani perubahan file gambar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);

      // Membuat URL preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Hapus error jika ada
      if (errors.image) {
        const newErrors = { ...errors };
        delete newErrors.image;
        setErrors(newErrors);
      }
    }
  };

  // Menghapus gambar yang sudah dipilih
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validasi form sebelum submit
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Judul wajib diisi';
    }

    if (!image) {
      newErrors.image = 'Foto wajib diunggah';
    } else {
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (image.size > maxSize) {
        newErrors.image = 'Ukuran foto maksimal 2MB';
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(image.type)) {
        newErrors.image = 'Format foto harus JPG, PNG, atau WebP';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Menangani submit form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('is_featured', isFeatured ? '1' : '0');
    if (image) {
      formData.append('image', image);
    }

    router.post('/admin/gallery', formData, {
      onSuccess: () => {
        router.visit('/admin/gallery');
      },
      onError: (errors) => {
        setErrors(errors);
        setIsSubmitting(false);
      },
      onFinish: () => {
        setIsSubmitting(false);
      }
    });
  };

  return (
    <AdminLayout>
      <Head title="Tambah Galeri - SMK IT Baitul Aziz" />

      {/* Header and Back Link */}
      <div className="mb-6">
        <Link
          href="/admin/gallery"
          className="text-white hover:text-white/80 inline-flex items-center text-sm transition-colors"
        >
          <i className="fas fa-arrow-left mr-1.5" /> Kembali ke Daftar Galeri
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2">Tambah Foto ke Galeri</h1>
      </div>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit}>
          <ArgonCard 
            title="Form Upload Foto"
            footer={
              <div className="flex items-center justify-end space-x-3 w-full">
                <Link
                  href="/admin/gallery"
                  className="px-4 py-2 text-xs font-bold uppercase text-slate-400 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-tl from-orange-500 to-yellow-500 text-white text-xs font-bold uppercase rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner animate-spin mr-1.5" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-1.5" />
                      Simpan Foto
                    </>
                  )}
                </button>
              </div>
            }
          >
            {/* Image upload area */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase text-slate-400 mb-3">
                Foto *
              </label>
              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 border-2 border-dashed border-gray-300 rounded-xl p-10 flex justify-center items-center flex-col cursor-pointer hover:border-orange-500 hover:bg-orange-500/5 transition-all duration-300 group"
                >
                  <div className="p-4 rounded-full bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors mb-3">
                    <i className="fas fa-upload text-orange-500 text-xl" />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-700 group-hover:text-orange-500 transition-colors">
                    Klik untuk mengunggah foto
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    JPG, PNG, atau WebP (maks. 2MB)
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    title="Unggah foto"
                  />
                </div>
              ) : (
                <div className="mt-1 relative group">
                  <div className="relative rounded-xl overflow-hidden shadow-md ring-2 ring-orange-500/20 max-w-md mx-auto">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex justify-end">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 px-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2 text-xs font-semibold cursor-pointer"
                        title="Hapus gambar"
                      >
                        <i className="fas fa-trash text-xs" />
                        Hapus Foto
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 text-center">
                    Klik tombol Hapus Foto untuk mengganti foto
                  </p>
                </div>
              )}
              {errors.image && (
                <p className="mt-2 text-xs text-red-500 font-semibold flex items-center">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  {errors.image}
                </p>
              )}
            </div>

            {/* Judul */}
            <ArgonFormInput
              label="Judul *"
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              placeholder="Masukkan judul foto"
              icon="fas fa-heading"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              {/* Kategori */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="category" className="block text-xs font-bold uppercase text-slate-400">
                    Kategori <span className="text-slate-300 font-normal">(opsional)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomCategory(!isCustomCategory);
                      setCategory('');
                    }}
                    className="text-xs font-semibold text-orange-500 hover:text-orange-700 transition-colors"
                  >
                    {isCustomCategory ? 'Pilih dari Daftar' : '+ Kategori Baru'}
                  </button>
                </div>
                <div className="relative flex flex-wrap items-stretch w-full transition-all rounded-lg ease">
                  <span className="text-sm ease absolute z-50 -ml-px flex h-full items-center whitespace-nowrap rounded-lg rounded-tr-none rounded-br-none border border-r-0 border-transparent bg-transparent py-2 px-3 text-center font-normal text-slate-500 transition-all leading-5">
                    <i className="fas fa-folder" />
                  </span>
                  {isCustomCategory ? (
                    <input
                      type="text"
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Masukkan kategori baru"
                      className="text-sm w-full rounded-lg border border-solid border-gray-300 bg-white py-2 pr-3 pl-9 text-slate-700 focus:border-orange-500 focus:outline-none focus:shadow-primary-outline transition-all"
                    />
                  ) : (
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="text-sm w-full rounded-lg border border-solid border-gray-300 bg-white py-2 pr-3 pl-9 text-slate-700 focus:border-orange-500 focus:outline-none focus:shadow-primary-outline transition-all"
                    >
                      <option value="">-- Pilih Kategori --</option>
                      {availableCategories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Unggulan */}
              <div className="flex items-start pt-7">
                <div className="flex items-center h-5">
                  <input
                    id="is_featured"
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-5 w-5 text-orange-500 focus:ring-orange-500 border-gray-300 rounded cursor-pointer accent-orange-500"
                  />
                </div>
                <div className="ml-3 text-xs">
                  <label htmlFor="is_featured" className="font-bold text-slate-700 select-none cursor-pointer">
                    Jadikan Foto Unggulan
                  </label>
                  <p className="text-slate-400 mt-0.5">
                    Foto akan ditampilkan di halaman depan website sekolah
                  </p>
                </div>
              </div>
            </div>

            {/* Deskripsi */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-xs font-bold uppercase text-slate-400 mb-2">
                Deskripsi <span className="text-slate-300 font-normal">(opsional)</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="text-sm w-full rounded-lg border border-solid border-gray-300 bg-white py-2 px-3 text-slate-700 focus:border-orange-500 focus:outline-none focus:shadow-primary-outline transition-all"
                placeholder="Tuliskan deskripsi lengkap mengenai foto ini..."
              />
            </div>
          </ArgonCard>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Create;