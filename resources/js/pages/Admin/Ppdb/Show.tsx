import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import ArgonCard from '@/components/admin/ArgonCard';
import ArgonBadge from '@/components/admin/ArgonBadge';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Ppdb {
  id: number;
  nama_lengkap: string;
  nomor_pendaftaran: string;
  nisn: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  telepon_hp: string;
  alamat: string | null;
  rt: string | null;
  rw: string | null;
  desa: string | null;
  kecamatan: string | null;
  kabupaten: string | null;
  kode_pos: string | null;
  sekolah_asal: string;
  alamat_sekolah: string | null;
  telepon_sekolah: string | null;
  nama_ayah: string | null;
  pekerjaan_ayah: string | null;
  telepon_rumah: string | null;
  nama_ibu: string | null;
  pekerjaan_ibu: string | null;
  alamat_ortu: string | null;
  rt_ortu: string | null;
  rw_ortu: string | null;
  desa_ortu: string | null;
  kecamatan_ortu: string | null;
  kabupaten_ortu: string | null;
  kode_pos_ortu: string | null;
  status: string;
  catatan: string | null;
  created_at: string;
  user: User | null;
}

interface Document {
  name: string;
  size: string;
  url: string;
}

interface Props {
  auth: any;
  ppdb: Ppdb | null;
  documents?: Document[];
}

