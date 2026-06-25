import React, { useRef } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, Phone, Mail, Clock, Send, User, MessageSquare } from 'lucide-react';
import { type SharedData } from '@/types';

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
}

interface ContactProps {
  contactSettings: ContactSetting;
}

const Contact: React.FC<ContactProps> = ({ contactSettings }) => {
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const isFormInView = useInView(formRef, { once: true, amount: 0.3 });

  const { props: sharedProps } = usePage<SharedData>();
  const flash = sharedProps.flash;

  // Use settings passed from backend or fallback to shared props / hardcoded default
  const settings = contactSettings || sharedProps.contact_settings || {
    address: 'Jl. Baitul Aziz, Solokan Jeruk, Kec. Solokanjeruk, Kabupaten Bandung, Jawa Barat 40376',
    phone: '(022) 8596 3085',
    whatsapp: '62895610055000',
    email: 'info@smkitbaitulaziz.sch.id',
    work_hours: 'Senin - Jumat: 07:00 - 16:00',
    map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.882103565451!2d107.7447783!3d-7.023157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68c1583ca914bb%3A0xc0d8f766cc6dfa42!2sSMK%20IT%20BAITUL%20AZIZ!5e0!3m2!1sid!2sid!4v1711200000000!5m2!1sid!2sid',
  };

  const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('contact.submit'), {
      onSuccess: () => {
        reset();
      },
    });
  };

  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`;

  return (
    <>
      <Head title="Kontak - SMK IT Baitul Aziz" />

      <div className="min-h-screen bg-white text-gray-800">
        <Navbar />

        {/* Hero Section */}
        <section ref={heroRef} className="relative py-32 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
          <div className="absolute inset-0 bg-[url('/images/circuit-pattern.svg')] opacity-5 bg-repeat"></div>
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-orange-500/10 blur-[100px] rounded-full"></div>

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-block px-5 py-1.5 mb-6 rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 text-orange-600 text-sm font-medium border border-orange-500/20">
                Hubungi Kami
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                Kontak <span className="text-orange-600">SMK IT Baitul Aziz</span>
              </h1>

              <p className="text-gray-600 text-lg md:text-xl mb-10 max-w-3xl mx-auto">
                Ada pertanyaan atau ingin mengetahui informasi lebih lanjut? Jangan ragu untuk menghubungi kami.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 relative">
          <div className="absolute right-0 top-1/4 w-60 h-60 bg-orange-500/5 rounded-full blur-[100px] -z-10"></div>
          <div className="absolute left-0 bottom-1/4 w-60 h-60 bg-orange-500/5 rounded-full blur-[100px] -z-10"></div>

          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Alamat */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white shadow-lg border border-gray-100 rounded-xl p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Alamat</h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{settings.address}</p>
              </motion.div>

              {/* Telepon */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white shadow-lg border border-gray-100 rounded-xl p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Telepon & WA</h3>
                <p className="text-gray-600 mb-2">Telp: {settings.phone}</p>
                <p className="text-gray-600">WA: {settings.whatsapp}</p>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white shadow-lg border border-gray-100 rounded-xl p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Email</h3>
                <p className="text-gray-600 truncate">{settings.email}</p>
              </motion.div>

              {/* Jam Operasional */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white shadow-lg border border-gray-100 rounded-xl p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Jam Kerja</h3>
                <p className="text-gray-600">{settings.work_hours}</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Form and Map Section */}
        <section ref={formRef} className="py-16 relative">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Map with Contact Info */}
              <div className="order-2 lg:order-1">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={isFormInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white shadow-lg border border-gray-100 rounded-xl overflow-hidden"
                >
                  <div className="relative h-72 overflow-hidden border-b border-gray-100">
                    <iframe
                      src={settings.map_embed_url}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="transition-all duration-300"
                      title="Lokasi SMK IT Baitul Aziz"
                    ></iframe>
                    <div className="absolute inset-0 border-4 border-orange-500/20 pointer-events-none"></div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-900">SMK IT Baitul Aziz</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-600">{settings.address}</p>
                      </div>

                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
                        <p className="text-gray-600">{settings.phone}</p>
                      </div>

                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
                        <p className="text-gray-600">{settings.email}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <a
                        href={mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        Lihat di Google Maps
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isFormInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.6 }}
                className="order-1 lg:order-2"
              >
                <div className="bg-white shadow-lg border border-gray-100 rounded-xl p-8 relative overflow-hidden">
                  <div className="absolute -right-20 -top-20 w-40 h-40 bg-orange-500/10 rounded-full blur-[50px]"></div>
                  <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-orange-500/5 rounded-full blur-[50px]"></div>

                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Kirim Pesan</h3>

                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div>
                      <label htmlFor="name" className="block mb-2 text-gray-600 text-sm font-semibold">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={data.name}
                          onChange={e => setData('name', e.target.value)}
                          className={`w-full py-3 px-5 pl-12 bg-white border rounded-lg focus:outline-none focus:ring-2 text-gray-800 placeholder:text-gray-400 ${errors.name ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-orange-500/50 focus:border-orange-500'
                            }`}
                          placeholder="Masukkan nama lengkap"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-500 font-semibold">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block mb-2 text-gray-600 text-sm font-semibold">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={data.email}
                          onChange={e => setData('email', e.target.value)}
                          className={`w-full py-3 px-5 pl-12 bg-white border rounded-lg focus:outline-none focus:ring-2 text-gray-800 placeholder:text-gray-400 ${errors.email ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-orange-500/50 focus:border-orange-500'
                            }`}
                          placeholder="Masukkan alamat email"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500 font-semibold">{errors.email}</p>
                      )}
                    </div>

                    <div className="relative">
                      <label htmlFor="subject" className="block mb-2 text-gray-600 text-sm font-semibold">
                        Subjek
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={data.subject}
                        onChange={e => setData('subject', e.target.value)}
                        className={`w-full py-3 px-5 bg-white border rounded-lg focus:outline-none focus:ring-2 text-gray-800 placeholder:text-gray-400 appearance-none ${errors.subject ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-orange-500/50 focus:border-orange-500'
                          }`}
                      >
                        <option value="" disabled className="bg-white">Pilih subjek</option>
                        <option value="Informasi Pendaftaran" className="bg-white">Informasi Pendaftaran</option>
                        <option value="Informasi Biaya" className="bg-white">Informasi Biaya</option>
                        <option value="Kerjasama" className="bg-white">Kerjasama</option>
                        <option value="Karir" className="bg-white">Karir & Lowongan Kerja</option>
                        <option value="Lainnya" className="bg-white">Lainnya</option>
                      </select>
                      <div className="absolute top-[44px] right-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {errors.subject && (
                        <p className="mt-1 text-xs text-red-500 font-semibold">{errors.subject}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="block mb-2 text-gray-600 text-sm font-semibold">
                        Pesan
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <MessageSquare className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                          id="message"
                          name="message"
                          required
                          value={data.message}
                          onChange={e => setData('message', e.target.value)}
                          rows={5}
                          className={`w-full py-3 px-5 pl-12 bg-white border rounded-lg focus:outline-none focus:ring-2 text-gray-800 placeholder:text-gray-400 ${errors.message ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-orange-500/50 focus:border-orange-500'
                            }`}
                          placeholder="Masukkan pesan Anda"
                        ></textarea>
                      </div>
                      {errors.message && (
                        <p className="mt-1 text-xs text-red-500 font-semibold">{errors.message}</p>
                      )}
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                      >
                        {processing ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Mengirim...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5 mr-2" />
                            Kirim Pesan
                          </>
                        )}
                      </button>

                      {flash?.success && wasSuccessful && (
                        <div className="mt-4 py-3 px-4 bg-green-100 border border-green-200 rounded-lg text-green-700 text-sm font-semibold flex items-center shadow-sm">
                          <i className="fas fa-check-circle mr-2 text-green-600" />
                          {flash.success}
                        </div>
                      )}

                      {flash?.error && (
                        <div className="mt-4 py-3 px-4 bg-red-100 border border-red-200 rounded-lg text-red-700 text-sm font-semibold flex items-center shadow-sm">
                          <i className="fas fa-exclamation-circle mr-2 text-red-600" />
                          {flash.error}
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
