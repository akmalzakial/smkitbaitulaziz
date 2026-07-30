import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube, MessageSquare } from 'lucide-react';
import { type SharedData } from '@/types';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { contact_settings } = usePage<SharedData>().props;

  const address = contact_settings?.address || 'Jl. Baitul Aziz, Solokan Jeruk, Kec. Solokanjeruk, Kabupaten Bandung, Jawa Barat 40376';
  const phone = contact_settings?.phone || '(022) 8596 3085';
  const whatsapp = contact_settings?.whatsapp || '62895610055000';
  const email = contact_settings?.email || 'info@smkitbaitulaziz.sch.id';

  return (
    <footer className="bg-gray-100 relative pt-16 pb-8 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/images/circuit-pattern.svg')] opacity-5" />
      
      {/* Gradient overlay */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-white to-transparent" />
      
      {/* Orange glow */}
      <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-orange-500/5 blur-[100px] rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1 - About */}
          <div>
            <div className="mb-6">
              <Link href="/">
                <div className="font-bold text-2xl text-gray-800 tracking-wide flex items-center">
                  <span className="bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text">SMK IT</span>
                  <span className="ml-1 relative">
                    Baitul Aziz
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-orange-600"></span>
                  </span>
                </div>
              </Link>
            </div>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Membentuk Generasi Unggul yang Berakhlak Mulia dan Terampil di Bidang Teknologi Informasi.
            </p>
            <div className="flex space-x-4">
              {contact_settings?.facebook_url && (
                <a href={contact_settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-orange-500 transition-colors" title="Facebook">
                  <Facebook size={20} />
                </a>
              )}
              {contact_settings?.youtube_url && (
                <a href={contact_settings.youtube_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-orange-500 transition-colors" title="YouTube">
                  <Youtube size={20} />
                </a>
              )}
              {contact_settings?.instagram_url && (
                <a href={contact_settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-orange-500 transition-colors" title="Instagram">
                  <Instagram size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-gray-800 font-semibold text-lg mb-6">Link Cepat</h3>
            <ul className="space-y-3 text-sm">
              {[
                { text: 'Beranda', href: '/' },
                { text: 'Profil Sekolah', href: '/profil-sekolah' },
                { text: 'Program Keahlian', href: '/program-keahlian' },
                { text: 'Berita & Informasi', href: '/berita' },
                { text: 'Galeri Kegiatan', href: '/gallery' },
                { text: 'Pendaftaran SPMB', href: '/spmb' },
                { text: 'Hubungi Kami', href: '/kontak' },
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    href={link.href}
                    className="text-gray-600 hover:text-orange-500 hover:translate-x-1 transition-all inline-flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Programs */}
          <div>
            <h3 className="text-gray-800 font-semibold text-lg mb-6">Program Keahlian</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link 
                  href="/program-keahlian"
                  className="text-gray-600 hover:text-orange-500 transition-colors group flex items-start"
                >
                  <div className="w-5 h-0.5 bg-orange-500 mt-2 mr-2 group-hover:w-6 transition-all"></div>
                  <span>Pengembangan Perangkat Lunak dan Gim (PPLG)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="text-gray-800 font-semibold text-lg mb-6">Hubungi Kami</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <MapPin className="text-orange-500 mt-1 mr-3 shrink-0" size={18} />
                <span className="text-gray-600 leading-relaxed">
                  {address}
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="text-orange-500 mr-3 shrink-0" size={18} />
                <span className="text-gray-600">
                  {phone}
                </span>
              </li>
              {whatsapp && (
                <li className="flex items-center">
                  <MessageSquare className="text-emerald-500 mr-3 shrink-0" size={18} />
                  <a 
                    href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-600 hover:underline font-medium"
                  >
                    +{whatsapp}
                  </a>
                </li>
              )}
              <li className="flex items-center">
                <Mail className="text-orange-500 mr-3 shrink-0" size={18} />
                <a href={`mailto:${email}`} className="text-gray-600 hover:text-orange-500 transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">
            <p>
              &copy; {currentYear} SMK IT Baitul Aziz. Hak Cipta Dilindungi.
            </p>
            <div className="flex space-x-6">
              <Link href="/kontak" className="hover:text-gray-800 transition-colors">Kontak</Link>
              <Link href="/profil-sekolah" className="hover:text-gray-800 transition-colors">Profil</Link>
              <Link href="/spmb" className="hover:text-gray-800 transition-colors">SPMB</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;