import React, { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Editor } from '@tinymce/tinymce-react';
import ArgonCard from '@/components/admin/ArgonCard';
import ArgonFormInput from '@/components/admin/ArgonFormInput';

interface GalleryItem {
  id: number;
  image: string;
  title?: string;
}

interface News {
  id: number;
  title: string;
  summary: string | null;
  content: string;
  image: string;
  category: string | null;
  author: string | null;
  slug: string;
  is_featured: boolean;
  galleries?: GalleryItem[];
}

interface Props {
  news: News;
}

const Edit: React.FC<Props> = ({ news }) => {
  const [title, setTitle] = useState(news.title);
  const [summary, setSummary] = useState(news.summary || '');
  const [content, setContent] = useState(news.content);
  const [category, setCategory] = useState(news.category || '');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [author, setAuthor] = useState(news.author || '');
  const [slug, setSlug] = useState(news.slug);
  const [isFeatured, setIsFeatured] = useState(news.is_featured);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(news.image);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<any>(null);

  // Gallery state
  const [existingGalleries, setExistingGalleries] = useState<GalleryItem[]>(news.galleries || []);
  const [removedGalleryIds, setRemovedGalleryIds] = useState<number[]>([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleRemoveExistingGallery = (id: number) => {
    setExistingGalleries(prev => prev.filter(g => g.id !== id));
    setRemovedGalleryIds(prev => [...prev, id]);
  };

  const handleNewGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const updatedFiles = [...newGalleryFiles, ...filesArray];
      setNewGalleryFiles(updatedFiles);

      const newPreviews = [...newGalleryPreviews];
      let readCount = 0;
      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          readCount++;
          if (readCount === filesArray.length) {
            setNewGalleryPreviews([...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveNewGalleryImage = (index: number) => {
    setNewGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setNewGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Daftar kategori yang tersedia
  const defaultCategories = ['Akademik', 'Kegiatan Sekolah', 'Prestasi', 'Pengumuman', 'Artikel', 'Lainnya'];
  const availableCategories = category && !defaultCategories.includes(category)
    ? [...defaultCategories, category]
    : (news.category && !defaultCategories.includes(news.category)
      ? [...defaultCategories, news.category]
      : defaultCategories);

  // Menangani perubahan file gambar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImageChanged(true);

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

  // Menghapus gambar yang sudah dipilih dan kembali ke gambar asli
  const removeImage = () => {
    if (imageChanged) {
      setImage(null);
      setImagePreview(news.image);
      setImageChanged(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      setImagePreview(null);
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

    if (image) {
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (image.size > maxSize) {
        newErrors.image = 'Ukuran gambar maksimal 2MB';
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(image.type)) {
        newErrors.image = 'Format gambar harus JPG, PNG, atau WebP';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    formData.append('_method', 'PUT'); // For Laravel method spoofing
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('author', author);
    formData.append('slug', slug);
    formData.append('is_featured', isFeatured ? '1' : '0');
    if (image) {
      formData.append('image', image);
    }

    removedGalleryIds.forEach(id => {
      formData.append('removed_gallery_ids[]', id.toString());
    });

    newGalleryFiles.forEach(file => {
      formData.append('gallery_images[]', file);
    });

    router.post(`/admin/news/${news.slug}`, formData, {
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
      <Head title="Edit Berita - SMK IT Baitul Aziz" />

      {/* Header and Back Link */}
      <div className="mb-6">
        <Link
          href="/admin/news"
          className="text-white hover:text-white/80 inline-flex items-center text-sm transition-colors"
        >
          <i className="fas fa-arrow-left mr-1.5" /> Kembali ke Daftar Berita
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2">Edit Berita</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <ArgonCard title="Edit Artikel Berita">
              {/* Judul */}
              <ArgonFormInput
                label="Judul Berita *"
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                placeholder="slug-berita"
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
                  placeholder="Masukkan ringkasan berita..."
                />
              </div>

              {/* Editor Konten */}
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                  Konten Berita *
                </label>
                <div className="rounded-xl overflow-hidden border border-gray-300 shadow-sm">
                  <Editor
                    apiKey="us5k11n22fvccimhy645zjsiqgkl4l5du8597i653h7qqni0"
                    onInit={(evt, editor) => {
                      editorRef.current = editor;
                    }}
                    initialValue={content}
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
                    Klik untuk unggah baru
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
                        <i className="fas fa-times text-xs" />
                        {imageChanged ? 'Batal' : 'Ganti Foto'}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 text-center">
                    {imageChanged
                      ? 'Klik tombol Batal untuk kembali ke gambar asli'
                      : 'Klik tombol Ganti Foto untuk mengubah gambar'}
                  </p>
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
                Foto tambahan yang otomatis terhubung dengan Galeri Sekolah.
              </p>

              <input
                type="file"
                ref={galleryInputRef}
                className="hidden"
                onChange={handleNewGalleryImagesChange}
                accept="image/jpeg,image/png,image/jpg,image/webp"
                multiple
              />

              <div className="grid grid-cols-3 gap-2 mb-3">
                {/* Existing galleries */}
                {existingGalleries.map((item) => (
                  <div key={item.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img src={item.image} alt={item.title || 'Galeri'} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingGallery(item.id)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                      title="Hapus foto ini dari galeri"
                    >
                      <i className="fas fa-trash text-[10px]" />
                    </button>
                  </div>
                ))}

                {/* New uploaded previews */}
                {newGalleryPreviews.map((src, index) => (
                  <div key={`new-${index}`} className="relative group aspect-square rounded-lg overflow-hidden border border-orange-300 ring-2 ring-orange-400/30">
                    <img src={src} alt={`New upload ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewGalleryImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                      title="Batal tambah foto"
                    >
                      <i className="fas fa-times text-[10px]" />
                    </button>
                  </div>
                ))}

                {/* Add button */}
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-gray-300 hover:border-orange-500 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:text-orange-500 transition-colors bg-gray-50 hover:bg-orange-50/20 cursor-pointer"
                >
                  <i className="fas fa-plus text-base mb-1" />
                  <span className="text-[10px] font-bold uppercase">Tambah</span>
                </button>
              </div>

              {(existingGalleries.length > 0 || newGalleryFiles.length > 0) && (
                <p className="text-xs text-slate-500 font-medium">
                  {existingGalleries.length} foto tersimpan, {newGalleryFiles.length} foto baru
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
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default Edit;