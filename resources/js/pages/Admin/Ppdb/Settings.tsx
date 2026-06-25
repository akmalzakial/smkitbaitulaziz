import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import ArgonCard from '@/components/admin/ArgonCard';
import ArgonFormInput from '@/components/admin/ArgonFormInput';

interface PpdbSettingsProps {
    settings: {
        id: number;
        is_open: boolean;
        open_date: string | null;
        close_date: string | null;
        academic_year: string | null;
        message_closed: string | null;
    };
}

export default function PpdbSettings({ settings }: PpdbSettingsProps) {
    const { data, setData, put, processing, errors } = useForm({
        is_open: settings.is_open,
        open_date: settings.open_date || '',
        close_date: settings.close_date || '',
        academic_year: settings.academic_year || '',
        message_closed: settings.message_closed || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/spmb/settings');
    };

    return (
        <AdminLayout>
            <Head title="Pengaturan SPMB" />

            {/* Header Card */}
            <div className="mb-6">
                <Link
                    href="/admin/spmb"
                    className="text-white hover:text-white/80 inline-flex items-center text-sm transition-colors mb-4"
                >
                    <i className="fas fa-arrow-left mr-1.5" /> Kembali
                </Link>
                <h1 className="text-2xl font-bold text-white mb-1">Pengaturan SPMB</h1>
                <p className="text-white/80 text-sm">Atur jadwal pembukaan dan penutupan pendaftaran SPMB SMK IT Baitul Aziz.</p>
            </div>

            {/* Form Card */}
            <div className="max-w-3xl">
                <form onSubmit={handleSubmit}>
                    <ArgonCard 
                        title="Konfigurasi SPMB"
                        footer={
                            <div className="flex justify-end w-full">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-tl from-orange-500 to-yellow-500 text-white text-xs font-bold uppercase rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <i className="fas fa-save mr-2"></i>
                                    {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                                </button>
                            </div>
                        }
                    >
                        {/* Toggle Status */}
                        <div className="flex items-center justify-between p-4 mb-6 rounded-xl bg-gray-50 border border-gray-150">
                            <div>
                                <h6 className="mb-0 text-sm font-semibold text-slate-700">Status Pendaftaran SPMB</h6>
                                <p className="mb-0 text-xs text-slate-400">
                                    {data.is_open ? 'Pendaftaran sedang dibuka' : 'Pendaftaran sedang ditutup'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setData('is_open', !data.is_open)}
                                className={`w-14 h-8 rounded-full relative cursor-pointer border-none transition-all duration-300 ${
                                    data.is_open ? 'bg-orange-500' : 'bg-slate-300'
                                }`}
                            >
                                <span
                                    className={`w-6 h-6 rounded-full bg-white absolute top-1 shadow-md transition-all duration-300 ${
                                        data.is_open ? 'left-7' : 'left-1'
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Academic Year */}
                        <ArgonFormInput
                            label="Tahun Ajaran"
                            type="text"
                            value={data.academic_year}
                            onChange={(e) => setData('academic_year', e.target.value)}
                            error={errors.academic_year}
                            placeholder="2025/2026"
                            icon="fas fa-graduation-cap"
                        />

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                                    Tanggal Pembukaan
                                </label>
                                <div className="relative flex flex-wrap items-stretch w-full transition-all rounded-lg ease">
                                    <span className="text-sm ease absolute z-50 -ml-px flex h-full items-center whitespace-nowrap rounded-lg rounded-tr-none rounded-br-none border border-r-0 border-transparent bg-transparent py-2 px-3 text-center font-normal text-slate-500 transition-all leading-5">
                                        <i className="fas fa-calendar-alt" />
                                    </span>
                                    <input
                                        type="date"
                                        value={data.open_date}
                                        onChange={(e) => setData('open_date', e.target.value)}
                                        className="text-sm w-full rounded-lg border border-solid border-gray-300 bg-white py-2 pr-3 pl-9 text-slate-700 focus:border-orange-500 focus:outline-none focus:shadow-primary-outline transition-all"
                                    />
                                </div>
                                {errors.open_date && (
                                    <p className="mt-1 text-xs text-red-500 font-semibold">{errors.open_date}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                                    Tanggal Penutupan
                                </label>
                                <div className="relative flex flex-wrap items-stretch w-full transition-all rounded-lg ease">
                                    <span className="text-sm ease absolute z-50 -ml-px flex h-full items-center whitespace-nowrap rounded-lg rounded-tr-none rounded-br-none border border-r-0 border-transparent bg-transparent py-2 px-3 text-center font-normal text-slate-500 transition-all leading-5">
                                        <i className="fas fa-calendar-alt" />
                                    </span>
                                    <input
                                        type="date"
                                        value={data.close_date}
                                        onChange={(e) => setData('close_date', e.target.value)}
                                        className="text-sm w-full rounded-lg border border-solid border-gray-300 bg-white py-2 pr-3 pl-9 text-slate-700 focus:border-orange-500 focus:outline-none focus:shadow-primary-outline transition-all"
                                    />
                                </div>
                                {errors.close_date && (
                                    <p className="mt-1 text-xs text-red-500 font-semibold">{errors.close_date}</p>
                                )}
                            </div>
                        </div>

                        {/* Closed Message */}
                        <div className="mb-4">
                            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                                Pesan Saat SPMB Ditutup
                            </label>
                            <textarea
                                value={data.message_closed}
                                onChange={(e) => setData('message_closed', e.target.value)}
                                rows={3}
                                placeholder="Masukkan pesan yang akan ditampilkan saat pendaftaran ditutup..."
                                className="text-sm w-full rounded-lg border border-solid border-gray-300 bg-white py-2 px-3 text-slate-700 focus:border-orange-500 focus:outline-none focus:shadow-primary-outline transition-all resize-none"
                            />
                            {errors.message_closed && (
                                <p className="mt-1 text-xs text-red-500 font-semibold">{errors.message_closed}</p>
                            )}
                        </div>
                    </ArgonCard>
                </form>

                {/* Info Card */}
                <div className="relative flex flex-col min-w-0 break-words bg-blue-500/10 border border-blue-200 rounded-2xl bg-clip-border mt-6 p-5">
                    <h6 className="font-bold text-blue-700 mb-2 text-sm">
                        <i className="fas fa-info-circle mr-1.5"></i>
                        Informasi Penting
                    </h6>
                    <ul className="text-xs text-blue-700 space-y-1.5 list-disc list-inside">
                        <li>Jika <strong>Status Pendaftaran</strong> dinonaktifkan, calon siswa tidak dapat mengakses form pendaftaran.</li>
                        <li><strong>Tanggal Pembukaan</strong> dan <strong>Penutupan</strong> pendaftaran bersifat opsional.</li>
                        <li><strong>Pesan Saat Ditutup</strong> akan muncul di halaman pendaftaran ketika status pendaftaran tidak aktif.</li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
}
