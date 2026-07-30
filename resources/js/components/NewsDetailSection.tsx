import React, { useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import { Calendar, User, Tag, Share2, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import ImagePlaceholder from './ImagePlaceholder';

interface User {
  id: number;
  name: string;
  email: string;
}

interface GalleryItem {
  id: number;
  image: string;
  title?: string;
}

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  image: string | null;
  category: string | null;
  author_id: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  author: User;
  galleries?: GalleryItem[];
}

interface NewsDetailSectionProps {
  news: NewsItem;
  relatedNews?: NewsItem[];
}

const NewsDetailSection: React.FC<NewsDetailSectionProps> = ({ news, relatedNews = [] }) => {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  // Format tanggal ke format Indonesia
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Helper function untuk kapitalisasi string
  function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
  }

  // Fungsi untuk berbagi berita
  const shareNews = (platform: string) => {
    const url = window.location.href;
    const title = news.title;
    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + '\n\n' + url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <section className="py-6 sm:py-10 md:py-12 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {/* Article Content */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white shadow-md rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200"
            >
              {/* Featured Image */}
              {news.image && (
                <div className="relative aspect-[16/9] w-full">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => setSelectedImage(news.image)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const nextElement = target.nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.style.display = 'flex';
                      }
                    }}
                  />
                  <ImagePlaceholder 
                    width="100%" 
                    height="100%" 
                    text={news.title}
                    className={news.image ? 'hidden' : ''} 
                  />
                </div>
              )}
              
              {/* Content */}
              <div className="p-4 sm:p-6 md:p-8">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 leading-snug">{news.title}</h1>
                
                {/* Meta Information */}
                <div className="flex flex-wrap gap-2.5 sm:gap-4 mb-4 sm:mb-6 text-xs sm:text-sm text-gray-600">
                  {news.category && (
                    <div className="flex items-center">
                      <Tag className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                      <span>Kategori: <span className="text-orange-600 font-medium">{news.category}</span></span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                    <span>Dipublikasikan: {formatDate(news.created_at)}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                    <span>Oleh: <span className="text-orange-600 font-medium">{news.author.name}</span></span>
                  </div>
                </div>

                {/* Summary */}
                {news.summary && (
                  <div className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 font-medium italic border-l-4 border-orange-500 pl-3 sm:pl-4 py-1 bg-orange-50/50 rounded-r-lg">
                    {news.summary}
                  </div>
                )}

                {/* Main Content */}
                <div 
                  className="prose max-w-none mb-6 sm:mb-8 text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: news.content }}
                />

                {/* Galeri Foto Berita (Jika ada) */}
                {news.galleries && news.galleries.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span>Galeri Foto</span>
                      <span className="text-sm font-normal text-gray-500">({news.galleries.length} foto)</span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {news.galleries.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedImage(item.image)}
                          className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-gray-200 bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <img
                            src={item.image}
                            alt={item.title || news.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                              Lihat Foto
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Buttons */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <Share2 className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-600">Bagikan:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => shareNews('whatsapp')}
                        className="p-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                        title="Bagikan di WhatsApp"
                      >
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => shareNews('facebook')}
                        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        title="Bagikan di Facebook"
                      >
                        <Facebook className="h-4 w-4" />
                      </button>
                      {/* <button
                        onClick={() => shareNews('twitter')}
                        className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors"
                        title="Bagikan di Twitter"
                      >
                        <Twitter className="h-4 w-4" />
                      </button> */}
                      {/* <button
                        onClick={() => shareNews('linkedin')}
                        className="p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors"
                        title="Bagikan di LinkedIn"
                      >
                        <Linkedin className="h-4 w-4" />
                      </button> */}
                      <button
                        onClick={() => shareNews('email')}
                        className="p-2 rounded-full bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                        title="Bagikan melalui Email"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 sm:space-y-8">
            {/* Author Info */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white shadow-md rounded-xl p-4 sm:p-6 border border-gray-200"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg sm:text-xl font-bold text-orange-600">
                    {news.author.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">{news.author.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{news.author.email}</p>
                </div>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Penulis artikel ini adalah anggota tim SMK IT Baitul Aziz yang berdedikasi untuk memberikan informasi terbaru dan terpercaya kepada masyarakat.
              </p>
            </motion.div>

            {/* Related News */}
            {relatedNews.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white shadow-md rounded-xl p-4 sm:p-6 border border-gray-200"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Berita Terkait</h3>
                <div className="space-y-3 sm:space-y-4">
                  {relatedNews.map((item) => (
                    <Link
                      key={item.id}
                      href={`/berita/${item.slug || item.id}`}
                      className="block group"
                    >
                      <div className="flex gap-3 sm:gap-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const nextElement = target.nextElementSibling as HTMLElement;
                                if (nextElement) {
                                  nextElement.style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <ImagePlaceholder 
                            width="100%" 
                            height="100%" 
                            text={item.title}
                            className={item.image ? 'hidden' : ''} 
                          />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                            {item.title}
                          </h4>
                          <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
                            {formatDate(item.created_at)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Categories */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white shadow-md rounded-xl p-4 sm:p-6 border border-gray-200"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Kategori</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {['Berita Sekolah', 'Prestasi', 'Kegiatan', 'Pengumuman', 'Artikel'].map((category) => (
                  <Link
                    key={category}
                    href={`/berita?category=${category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gray-100 text-gray-800 hover:bg-orange-500 hover:text-white transition-colors text-xs sm:text-sm font-medium"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
            <img
              src={selectedImage}
              alt="Detail Foto"
              className="w-full h-full object-contain max-h-[85vh] rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 bg-black/60 hover:bg-black text-white p-2 rounded-full text-sm transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsDetailSection; 