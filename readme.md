# 🏫 SMK IT Baitul Aziz V2

[![Laravel Version](https://img.shields.io/badge/Laravel-11.x-red.svg?style=for-the-badge&logo=laravel)](https://laravel.com)
[![React Version](https://img.shields.io/badge/React-18.x-blue.svg?style=for-the-badge&logo=react)](https://react.dev)
[![InertiaJS](https://img.shields.io/badge/InertiaJS-1.x-purple.svg?style=for-the-badge&logo=inertia)](https://inertiajs.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

Website resmi terpadu dan modern untuk **SMK IT Baitul Aziz**, dirancang dengan performa optimal menggunakan arsitektur modern **Laravel + React (InertiaJS)** serta desain premium berbasis **Argon Dashboard**.

---

## ✨ Fitur Utama

### 🌐 Sisi Publik (Front-end)
* **Landing Page Interaktif**: Dilengkapi micro-animation halus, slider berita terbaru, dan cuplikan galeri sekolah.
* **Sistem Pendaftaran SPMB (Sistem Penerimaan Murid Baru)**: Alur pendaftaran online terintegrasi, fitur cek status pendaftaran secara langsung, dan cetak kartu pendaftaran.
* **Galeri & Berita Sekolah**: Informasi terupdate seputar kegiatan sekolah dengan kategorisasi dinamis.
* **Informasi Kompetensi & Fasilitas**: Profil detail Program Keahlian (PPLG) beserta sarana prasarana penunjang.
* **Profil & Struktur Organisasi**: Daftar jajaran pengurus, guru-guru, serta visi misi institusi.
* **Formulir Kontak**: Kirim pesan secara real-time ke administrasi sekolah.

### 🛡️ Dashboard Admin (Back-end)
* **Manajemen Pendaftar SPMB**: Panel verifikasi dokumen murid baru (terima/tolak/cadangan), ekspor data pendaftar ke spreadsheet, dan statistik pendaftaran.
* **Pusat Inbox & Pesan**: Kotak masuk interaktif untuk membalas pesan pengunjung langsung melalui email client, menandai pesan, serta menghapus pesan.
* **Manajemen Konten**: Control panel untuk menambah/mengedit berita sekolah (dilengkapi Rich Text Editor), galeri foto, data ekstrakurikuler, dan direktori guru.
* **Setelan Kontak & Media Sosial**: Ubah alamat fisik, nomor telepon, WhatsApp, email, jam operasional, link peta lokasi Google Maps, serta media sosial resmi sekolah langsung dari panel admin.

---

## 🛠️ Spesifikasi Teknologi

| Teknologi | Keterangan |
| :--- | :--- |
| **Backend** | Laravel 11.x (PHP 8.2+) |
| **Frontend** | React 18.x, InertiaJS, TypeScript |
| **Styling** | Tailwind CSS & Argon Dashboard styling system |
| **Database** | MySQL / MariaDB |
| **Icons** | Lucide React & FontAwesome |

---

## 🚀 Panduan Instalasi & Pengembangan

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ini di lingkungan lokal Anda:

### 1. Prasyarat
Pastikan Anda sudah menginstal:
* PHP >= 8.2
* Composer
* Node.js >= 18 & NPM
* MySQL / MariaDB

### 2. Kloning Repositori
```bash
git clone https://github.com/akmalzakial/smkitbaitulaziz.git
cd smkitbaitulaziz
```

### 3. Instalasi Dependensi
Instal paket backend (Composer) dan frontend (NPM):
```bash
composer install
npm install
```

### 4. Konfigurasi Lingkungan (.env)
Salin file `.env.example` ke `.env` dan konfigurasikan koneksi database Anda:
```bash
cp .env.example .env
php artisan key:generate
```

Ubah pengaturan database di file `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database_anda
DB_USERNAME=username_database
DB_PASSWORD=password_database
```

### 5. Migrasi & Seeding Database
Jalankan migrasi tabel beserta data default (termasuk admin default dan informasi kontak):
```bash
php artisan migrate --seed
```

### 6. Menjalankan Server Lokal
Jalankan server Laravel dan compiler Vite secara bersamaan:

```bash
# Terminal 1 - Server PHP
php artisan serve

# Terminal 2 - Frontend Compiler
npm run dev
```

Buka browser Anda dan akses `http://127.0.0.1:8000`.

---

## 📦 Build untuk Produksi

Untuk melakukan kompilasi aset frontend ketika siap di-deploy ke server produksi:
```bash
npm run build
```

---

## 📄 Lisensi

Proyek ini dirilis di bawah [Lisensi MIT](LICENSE).
