import React, { FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import ArgonCard from '@/components/admin/ArgonCard';
import ArgonFormInput from '@/components/admin/ArgonFormInput';

interface ContactSetting {
  id: number;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  work_hours: string;
  map_embed_url: string;
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  created_at: string;
  updated_at: string;
}

interface IndexProps {
  settings: ContactSetting;
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function Index({ settings, flash }: IndexProps) {
  const { data, setData, put, processing, errors } = useForm({
    address: settings.address || '',
    phone: settings.phone || '',
    whatsapp: settings.whatsapp || '',
    email: settings.email || '',
    work_hours: settings.work_hours || '',
    map_embed_url: settings.map_embed_url || '',
    facebook_url: settings.facebook_url || '',
    instagram_url: settings.instagram_url || '',
    youtube_url: settings.youtube_url || '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(route('admin.contact.update'));
  };

  return (
    <AdminLayout>
      <Head title="Manajemen Informasi Kontak & Media Sosial" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Informasi Kontak & Media Sosial</h1>
        <p className="text-white/80 text-sm mt-1">
          Kelola alamat fisik, kontak utama sekolah, link Google Maps embed, serta akun media sosial resmi.
        </p>
      </div>

      {flash?.success && (
        <div className="mb-6 p-4 bg-emerald-500 text-white rounded-2xl shadow-lg flex items-center">
          <i className="fas fa-check-circle mr-2 text-lg" />
          <span className="font-semibold text-sm">{flash.success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <ArgonCard title="Informasi Kontak Utama">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="address" className="inline-block mb-2 ml-1 text-xs font-bold uppercase text-slate-400">
                    Alamat Fisik Sekolah *
                  </label>
                  <textarea
                    id="address"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    placeholder="Masukkan alamat lengkap sekolah..."
                    className={`text-sm focus:shadow-primary-outline ease w-full leading-5.6 relative block min-w-0 flex-auto rounded-lg border border-solid bg-white bg-clip-padding py-2 px-3 text-gray-700 transition-all placeholder:text-gray-500 focus:outline-none focus:transition-shadow ${
                      errors.address ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                    }`}
                    rows={3}
                  />
                  {errors.address && (
                    <p className="mt-1 ml-1 text-xs text-red-500 font-semibold">{errors.address}</p>
                  )}
                </div>

                <ArgonFormInput
                  label="Nomor Telepon *"
                  type="text"
                  id="phone"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  placeholder="Misal: (022) 8596 3085"
                  error={errors.phone}
                />

                <ArgonFormInput
                  label="Nomor WhatsApp *"
                  type="text"
                  id="whatsapp"
                  value={data.whatsapp}
                  onChange={(e) => setData('whatsapp', e.target.value)}
                  placeholder="Format internasional, misal: 62895610055000"
                  error={errors.whatsapp}
                />

                <ArgonFormInput
                  label="Email Sekolah *"
                  type="email"
                  id="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="info@smkitbaitulaziz.sch.id"
                  error={errors.email}
                />

                <ArgonFormInput
                  label="Jam Operasional *"
                  type="text"
                  id="work_hours"
                  value={data.work_hours}
                  onChange={(e) => setData('work_hours', e.target.value)}
                  placeholder="Misal: Senin - Jumat: 07:00 - 16:00"
                  error={errors.work_hours}
                />

                <div className="md:col-span-2">
                  <ArgonFormInput
                    label="URL Embed Google Maps *"
                    type="text"
                    id="map_embed_url"
                    value={data.map_embed_url}
                    onChange={(e) => setData('map_embed_url', e.target.value)}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    error={errors.map_embed_url}
                  />
                  <p className="text-xs text-slate-400 mt-1 ml-1">
                    Masukkan URL dalam atribut src pada kode embed iframe Google Maps.
                  </p>
                </div>
              </div>
            </ArgonCard>

            <ArgonCard title="Preview Peta Lokasi">
              {data.map_embed_url ? (
                <div className="relative rounded-lg overflow-hidden border border-gray-200 h-[280px]">
                  <iframe
                    src={data.map_embed_url}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Map Preview"
                  />
                </div>
              ) : (
                <div className="h-[280px] bg-slate-100 flex items-center justify-center rounded-lg border border-dashed border-gray-300">
                  <p className="text-sm text-slate-400">Masukkan URL embed Google Maps untuk melihat preview</p>
                </div>
              )}
            </ArgonCard>
          </div>

          {/* Right Info - Social Media & Action */}
          <div className="space-y-6">
            <ArgonCard title="Media Sosial Sekolah">
              <div className="space-y-4">
                <ArgonFormInput
                  label="Facebook URL"
                  type="text"
                  id="facebook_url"
                  icon="fab fa-facebook text-blue-600"
                  value={data.facebook_url}
                  onChange={(e) => setData('facebook_url', e.target.value)}
                  placeholder="https://facebook.com/..."
                  error={errors.facebook_url}
                />

                <ArgonFormInput
                  label="Instagram URL"
                  type="text"
                  id="instagram_url"
                  icon="fab fa-instagram text-pink-600"
                  value={data.instagram_url}
                  onChange={(e) => setData('instagram_url', e.target.value)}
                  placeholder="https://www.instagram.com/..."
                  error={errors.instagram_url}
                />

                <ArgonFormInput
                  label="YouTube URL"
                  type="text"
                  id="youtube_url"
                  icon="fab fa-youtube text-red-600"
                  value={data.youtube_url}
                  onChange={(e) => setData('youtube_url', e.target.value)}
                  placeholder="https://www.youtube.com/..."
                  error={errors.youtube_url}
                />
              </div>
            </ArgonCard>

            <ArgonCard title="Simpan Perubahan">
              <p className="text-xs text-slate-500 mb-4">
                Pastikan seluruh informasi yang Anda isi telah valid dan sesuai. Informasi ini akan langsung diperbarui secara realtime di seluruh bagian website, termasuk footer dan halaman kontak.
              </p>
              <button
                type="submit"
                disabled={processing}
                className="w-full inline-block px-8 py-3 text-xs font-bold text-center text-white uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer hover:shadow-lg active:opacity-85 tracking-tight-rem bg-gradient-to-tl from-orange-500 to-amber-400 disabled:opacity-50"
              >
                {processing ? 'Menyimpan...' : 'Simpan Setelan'}
              </button>
            </ArgonCard>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
