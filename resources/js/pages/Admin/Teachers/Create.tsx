import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import ArgonCard from '@/components/admin/ArgonCard';
import ArgonFormInput from '@/components/admin/ArgonFormInput';

export default function TeachersCreate() {
  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    position: '',
    subject: '',
    email: '',
    phone: '',
    education: '',
    order: 0,
    is_active: true,
    type: 'guru' as 'struktur' | 'guru',
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'order') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value.toString());
    });

    if (photo) {
      submitData.append('photo', photo);
    }

    router.post('/admin/teachers', submitData, {
      onError: (errors) => {
        setErrors(errors);
        setIsSubmitting(false);
      },
      onSuccess: () => {
        setIsSubmitting(false);
      },
    });
  };

  return (
    <AdminLayout>
      <Head title="Tambah Guru/Struktur" />

      {/* Header and Back Link */}
      <div className="mb-6">
        <Link
          href="/admin/teachers"
          className="text-white hover:text-white/80 inline-flex items-center text-sm transition-colors"
        >
          <i className="fas fa-arrow-left mr-1.5" /> Kembali ke Daftar Guru
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2">Tambah Guru / Staff Baru</h1>
      </div>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit}>
          <ArgonCard 
            title="Form Data Guru & Staff"
            footer={
              <div className="flex items-center justify-end space-x-3 w-full">
                <Link
                  href="/admin/teachers"
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
                      Simpan
                    </>
                  )}
                </button>
              </div>
            }
          >
            {/* Photo Upload */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                Foto
              </label>
              {photoPreview ? (
                <div className="relative inline-block group">
                  <div className="relative rounded-xl overflow-hidden shadow-md ring-2 ring-orange-500/20">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-transform transform hover:scale-105 cursor-pointer"
                        title="Hapus foto"
                      >
                        <i className="fas fa-times text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex justify-center items-center flex-col cursor-pointer hover:border-orange-500 hover:bg-orange-500/5 transition-all duration-300 group bg-white max-w-sm">
                  <div className="p-3 rounded-full bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors mb-3">
                    <i className="fas fa-upload text-orange-500 text-lg" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-orange-500 transition-colors text-center">
                    Klik untuk unggah foto
                  </p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
              {errors.photo && <p className="mt-2 text-xs text-red-500 font-semibold">{errors.photo}</p>}
            </div>

            {/* Type */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                Tipe *
              </label>
              <div className="relative flex flex-wrap items-stretch w-full transition-all rounded-lg ease">
                <span className="text-sm ease absolute z-50 -ml-px flex h-full items-center whitespace-nowrap rounded-lg rounded-tr-none rounded-br-none border border-r-0 border-transparent bg-transparent py-2 px-3 text-center font-normal text-slate-500 transition-all leading-5">
                  <i className="fas fa-user-tag" />
                </span>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="text-sm w-full rounded-lg border border-solid border-gray-300 bg-white py-2 pr-3 pl-9 text-slate-700 focus:border-orange-500 focus:outline-none focus:shadow-primary-outline transition-all"
                  required
                >
                  <option value="guru">Guru</option>
                  <option value="struktur">Struktur Organisasi</option>
                </select>
              </div>
              {errors.type && <p className="mt-2 text-xs text-red-500 font-semibold">{errors.type}</p>}
            </div>

            {/* Name */}
            <ArgonFormInput
              label="Nama Lengkap *"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              placeholder="Masukkan nama lengkap beserta gelar"
              icon="fas fa-user"
              required
            />

            {/* NIP */}
            <ArgonFormInput
              label="NIP / NUPTK"
              type="text"
              name="nip"
              value={formData.nip}
              onChange={handleInputChange}
              error={errors.nip}
              placeholder="Masukkan NIP jika ada"
              icon="fas fa-id-card"
            />

            {/* Position */}
            <ArgonFormInput
              label="Jabatan *"
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              error={errors.position}
              placeholder="Contoh: Kepala Sekolah, Guru Matematika"
              icon="fas fa-briefcase"
              required
            />

            {/* Subject */}
            <ArgonFormInput
              label="Mata Pelajaran"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              error={errors.subject}
              placeholder="Untuk guru, isi mata pelajaran yang diampu"
              icon="fas fa-book"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              {/* Email */}
              <ArgonFormInput
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                placeholder="contoh@email.com"
                icon="fas fa-envelope"
                wrapperClassName="mb-0"
              />

              {/* Phone */}
              <ArgonFormInput
                label="No. Telepon"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                placeholder="08xxxxxxxxxx"
                icon="fas fa-phone"
                wrapperClassName="mb-0"
              />
            </div>

            {/* Education */}
            <div className="mb-4">
              <label htmlFor="education" className="block text-xs font-bold uppercase text-slate-400 mb-2">
                Pendidikan Terakhir
              </label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                rows={3}
                placeholder="Contoh: S1 Pendidikan Matematika - Universitas Negeri Jakarta"
                className="text-sm w-full rounded-lg border border-solid border-gray-300 bg-white py-2 px-3 text-slate-700 focus:border-orange-500 focus:outline-none focus:shadow-primary-outline transition-all"
              />
              {errors.education && <p className="mt-2 text-xs text-red-500 font-semibold">{errors.education}</p>}
            </div>

            {/* Order */}
            <ArgonFormInput
              label="Urutan Tampilan *"
              type="number"
              name="order"
              value={formData.order}
              onChange={handleInputChange}
              error={errors.order}
              min="0"
              icon="fas fa-sort-numeric-down"
              required
            />
            <p className="mt-1 ml-1 text-xxs text-slate-400 -mt-3 mb-4">
              Angka lebih kecil akan ditampilkan lebih dahulu
            </p>

            {/* Is Active */}
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="h-5 w-5 text-orange-500 focus:ring-orange-500 border-gray-300 rounded cursor-pointer accent-orange-500"
              />
              <label htmlFor="is_active" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                Aktif (tampilkan di halaman publik)
              </label>
            </div>
          </ArgonCard>
        </form>
      </div>
    </AdminLayout>
  );
}