export default function AdminPpdbShow({ ppdb, documents = [] }: Props) {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const action = urlParams.get('action');
  
  // Detect action=edit from URL and open edit form automatically
  useEffect(() => {
    if (action === 'edit') {
      setIsEditingStatus(true);
    }
  }, [action]);
  
  const { data, setData, post, processing, errors } = useForm({
    status: ppdb?.status || 'Menunggu',
    notes: ppdb?.catatan || '',
    _method: 'PUT'
  });
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setData('status', e.target.value);
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData('notes', e.target.value);
  };
  
  const submitStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ppdb) return;
    post(route('admin.spmb.update-status', ppdb.id), {
      onSuccess: () => {
        setIsEditingStatus(false);
        setIsEditingNotes(false);
      },
      preserveScroll: true
    });
  };

  // Jika data tidak ditemukan
  if (!ppdb) {
    return (
      <AdminLayout>
        <Head title="Data Tidak Ditemukan - Admin Dashboard" />
        
        <div className="px-6 py-12">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-xl border border-gray-200 text-center">
            <i className="fas fa-exclamation-triangle text-red-500 text-5xl mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Data Tidak Ditemukan</h2>
            <p className="text-slate-500 mb-8">
              Data pendaftaran PPDB tidak ditemukan atau telah dihapus.
            </p>
            <div className="flex justify-center">
              <Link 
                href={route('admin.spmb.index')} 
                className="inline-block px-6 py-3 bg-gradient-to-tl from-orange-500 to-yellow-500 text-white font-bold uppercase rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-px text-xs"
              >
                Kembali ke Daftar Pendaftar
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head title={`Detail Pendaftaran ${ppdb.nama_lengkap} - Admin Dashboard`} />
      
      {/* Header and Back Link */}
      <div className="mb-6">
        <Link 
          href={route('admin.spmb.index')}
          className="text-white hover:text-white/80 inline-flex items-center text-sm transition-colors mb-4"
        >
          <i className="fas fa-arrow-left mr-1.5" /> Kembali ke Daftar Pendaftar
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{ppdb.nama_lengkap}</h1>
            <p className="text-white/80 text-sm">
              Nomor Pendaftaran: <span className="font-bold">{ppdb.nomor_pendaftaran}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Link 
              href={route('admin.spmb.print', ppdb.id)} 
              target="_blank"
              className="inline-block px-4 py-2 bg-white text-slate-700 text-xs font-bold uppercase rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-px text-center"
            >
              <i className="fas fa-print mr-1.5 text-orange-500" /> Cetak Formulir
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns (Siswa Details, Parent Details, dsb.) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Biodata Siswa */}
          <ArgonCard title="Biodata Siswa">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DataItem label="Nama Lengkap" value={ppdb.nama_lengkap} icon="fas fa-user text-orange-500" />
              <DataItem label="NISN" value={ppdb.nisn} icon="fas fa-id-card text-orange-500" />
              <DataItem label="Tempat Lahir" value={ppdb.tempat_lahir} icon="fas fa-map-marker-alt text-orange-500" />
              <DataItem 
                label="Tanggal Lahir" 
                value={new Date(ppdb.tanggal_lahir).toLocaleDateString('id-ID', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })} 
                icon="fas fa-calendar-alt text-orange-500"
              />
              <DataItem label="Jenis Kelamin" value={ppdb.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} icon="fas fa-venus-mars text-orange-500" />
              <DataItem label="Email Akun" value={ppdb.user?.email} icon="fas fa-envelope text-orange-500" />
              <DataItem label="No. Telepon / HP" value={ppdb.telepon_hp} icon="fas fa-phone text-orange-500" />
              <DataItem 
                label="Alamat Lengkap" 
                value={
                  ppdb.alamat ? 
                  `${ppdb.alamat || ''} ${ppdb.rt ? `RT.${ppdb.rt}` : ''} ${ppdb.rw ? `RW.${ppdb.rw}` : ''} ${ppdb.desa || ''}, ${ppdb.kecamatan || ''}, ${ppdb.kabupaten || ''} ${ppdb.kode_pos || ''}`
                  : '-'
                } 
                icon="fas fa-home text-orange-500" 
                span="md:col-span-2" 
              />
            </div>
          </ArgonCard>
          
          {/* Data Asal Sekolah */}
          <ArgonCard title="Data Asal Sekolah">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DataItem label="Sekolah Asal" value={ppdb.sekolah_asal} icon="fas fa-school text-orange-500" />
              <DataItem label="Alamat Sekolah" value={ppdb.alamat_sekolah} icon="fas fa-map-marked-alt text-orange-500" />
              <DataItem label="Telepon Sekolah" value={ppdb.telepon_sekolah} icon="fas fa-phone-alt text-orange-500" />
            </div>
          </ArgonCard>
          
          {/* Data Orang Tua */}
          <ArgonCard title="Data Orang Tua">
            <div className="space-y-6">
              <div>
                <h6 className="text-xs font-bold uppercase text-slate-400 mb-3 pb-1 border-b border-gray-100">Data Ayah</h6>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <DataItem label="Nama Ayah" value={ppdb.nama_ayah} />
                  <DataItem label="Pekerjaan Ayah" value={ppdb.pekerjaan_ayah} />
                  <DataItem label="No. Telepon Rumah" value={ppdb.telepon_rumah} />
                </div>
              </div>
              
              <div>
                <h6 className="text-xs font-bold uppercase text-slate-400 mb-3 pb-1 border-b border-gray-100">Data Ibu</h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DataItem label="Nama Ibu" value={ppdb.nama_ibu} />
                  <DataItem label="Pekerjaan Ibu" value={ppdb.pekerjaan_ibu} />
                </div>
              </div>
              
              <div>
                <h6 className="text-xs font-bold uppercase text-slate-400 mb-3 pb-1 border-b border-gray-100">Alamat Orang Tua</h6>
                <div className="grid grid-cols-1 gap-6">
                  <DataItem 
                    label="Alamat Tinggal Orang Tua" 
                    value={
                      ppdb.alamat_ortu ? 
                      `${ppdb.alamat_ortu || ''} ${ppdb.rt_ortu ? `RT.${ppdb.rt_ortu}` : ''} ${ppdb.rw_ortu ? `RW.${ppdb.rw_ortu}` : ''} ${ppdb.desa_ortu || ''}, ${ppdb.kecamatan_ortu || ''}, ${ppdb.kabupaten_ortu || ''} ${ppdb.kode_pos_ortu || ''}`
                      : '-'
                    } 
                    icon="fas fa-home text-orange-500" 
                  />
                </div>
              </div>
            </div>
          </ArgonCard>
          
          {/* Jurusan */}
          <ArgonCard title="Kompetensi Keahlian (Jurusan)">
            <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                <i className="fas fa-laptop-code text-base" />
              </div>
              <div>
                <h6 className="text-slate-800 font-bold text-sm mb-1">PPLG (Pengembangan Perangkat Lunak dan Gim)</h6>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Program keahlian yang berfokus pada analisis, desain, coding, pengembangan, dan pengujian perangkat lunak, aplikasi, serta game digital.
                </p>
              </div>
            </div>
          </ArgonCard>
        </div>
        
        {/* Right Column: Status & Catatan & Dokumen */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Status Pendaftaran Card */}
          <ArgonCard 
            title="Status Pendaftaran"
            headerRight={
              <button
                type="button"
                onClick={() => setIsEditingStatus(!isEditingStatus)}
                className="text-orange-500 hover:text-orange-600 text-xs font-bold uppercase transition-colors"
              >
                {isEditingStatus ? 'Batal' : 'Ubah'}
              </button>
            }
          >
            {isEditingStatus ? (
              <form onSubmit={submitStatus} className="space-y-4">
                <div>
                  <label htmlFor="status-select" className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Pilih Status
                  </label>
                  <select
                    id="status-select"
                    name="status"
                    value={data.status}
                    onChange={handleStatusChange}
                    className="focus:shadow-primary-outline text-xs leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-semibold text-slate-700 outline-none transition-all focus:border-orange-500 focus:outline-none"
                    aria-label="Pilih status pendaftaran"
                  >
                    <option value="Menunggu">Menunggu Verifikasi</option>
                    <option value="Verifikasi">Verifikasi Dokumen</option>
                    <option value="Diterima">Diterima</option>
                    <option value="Ditolak">Ditolak</option>
                    <option value="Cadangan">Cadangan</option>
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-xs text-red-500 font-semibold">{errors.status}</p>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-gradient-to-tl from-orange-500 to-yellow-500 text-white font-bold uppercase rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-px text-[10px] disabled:opacity-50"
                  >
                    <i className="fas fa-save mr-1.5" /> Simpan Status
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-xs font-semibold text-slate-400">Status Saat Ini:</span>
                  <StatusBadge status={ppdb.status} />
                </div>
                
                <div className="flex items-center justify-between text-xs pb-3 border-b border-gray-100">
                  <span className="text-slate-400 font-semibold">Terdaftar Sejak:</span>
                  <span className="text-slate-700 font-bold">
                    {new Date(ppdb.created_at).toLocaleDateString('id-ID', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                {/* Status Advice Notice */}
                {ppdb.status.toLowerCase() === 'diterima' && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-700 leading-normal">
                    <i className="fas fa-check-circle mr-1 text-emerald-600" />
                    Pendaftar telah diterima. Silakan hubungi calon siswa untuk proses daftar ulang.
                  </div>
                )}
                
                {ppdb.status.toLowerCase() === 'ditolak' && (
                  <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-xs text-red-700 leading-normal">
                    <i className="fas fa-times-circle mr-1 text-red-600" />
                    Pendaftar ditolak. Anda dapat menambahkan catatan alasan penolakan di bawah.
                  </div>
                )}
                
                {ppdb.status.toLowerCase() === 'cadangan' && (
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-700 leading-normal">
                    <i className="fas fa-info-circle mr-1 text-purple-600" />
                    Pendaftar masuk daftar cadangan, dan akan diprioritaskan jika kuota kosong.
                  </div>
                )}
              </div>
            )}
          </ArgonCard>
          
          {/* Catatan Card */}
          <ArgonCard 
            title="Catatan"
            headerRight={
              <button
                type="button"
                onClick={() => setIsEditingNotes(!isEditingNotes)}
                className="text-orange-500 hover:text-orange-600 text-xs font-bold uppercase transition-colors"
              >
                {isEditingNotes ? 'Batal' : 'Ubah'}
              </button>
            }
          >
            {isEditingNotes ? (
              <form onSubmit={submitStatus} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Isi Catatan untuk Pendaftar
                  </label>
                  <textarea
                    name="notes"
                    value={data.notes}
                    onChange={handleNotesChange}
                    rows={4}
                    className="focus:shadow-primary-outline text-xs leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-slate-700 outline-none transition-all focus:border-orange-500 focus:outline-none"
                    placeholder="Tambahkan catatan untuk pendaftar..."
                  ></textarea>
                  <p className="mt-1.5 text-[10px] text-slate-400 leading-normal">
                    Catatan ini akan terlihat oleh pendaftar pada halaman status pendaftaran.
                  </p>
                  {errors.notes && (
                    <p className="mt-1 text-xs text-red-500 font-semibold">{errors.notes}</p>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-gradient-to-tl from-orange-500 to-yellow-500 text-white font-bold uppercase rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-px text-[10px] disabled:opacity-50"
                  >
                    <i className="fas fa-save mr-1.5" /> Simpan Catatan
                  </button>
                </div>
              </form>
            ) : (
              <div>
                {ppdb.catatan ? (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-2 text-xs">
                    <i className="far fa-comment-dots text-slate-400 mt-0.5 text-sm shrink-0" />
                    <p className="text-slate-600 leading-normal whitespace-pre-line">{ppdb.catatan}</p>
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400 bg-slate-50 border border-slate-100 rounded-xl">
                    <i className="far fa-comments text-2xl mb-1.5 text-slate-300" />
                    <p className="text-xs">Belum ada catatan pendaftaran</p>
                  </div>
                )}
              </div>
            )}
          </ArgonCard>
          
          {/* Dokumen Card */}
          <ArgonCard title="Dokumen Lampiran">
            {documents.length === 0 ? (
              <div className="text-center py-8 text-slate-400 bg-slate-50 border border-slate-100 rounded-xl">
                <i className="far fa-folder-open text-2xl mb-1.5 text-slate-300" />
                <p className="text-xs">Belum ada dokumen yang diunggah</p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <i className="far fa-file-pdf text-red-500 text-lg shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-700 truncate">{doc.name}</p>
                        <p className="text-[10px] text-slate-400">{doc.size}</p>
                      </div>
                    </div>
                    <a 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-bold uppercase rounded-lg shadow-sm border border-gray-200 transition-colors shrink-0"
                    >
                      Lihat
                    </a>
                  </div>
                ))}
              </div>
            )}
          </ArgonCard>
          
        </div>
      </div>
    </AdminLayout>
  );
}

