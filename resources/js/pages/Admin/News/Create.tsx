import React, { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Editor } from '@tinymce/tinymce-react';
import ArgonCard from '@/components/admin/ArgonCard';
import ArgonFormInput from '@/components/admin/ArgonFormInput';

const Create: React.FC = () => {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [author, setAuthor] = useState('');
    const [createdAt, setCreatedAt] = useState(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    });
    const [isFeatured, setIsFeatured] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [slug, setSlug] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const editorRef = useRef<any>(null);

    // Helper untuk membuat slug otomatis
    const generateSlug = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')     // Ganti spasi dengan -
            .replace(/[^\w\-]+/g, '') // Hapus karakter non-word
            .replace(/\-\-+/g, '-')   // Ganti multiple - dengan single -
            .replace(/^-+/, '')       // Hapus - di awal
            .replace(/-+$/, '');      // Hapus - di akhir
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTitle(value);
        setSlug(generateSlug(value));
    };

    // Daftar kategori yang tersedia
    const availableCategories = ['Akademik', 'Kegiatan Sekolah', 'Prestasi', 'Pengumuman', 'Artikel', 'Lainnya'];

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

        if (!content.trim()) {
            newErrors.content = 'Konten berita wajib diisi';
        }

        if (!image) {
            newErrors.image = 'Gambar berita wajib diunggah';
        } else {
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (image.size > maxSize) {
                newErrors.image = 'Ukuran gambar maksimal 2MB';
            }

            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
            if (!allowedTypes.includes(image.type)) {
                newErrors.image = 'Format gambar harus JPG, PNG, atau WebP';
            }
        }

        if (!slug.trim()) {
            newErrors.slug = 'Slug wajib diisi';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    // Menangani penambahan foto galeri
    const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            const updatedFiles = [...galleryImages, ...filesArray];
            setGalleryImages(updatedFiles);

            const newPreviews = [...galleryPreviews];
            let readCount = 0;
            filesArray.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result as string);
                    readCount++;
                    if (readCount === filesArray.length) {
                        setGalleryPreviews([...newPreviews]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    // Menghapus foto dari galeri sementara
    const removeGalleryImage = (index: number) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // Menangani submit form
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Pastikan content dari editor disimpan
        if (editorRef.current) {
            setContent(editorRef.current.getContent());
        }

        if (!validateForm() || isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('summary', summary);
        formData.append('content', content);
        formData.append('category', category);
        formData.append('author', author);
        if (createdAt) {
            formData.append('created_at', createdAt);
        }
        formData.append('is_featured', isFeatured ? '1' : '0');
        if (image) {
            formData.append('image', image);
        }
        formData.append('slug', slug);

        galleryImages.forEach((file) => {
            formData.append('gallery_images[]', file);
        });

        router.post('/admin/news', formData, {
            onSuccess: () => {
                router.visit('/admin/news');
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
            <Head title="Tambah Berita - SMK IT Baitul Aziz" />

            {/* Header and Back Link */}
            <div className="mb-6">
                <Link
                    href="/admin/news"
                    className="text-white hover:text-white/80 inline-flex items-center text-sm transition-colors"
                >
                    <i className="fas fa-arrow-left mr-1.5" /> Kembali ke Daftar Berita
                </Link>
                <h1 className="text-2xl font-bold text-white mt-2">Tambah Berita Baru</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <ArgonCard title="Tulis Artikel Berita">
                            {/* Judul */}
                            <ArgonFormInput
                                label="Judul Berita *"
                                type="text"
                                id="title"
                                value={title}
                                onChange={handleTitleChange}
                                error={errors.title}
                                placeholder="Masukkan judul berita"
                                icon="fas fa-heading"
                                required
                            />

                            {/* Slug */}
                            <ArgonFormInput
                                label="Slug *"
                                type="text"
                                id="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                error={errors.slug}
                                placeholder="slug-berita-otomatis"
                                icon="fas fa-link"
                                required
                            />

                            {/* Ringkasan */}
                            <div className="mb-4">
                                <label htmlFor="summary" className="block text-xs font-bold uppercase text-slate-400 mb-2">
                                    Ringkasan <span className="text-slate-300 font-normal">(opsional)</span>
                                </label>
                                <textarea
                                    id="summary"
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    rows={3}
                                    className="text-sm w-full rounded-lg border border-solid border-gray-300 bg-white py-2 px-3 text-slate-700 focus:border-orange-500 focus:outline-none focus:shadow-primary-outline transition-all"
                                    placeholder="Ringkasan singkat untuk ditampilkan di kartu berita..."
                                />
                            </div>

                            {/* Editor Konten */}
                            <div className="mb-4">
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                                    Konten Berita *
                                </label>
                                <div className="rounded-xl overflow-hidden border border-gray-300 shadow-sm">
                                    <Editor
                                        apiKey='us5k11n22fvccimhy645zjsiqgkl4l5du8597i653h7qqni0'
                                        onInit={(evt, editor) => editorRef.current = editor}
                                        initialValue=""
                                        init={{
                                            height: 450,
                                            menubar: true,
                                            plugins: [
                                                'advlist autolink lists link image charmap print preview anchor',
                                                'searchreplace visualblocks code fullscreen',
                                                'insertdatetime media table paste code help wordcount'
                                            ],
                                            toolbar: 'undo redo | formatselect | ' +
                                                'bold italic backcolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'removeformat | help',
                                            content_style: 'body { font-family:Open Sans,system-ui,sans-serif; font-size:14px }'
                                        }}
                                        onEditorChange={setContent}
                                    />
                                </div>
                                {errors.content && (
                                    <p className="mt-2 text-xs text-red-500 font-semibold flex items-center">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                                        {errors.content}
                                    </p>
                                )}
                            </div>
                        </ArgonCard>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Gambar Berita */}
                        <ArgonCard title="Gambar Utama">
                            {!imagePreview ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex justify-center items-center flex-col cursor-pointer hover:border-orange-500 hover:bg-orange-500/5 transition-all duration-300 group bg-white"
                                >
                                    <div className="p-3 rounded-full bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors mb-3">
                                        <i className="fas fa-upload text-orange-500 text-lg" />
                                    </div>
                                    <p className="text-sm font-semibold text-slate-700 group-hover:text-orange-500 transition-colors text-center">
                                        Klik untuk unggah
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1 text-center">
                                        Max 2MB (JPG/PNG/WebP)
                                    </p>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleImageChange}
                                        accept="image/jpeg,image/png,image/jpg,image/webp"
                                    />
                                </div>
                            ) : (
                                <div className="relative group">
                                    <div className="relative rounded-xl overflow-hidden shadow-md ring-2 ring-orange-500/20">
                                        <img
                                            src={imagePreview}
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

                        {/* Galeri Foto Berita */}
                        <ArgonCard title="Foto Galeri Berita">
                            <p className="text-xs text-slate-400 mb-3">
                                Foto tambahan yang akan otomatis masuk ke Galeri Sekolah.
                            </p>
                            <input
                                type="file"
                                ref={galleryInputRef}
                                className="hidden"
                                onChange={handleGalleryImagesChange}
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                multiple
                            />
                            
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                {galleryPreviews.map((src, index) => (
                                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                                        <img src={src} alt={`Galeri preview ${index + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(index)}
                                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs opacity-90 hover:opacity-100 transition-opacity"
                                        >
                                            <i className="fas fa-times" />
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => galleryInputRef.current?.click()}
                                    className="aspect-square border-2 border-dashed border-gray-300 hover:border-orange-500 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:text-orange-500 transition-colors bg-gray-50 hover:bg-orange-50/20"
                                >
                                    <i className="fas fa-plus text-base mb-1" />
                                    <span className="text-[10px] font-bold uppercase">Tambah</span>
                                </button>
                            </div>

                            {galleryImages.length > 0 && (
                                <p className="text-xs text-slate-500 font-medium">
                                    {galleryImages.length} foto galeri terpilih
                                </p>
                            )}
                        </ArgonCard>

                        {/* Publishing Options */}
                        <ArgonCard title="Opsi Publikasi">
                            {/* Kategori */}
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="category" className="block text-xs font-bold uppercase text-slate-400">
                                        Kategori
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

                            {/* Penulis */}
                            <ArgonFormInput
                                label="Penulis (Opsional)"
                                type="text"
                                id="author"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                placeholder="Nama penulis"
                                icon="fas fa-user"
                            />

                            {/* Tanggal Posting */}
                            <ArgonFormInput
                                label="Tanggal Posting"
                                type="date"
                                id="created_at"
                                value={createdAt}
                                onChange={(e) => setCreatedAt(e.target.value)}
                                icon="fas fa-calendar-alt"
                                required
                            />

                            {/* Unggulan */}
                            <div className="flex items-start pt-2">
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
                                    <label htmlFor="is_featured" className="font-bold text-slate-700 cursor-pointer select-none">
                                        Berita Unggulan
                                    </label>
                                    <p className="text-slate-400 mt-0.5">
                                        Tampilkan di slide utama website
                                    </p>
                                </div>
                            </div>
                        </ArgonCard>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100 mt-6">
                    <Link
                        href="/admin/news"
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
                                Simpan Berita
                            </>
                        )}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
};

export default Create;