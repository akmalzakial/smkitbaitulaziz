import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImagePlaceholder from '../components/ImagePlaceholder';
import { Images, Camera, ChevronLeft, ChevronRight, X, Calendar } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface NewsRef {
  id: number;
  title: string;
  slug: string;
}

interface GalleryItem {
  id: number;
  title: string;
  description: string | null;
  image: string;
  category: string | null;
  is_featured: boolean;
  news_id?: number | null;
  news?: NewsRef | null;
  created_at: string;
  updated_at: string;
  user: User;
}

interface GalleryAlbum {
  id: string;
  title: string;
  category: string | null;
  coverImage: string;
  photoCount: number;
  items: GalleryItem[];
  created_at: string;
}

interface GalleryProps {
  galleries?: GalleryItem[];
  categories?: string[];
}

const ITEMS_PER_PAGE = 12;

const Gallery: React.FC<GalleryProps> = ({ galleries = [], categories = [] }) => {
  const gridSectionRef = useRef<HTMLDivElement>(null);
  
  const [activeCategory, setActiveCategory] = useState<string>('semua');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Album Lightbox State
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  // Default fallback data if DB is empty
  const rawItems: GalleryItem[] = galleries.length > 0 ? galleries : [
    {
      id: 1,
      title: 'Praktikum Lab Komputer - Foto 1',
      description: 'Siswa PPLG belajar praktik pengembangan aplikasi web di lab komputer',
      image: '/images/gallery/programming-lab.jpg',
      category: 'kegiatan-belajar',
      is_featured: true,
      created_at: '2023-03-15',
      updated_at: '2023-03-15',
      user: { id: 1, name: 'Admin', email: 'admin@smkitbaitulaziz.sch.id' }
    },
    {
      id: 2,
      title: 'Praktikum Lab Komputer - Foto 2',
      description: 'Siswa PPLG belajar praktik pengembangan aplikasi web di lab komputer',
      image: '/images/gallery/programming-lab.jpg',
      category: 'kegiatan-belajar',
      is_featured: true,
      created_at: '2023-03-15',
      updated_at: '2023-03-15',
      user: { id: 1, name: 'Admin', email: 'admin@smkitbaitulaziz.sch.id' }
    }
  ];

  // Helper function untuk kapitalisasi string
  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
  };

  // Helper format tanggal ke format Indonesia
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Group galleries by news title / base title into Albums
  const albums = useMemo(() => {
    const map = new Map<string, GalleryAlbum>();

    rawItems.forEach((item) => {
      let key = '';
      let albumTitle = item.title;

      if (item.news && item.news.id) {
        key = `news_${item.news.id}`;
        albumTitle = item.news.title;
      } else if (item.news_id) {
        key = `news_${item.news_id}`;
        albumTitle = item.title.replace(/\s*-\s*Foto\s*\d+/i, '').trim();
      } else {
        const cleanTitle = item.title.replace(/\s*-\s*Foto\s*\d+/i, '').trim();
        key = `title_${cleanTitle.toLowerCase()}`;
        albumTitle = cleanTitle;
      }

      if (map.has(key)) {
        const album = map.get(key)!;
        album.items.push(item);
        album.photoCount = album.items.length;
      } else {
        map.set(key, {
          id: key,
          title: albumTitle,
          category: item.category,
          coverImage: item.image,
          photoCount: 1,
          items: [item],
          created_at: item.created_at,
        });
      }
    });

    return Array.from(map.values());
  }, [rawItems]);

  // Category Options
  const categoryOptions = useMemo(() => {
    const list = [{ id: 'semua', name: 'Semua' }];
    if (categories.length > 0) {
      categories.forEach(cat => {
        list.push({ id: cat, name: capitalize(cat) });
      });
    } else {
      const uniqueCats = Array.from(new Set(albums.map(a => a.category).filter(Boolean))) as string[];
      uniqueCats.forEach(cat => {
        list.push({ id: cat, name: capitalize(cat) });
      });
    }
    return list;
  }, [categories, albums]);

  // Filter albums based on active category
  const filteredAlbums = useMemo(() => {
    if (activeCategory === 'semua') return albums;
    return albums.filter(album => album.category === activeCategory);
  }, [albums, activeCategory]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredAlbums.length / ITEMS_PER_PAGE) || 1;
  const paginatedAlbums = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAlbums.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAlbums, currentPage]);

  // Reset page when category changes
  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setCurrentPage(1);
  };

  // Change page
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      if (gridSectionRef.current) {
        gridSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Open album modal
  const openAlbumModal = (album: GalleryAlbum, initialIndex: number = 0) => {
    setSelectedAlbum(album);
    setActivePhotoIndex(initialIndex);
  };

  // Close album modal
  const closeAlbumModal = () => {
    setSelectedAlbum(null);
    setActivePhotoIndex(0);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedAlbum) return;
      if (e.key === 'ArrowLeft') {
        setActivePhotoIndex(prev => (prev > 0 ? prev - 1 : selectedAlbum.items.length - 1));
      } else if (e.key === 'ArrowRight') {
        setActivePhotoIndex(prev => (prev < selectedAlbum.items.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        closeAlbumModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAlbum]);

  const currentPhoto = selectedAlbum ? selectedAlbum.items[activePhotoIndex] : null;

  return (
    <>
      <Head title="Galeri - SMK IT Baitul Aziz" />
      
      <div className="min-h-screen bg-white text-gray-800">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative pt-28 sm:pt-32 pb-10 sm:pb-16 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
          <div className="absolute inset-0 bg-[url('/images/circuit-pattern.svg')] opacity-10 bg-repeat"></div>
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-orange-500/15 blur-[100px] rounded-full"></div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-600 text-xs sm:text-sm font-semibold border border-orange-500/20">
                Dokumentasi & Momen Berharga
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
                Galeri <span className="text-orange-500">Kegiatan</span> Sekolah
              </h1>
              
              <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-8 max-w-3xl mx-auto">
                Kumpulan dokumentasi album kegiatan, prestasi, dan aktivitas pembelajaran di SMK IT Baitul Aziz
              </p>
              
              <div className="relative w-full max-w-4xl mx-auto">
                {/* Kategori Filter */}
                <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 py-2">
                  {categoryOptions.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                        activeCategory === category.id
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                          : 'bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Gallery Grid Section */}
        <section ref={gridSectionRef} className="py-8 sm:py-12 relative scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {paginatedAlbums.length > 0 ? (
                paginatedAlbums.map((album) => (
                  <motion.div
                    key={album.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="group"
                  >
                    <div 
                      className="relative overflow-hidden rounded-2xl cursor-pointer bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                      onClick={() => openAlbumModal(album, 0)}
                    >
                      {/* Album Cover Container */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                        {album.coverImage ? (
                          <img 
                            src={album.coverImage} 
                            alt={album.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                          text={album.title}
                          className={album.coverImage ? 'hidden' : ''} 
                        />

                        {/* Photo Count Badge */}
                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                          <Camera className="w-3.5 h-3.5 text-orange-400" />
                          <span>{album.photoCount} Foto</span>
                        </div>

                        {/* Category Badge */}
                        {album.category && (
                          <div className="absolute top-3 left-3 bg-orange-500/90 text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-md">
                            {capitalize(album.category)}
                          </div>
                        )}

                        {/* Hover Overlay Button */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="bg-white/90 text-gray-900 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
                            <Images className="w-4 h-4 text-orange-500" />
                            <span>Lihat Album ({album.photoCount})</span>
                          </span>
                        </div>
                      </div>

                      {/* Card Info */}
                      <div className="p-4 flex flex-col flex-grow justify-between bg-white">
                        <div>
                          <h3 className="text-gray-800 text-sm sm:text-base font-semibold line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors mb-2">
                            {album.title}
                          </h3>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-orange-500" />
                            {formatDate(album.created_at)}
                          </span>
                          <span className="text-orange-600 font-medium hover:underline">
                            Buka &rarr;
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <Images className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-60" />
                  <p className="text-gray-600 text-base font-medium">Tidak ada album galeri untuk kategori ini</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                <div className="text-xs sm:text-sm text-gray-600">
                  Menampilkan <span className="font-semibold text-gray-900">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> - <span className="font-semibold text-gray-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredAlbums.length)}</span> dari <span className="font-semibold text-gray-900">{filteredAlbums.length}</span> album
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-gray-300 text-xs sm:text-sm font-medium text-gray-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Sebelumnya</span>
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                        currentPage === page
                          ? 'bg-orange-500 text-white font-bold shadow-sm'
                          : 'border border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-gray-300 text-xs sm:text-sm font-medium text-gray-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="hidden sm:inline">Selanjutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* Album Lightbox Modal */}
        {selectedAlbum && currentPhoto && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-sm" 
            onClick={closeAlbumModal}
          >
            <div 
              className="max-w-5xl w-full max-h-[92vh] rounded-2xl overflow-hidden bg-gray-900 text-white flex flex-col shadow-2xl border border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 px-6 border-b border-gray-800 flex items-center justify-between bg-gray-950/80">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white line-clamp-1">
                    {selectedAlbum.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Foto {activePhotoIndex + 1} dari {selectedAlbum.items.length}
                  </p>
                </div>

                <button 
                  className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full text-white transition-colors cursor-pointer"
                  onClick={closeAlbumModal}
                  title="Tutup Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Photo Stage */}
              <div className="relative flex-grow bg-black flex items-center justify-center min-h-[300px] sm:min-h-[450px] overflow-hidden">
                {currentPhoto.image ? (
                  <img 
                    src={currentPhoto.image} 
                    alt={currentPhoto.title || selectedAlbum.title} 
                    className="max-w-full max-h-[60vh] object-contain transition-all duration-300"
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
                  text={currentPhoto.title || selectedAlbum.title}
                  className={currentPhoto.image ? 'hidden' : ''} 
                />

                {/* Left Arrow Button */}
                {selectedAlbum.items.length > 1 && (
                  <button
                    onClick={() => setActivePhotoIndex(prev => (prev > 0 ? prev - 1 : selectedAlbum.items.length - 1))}
                    className="absolute left-3 bg-black/60 hover:bg-orange-500 text-white p-2.5 sm:p-3 rounded-full transition-colors backdrop-blur-md cursor-pointer"
                    title="Foto Sebelumnya"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}

                {/* Right Arrow Button */}
                {selectedAlbum.items.length > 1 && (
                  <button
                    onClick={() => setActivePhotoIndex(prev => (prev < selectedAlbum.items.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 bg-black/60 hover:bg-orange-500 text-white p-2.5 sm:p-3 rounded-full transition-colors backdrop-blur-md cursor-pointer"
                    title="Foto Selanjutnya"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}
              </div>

              {/* Thumbnail Strip (if multiple photos) */}
              {selectedAlbum.items.length > 1 && (
                <div className="p-3 bg-gray-950/90 border-t border-gray-800 overflow-x-auto">
                  <div className="flex justify-center items-center gap-2 max-w-full">
                    {selectedAlbum.items.map((item, index) => (
                      <div
                        key={item.id || index}
                        onClick={() => setActivePhotoIndex(index)}
                        className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 ${
                          activePhotoIndex === index
                            ? 'border-orange-500 scale-105 opacity-100 ring-2 ring-orange-500/50'
                            : 'border-transparent opacity-50 hover:opacity-100'
                        }`}
                      >
                        <img 
                          src={item.image} 
                          alt={item.title || `Foto ${index + 1}`}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Photo Meta Footer */}
              <div className="p-4 sm:p-5 bg-gray-900 border-t border-gray-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-400">
                  <div className="flex items-center gap-4">
                    {currentPhoto.category && (
                      <span className="bg-orange-500/20 text-orange-400 px-2.5 py-0.5 rounded-full font-medium">
                        {capitalize(currentPhoto.category)}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-orange-500" />
                      {formatDate(currentPhoto.created_at)}
                    </span>
                  </div>
                  {currentPhoto.user?.name && (
                    <span>Pengunggah: {currentPhoto.user.name}</span>
                  )}
                </div>
                {currentPhoto.description && (
                  <p className="text-gray-300 text-xs sm:text-sm mt-2">{currentPhoto.description}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        <Footer />
      </div>
    </>
  );
};

export default Gallery;