import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import ArgonCard from '@/components/admin/ArgonCard';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

interface ShowProps {
  message: ContactMessage;
}

export default function Show({ message }: ShowProps) {
  const handleDelete = () => {
    if (confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
      router.delete(route('admin.messages.destroy', message.id));
    }
  };

  return (
    <AdminLayout>
      <Head title={`Detail Pesan - ${message.subject}`} />

      {/* Header and Back Link */}
      <div className="mb-6">
        <Link
          href={route('admin.messages.index')}
          className="text-white hover:text-white/80 inline-flex items-center text-sm transition-colors"
        >
          <i className="fas fa-arrow-left mr-1.5" /> Kembali ke Daftar Pesan
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2">Detail Pesan Masuk</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Content */}
        <div className="lg:col-span-2">
          <ArgonCard
            title={message.subject}
            subtitle={`Dikirim oleh: ${message.name} (${message.email})`}
          >
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Isi Pesan:</p>
              <div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm whitespace-pre-wrap leading-relaxed min-h-[200px]">
                {message.message}
              </div>
            </div>
          </ArgonCard>
        </div>

        {/* Message Meta & Actions */}
        <div className="space-y-6">
          <ArgonCard title="Detail Informasi">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Pengirim</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{message.name}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Email</p>
                <a
                  href={`mailto:${message.email}`}
                  className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors mt-0.5 block"
                >
                  {message.email}
                </a>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Tanggal Terima</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">
                  {new Date(message.created_at).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Status</p>
                <span className="inline-block mt-1.5 px-2.5 py-1 text-xs font-bold text-center uppercase align-baseline rounded-md bg-emerald-100 text-emerald-800">
                  Sudah Dibaca
                </span>
              </div>
            </div>
          </ArgonCard>

          <ArgonCard title="Aksi">
            <div className="space-y-3">
              <a
                href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                className="w-full inline-flex justify-center items-center px-4 py-2.5 text-xs font-bold text-center text-white uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer hover:shadow-lg active:opacity-85 tracking-tight-rem bg-gradient-to-tl from-emerald-600 to-teal-400"
              >
                <i className="fas fa-reply mr-2" /> Balas via Email
              </a>

              <button
                onClick={handleDelete}
                className="w-full inline-flex justify-center items-center px-4 py-2.5 text-xs font-bold text-center text-white uppercase align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer hover:shadow-lg active:opacity-85 tracking-tight-rem bg-gradient-to-tl from-red-600 to-orange-600"
              >
                <i className="fas fa-trash mr-2" /> Hapus Pesan
              </button>
            </div>
          </ArgonCard>
        </div>
      </div>
    </AdminLayout>
  );
}
