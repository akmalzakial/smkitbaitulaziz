import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewsDetailSection from '@/components/NewsDetailSection';

// Interface untuk User
interface User {
  id: number;
  name: string;
  email: string;
}

// Interface untuk NewsItem
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
}

// Props untuk halaman NewsDetail
interface NewsDetailProps {
  news: NewsItem;
  relatedNews: NewsItem[];
}

const NewsDetail: React.FC<NewsDetailProps> = ({ news, relatedNews = [] }) => {
  const newsTitle = `${news.title} - SMK IT Baitul Aziz`;
  
  const rawDesc = news.summary || news.content?.replace(/<[^>]+>/g, '') || '';
  const newsDesc = rawDesc.trim().replace(/\s+/g, ' ').substring(0, 160);
  
  const newsImage = news.image
    ? (news.image.startsWith('http://') || news.image.startsWith('https://'))
      ? news.image
      : `${typeof window !== 'undefined' ? window.location.origin : ''}${news.image.startsWith('/') ? '' : '/'}${news.image}`
    : `${typeof window !== 'undefined' ? window.location.origin : ''}/assets/images/logo.png`;

  const newsUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      <Head title={newsTitle}>
        <meta name="description" content={newsDesc} />

        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={newsUrl} />
        <meta property="og:title" content={newsTitle} />
        <meta property="og:description" content={newsDesc} />
        <meta property="og:image" content={newsImage} />
        <meta property="og:image:secure_url" content={newsImage} />
        <meta property="og:image:alt" content={news.title} />
        <meta property="og:site_name" content="SMK IT Baitul Aziz" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={newsUrl} />
        <meta name="twitter:title" content={newsTitle} />
        <meta name="twitter:description" content={newsDesc} />
        <meta name="twitter:image" content={newsImage} />
      </Head>
      
      <div className="min-h-screen bg-white text-gray-800">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative pt-28 sm:pt-32 md:pt-36 pb-10 sm:pb-16 md:pb-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gray-50"></div>
          <div className="absolute inset-0 bg-[url('/images/circuit-pattern.svg')] opacity-10 bg-repeat"></div>
          <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-orange-500/10 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-[30%] h-[30%] bg-orange-600/5 blur-[80px] rounded-full"></div>
          
          {/* Content */}
          <div className="container mx-auto px-4 sm:px-6 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
                {news.title}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <span>{new Date(news.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</span>
                {news.category && (
                  <>
                    <span>•</span>
                    <span>{news.category}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* News Detail Section */}
        <NewsDetailSection news={news} relatedNews={relatedNews} />
        
        <Footer />
      </div>
    </>
  );
};

export default NewsDetail; 