// Component untuk menampilkan status pendaftaran
const StatusBadge = ({ status }: { status: string }) => {
  const normalizedStatus = status ? status.toLowerCase() : 'menunggu';
  
  if (normalizedStatus === 'diterima') {
    return <ArgonBadge variant="success" gradient>Diterima</ArgonBadge>;
  }
  if (normalizedStatus === 'ditolak') {
    return <ArgonBadge variant="danger" gradient>Ditolak</ArgonBadge>;
  }
  if (normalizedStatus === 'verifikasi') {
    return <ArgonBadge variant="info" gradient>Verifikasi</ArgonBadge>;
  }
  if (normalizedStatus === 'cadangan') {
    return <ArgonBadge variant="purple" gradient>Cadangan</ArgonBadge>;
  }
  
  return <ArgonBadge variant="warning" gradient>Menunggu</ArgonBadge>;
};

// Component untuk menampilkan data item
interface DataItemProps {
  label: string;
  value?: string | null;
  icon?: string;
  span?: string;
}

const DataItem = ({ label, value, icon, span = '' }: DataItemProps) => {
  return (
    <div className={span}>
      <span className="block text-xs font-bold uppercase text-slate-400 mb-1">{label}</span>
      <div className="flex items-center text-sm font-semibold text-slate-700">
        {icon && <i className={`${icon} mr-2.5 text-slate-400`} />}
        <span>{value || '-'}</span>
      </div>
    </div>
  );
}; 