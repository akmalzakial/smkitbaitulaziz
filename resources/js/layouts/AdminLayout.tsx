import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface PageProps {
  auth: {
    user: User;
  };
  [key: string]: any;
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { auth } = usePage<PageProps>().props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [ppdbSubmenuOpen, setPpdbSubmenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-open PPDB submenu if on a PPDB page
  useEffect(() => {
    if (isActive('/admin/spmb')) {
      setPpdbSubmenuOpen(true);
    }
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const isActive = (path: string) => window.location.pathname.startsWith(path);
  const isExactActive = (path: string) => window.location.pathname === path;

  const getPageName = () => {
    const path = window.location.pathname;
    if (path.includes('/spmb/settings')) return 'Pengaturan SPMB';
    if (path.includes('/spmb/dashboard')) return 'Dashboard SPMB';
    if (path.includes('/spmb')) return 'SPMB';
    if (path.includes('/users')) return 'Pengguna';
    if (path.includes('/gallery')) return 'Galeri';
    if (path.includes('/news')) return 'Berita';
    if (path.includes('/teachers')) return 'Guru';
    if (path.includes('/extracurriculars')) return 'Ekstrakurikuler';
    if (path.includes('/settings')) return 'Pengaturan Profil';
    return 'Dashboard';
  };

  const menuItemClass = (active: boolean) =>
    `py-2.5 text-sm my-0 mx-2 flex items-center whitespace-nowrap px-4 transition-all duration-200 rounded-lg ${
      active
        ? 'bg-orange-500/10 font-semibold text-slate-700 shadow-sm'
        : 'text-slate-500 hover:bg-gray-100 hover:text-slate-700'
    }`;

  const iconWrapperClass = 'mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center';

  const iconClass = (active: boolean, color: string) =>
    `relative top-0 text-sm leading-normal ${active ? color : 'text-slate-400'}`;

  return (
    <div className="m-0 font-sans text-base antialiased font-normal leading-default bg-gray-50 text-slate-500 min-h-screen" style={{ fontFamily: "'Open Sans', sans-serif" }}>
      {/* Background gradient header */}
      <div className="absolute w-full bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600 min-h-[19rem]" />

      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm xl:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      />

      {/* ======= SIDEBAR ======= */}
      <aside
        className={`fixed inset-y-0 flex-wrap items-center justify-between block w-full p-0 my-4 overflow-y-auto antialiased transition-all duration-300 bg-white border-0 shadow-2xl max-w-[16rem] z-50 rounded-2xl ${
          sidebarOpen
            ? 'translate-x-0 ml-4'
            : '-translate-x-full xl:translate-x-0 xl:ml-6 xl:left-0'
        }`}
      >
        {/* Logo Area */}
        <div className="h-[4.75rem]">
          <button
            className="absolute top-0 right-0 p-4 opacity-50 cursor-pointer text-slate-400 xl:hidden hover:opacity-100 transition-opacity"
            onClick={closeSidebar}
          >
            <i className="fas fa-times" />
          </button>
          <Link
            href="/admin/dashboard"
            className="block px-8 py-6 m-0 text-sm whitespace-nowrap text-slate-700"
          >
            <img
              src="/assets/images/logo.png"
              className="inline h-full max-w-full transition-all duration-200 max-h-8"
              alt="SMK IT Baitul Aziz"
            />
            <span className="ml-2 font-semibold text-slate-700 transition-all duration-200">
              SMK IT Admin
            </span>
          </Link>
        </div>

        <hr className="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent" />

        {/* Navigation Menu */}
        <div className="items-center block w-auto max-h-screen overflow-auto grow basis-full pb-4">
          <ul className="flex flex-col pl-0 mb-0">
            {/* Dashboard */}
            <li className="mt-0.5 w-full">
              <Link href="/admin/dashboard" className={menuItemClass(isExactActive('/admin/dashboard'))}>
                <div className={iconWrapperClass}>
                  <i className={iconClass(isExactActive('/admin/dashboard'), 'text-orange-500') + ' ni ni-tv-2'} />
                </div>
                <span className="ml-1 duration-300 opacity-100 pointer-events-none ease">Dashboard</span>
              </Link>
            </li>

            {/* SPMB with Submenu */}
            <li className="mt-0.5 w-full">
              <button
                onClick={() => setPpdbSubmenuOpen(!ppdbSubmenuOpen)}
                className={`${menuItemClass(isActive('/admin/spmb'))} w-full justify-between`}
              >
                <div className="flex items-center">
                  <div className={iconWrapperClass}>
                    <i className={iconClass(isActive('/admin/spmb'), 'text-orange-500') + ' ni ni-single-copy-04'} />
                  </div>
                  <span className="ml-1 duration-300 opacity-100 pointer-events-none ease">SPMB</span>
                </div>
                <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${ppdbSubmenuOpen ? 'rotate-180' : ''} ${isActive('/admin/spmb') ? 'text-orange-500' : 'text-slate-400'}`} />
              </button>
              
              {/* PPDB Submenu */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${ppdbSubmenuOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <ul className="ml-10 mt-1 space-y-0.5">
                  <li>
                    <Link
                      href="/admin/spmb/dashboard"
                      className={`py-1.5 text-xs flex items-center whitespace-nowrap px-4 rounded-lg transition-all duration-200 ${
                        isActive('/admin/spmb/dashboard') ? 'text-orange-500 font-semibold bg-orange-50' : 'text-slate-500 hover:text-slate-700 hover:bg-gray-50'
                      }`}
                    >
                      <i className="mr-2 fas fa-chart-pie text-[10px]" />
                      Dashboard SPMB
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/spmb"
                      className={`py-1.5 text-xs flex items-center whitespace-nowrap px-4 rounded-lg transition-all duration-200 ${
                        isExactActive('/admin/spmb') ? 'text-orange-500 font-semibold bg-orange-50' : 'text-slate-500 hover:text-slate-700 hover:bg-gray-50'
                      }`}
                    >
                      <i className="mr-2 fas fa-users text-[10px]" />
                      Daftar Pendaftar
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/spmb/settings"
                      className={`py-1.5 text-xs flex items-center whitespace-nowrap px-4 rounded-lg transition-all duration-200 ${
                        isActive('/admin/spmb/settings') ? 'text-orange-500 font-semibold bg-orange-50' : 'text-slate-500 hover:text-slate-700 hover:bg-gray-50'
                      }`}
                    >
                      <i className="mr-2 fas fa-cog text-[10px]" />
                      Pengaturan SPMB
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            {/* Gallery */}
            <li className="mt-0.5 w-full">
              <Link href="/admin/gallery" className={menuItemClass(isActive('/admin/gallery'))}>
                <div className={iconWrapperClass}>
                  <i className={iconClass(isActive('/admin/gallery'), 'text-emerald-500') + ' ni ni-image'} />
                </div>
                <span className="ml-1 duration-300 opacity-100 pointer-events-none ease">Galeri</span>
              </Link>
            </li>

            {/* News */}
            <li className="mt-0.5 w-full">
              <Link href="/admin/news" className={menuItemClass(isActive('/admin/news'))}>
                <div className={iconWrapperClass}>
                  <i className={iconClass(isActive('/admin/news'), 'text-cyan-500') + ' ni ni-paper-diploma'} />
                </div>
                <span className="ml-1 duration-300 opacity-100 pointer-events-none ease">Berita</span>
              </Link>
            </li>

            {/* Extracurriculars */}
            <li className="mt-0.5 w-full">
              <Link href="/admin/extracurriculars" className={menuItemClass(isActive('/admin/extracurriculars'))}>
                <div className={iconWrapperClass}>
                  <i className={iconClass(isActive('/admin/extracurriculars'), 'text-red-500') + ' ni ni-trophy'} />
                </div>
                <span className="ml-1 duration-300 opacity-100 pointer-events-none ease">Ekstrakurikuler</span>
              </Link>
            </li>

            {/* Divider */}
            <li className="w-full mt-4">
              <h6 className="pl-6 ml-2 text-[0.65rem] font-bold leading-tight uppercase opacity-60 text-slate-500 tracking-wider">
                Manajemen
              </h6>
            </li>

            {/* Users */}
            <li className="mt-0.5 w-full">
              <Link href="/admin/users" className={menuItemClass(isActive('/admin/users'))}>
                <div className={iconWrapperClass}>
                  <i className={iconClass(isActive('/admin/users'), 'text-slate-700') + ' ni ni-single-02'} />
                </div>
                <span className="ml-1 duration-300 opacity-100 pointer-events-none ease">Pengguna</span>
              </Link>
            </li>

            {/* Teachers */}
            <li className="mt-0.5 w-full">
              <Link href="/admin/teachers" className={menuItemClass(isActive('/admin/teachers'))}>
                <div className={iconWrapperClass}>
                  <i className={iconClass(isActive('/admin/teachers'), 'text-blue-500') + ' ni ni-hat-3'} />
                </div>
                <span className="ml-1 duration-300 opacity-100 pointer-events-none ease">Guru</span>
              </Link>
            </li>

            {/* Informasi Kontak */}
            <li className="mt-0.5 w-full">
              <Link href="/admin/contact" className={menuItemClass(isActive('/admin/contact'))}>
                <div className={iconWrapperClass}>
                  <i className={iconClass(isActive('/admin/contact'), 'text-orange-500') + ' ni ni-pin-3'} />
                </div>
                <span className="ml-1 duration-300 opacity-100 pointer-events-none ease">Informasi Kontak</span>
              </Link>
            </li>

            {/* Pesan Masuk */}
            <li className="mt-0.5 w-full">
              <Link href="/admin/messages" className={menuItemClass(isActive('/admin/messages'))}>
                <div className={iconWrapperClass}>
                  <i className={iconClass(isActive('/admin/messages'), 'text-purple-500') + ' ni ni-email-83'} />
                </div>
                <span className="ml-1 duration-300 opacity-100 pointer-events-none ease">Pesan Masuk</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Sidebar Footer */}
        <div className="mx-4 mb-4">
          <div className="relative flex flex-col min-w-0 break-words bg-transparent border-0 shadow-none rounded-2xl">
            <div className="flex-auto w-full p-4 pt-0 text-center">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-block w-full px-6 py-2 text-xs font-bold leading-normal text-center text-white capitalize transition-all ease-in rounded-lg shadow-md bg-gradient-to-tl from-orange-500 to-yellow-500 hover:shadow-lg hover:-translate-y-px"
              >
                <i className="fas fa-external-link-alt mr-1.5" />
                Lihat Website
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* ======= MAIN CONTENT ======= */}
      <main className="relative h-full max-h-screen transition-all duration-200 ease-in-out xl:ml-[17rem] rounded-xl">
        {/* Navbar */}
        <nav className="relative flex flex-wrap items-center justify-between px-0 py-2 mx-6 transition-all ease-in shadow-none duration-250 rounded-2xl lg:flex-nowrap lg:justify-start">
          <div className="flex items-center justify-between w-full px-4 py-1 mx-auto flex-wrap-inherit">
            <nav>
              {/* Breadcrumb */}
              <ol className="flex flex-wrap pt-1 mr-12 bg-transparent rounded-lg sm:mr-16">
                <li className="text-sm leading-normal">
                  <a className="text-white opacity-50" href="#">Admin</a>
                </li>
                <li className="text-sm pl-2 capitalize leading-normal text-white before:float-left before:pr-2 before:text-white before:content-['/']">
                  {getPageName()}
                </li>
              </ol>
              <h6 className="mb-0 font-bold text-white capitalize">{getPageName()}</h6>
            </nav>

            <div className="flex items-center mt-2 grow sm:mt-0 sm:mr-6 md:mr-0 lg:flex lg:basis-auto">
              {/* Search */}
              <div className="flex items-center md:ml-auto md:pr-4">
                <div className="relative flex flex-wrap items-stretch w-full transition-all rounded-lg ease">
                  <span className="text-sm ease absolute z-50 -ml-px flex h-full items-center whitespace-nowrap rounded-lg rounded-tr-none rounded-br-none border border-r-0 border-transparent bg-transparent py-2 px-2.5 text-center font-normal text-slate-500 transition-all leading-5">
                    <i className="fas fa-search" />
                  </span>
                  <input
                    type="text"
                    className="pl-9 text-sm focus:shadow-md ease w-full leading-5 relative -ml-px block min-w-0 flex-auto rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-orange-400 focus:outline-none focus:transition-shadow"
                    placeholder="Cari..."
                  />
                </div>
              </div>

              <ul className="flex flex-row justify-end pl-0 mb-0 list-none md-max:w-full ml-auto">
                {/* Notification Bell */}
                <li className="relative flex items-center pr-2">
                  <button className="block p-0 text-sm text-white transition-all ease-nav-brand hover:opacity-80">
                    <i className="cursor-pointer fa fa-bell" />
                  </button>
                </li>

                {/* Mobile menu button */}
                <li className="flex items-center pl-4 xl:hidden">
                  <button
                    onClick={toggleSidebar}
                    className="block p-0 text-sm text-white transition-all ease-nav-brand"
                  >
                    <div className="w-[1.125rem] overflow-hidden">
                      <i className="ease mb-[0.2rem] relative block h-[2px] rounded-sm bg-white transition-all" />
                      <i className="ease mb-[0.2rem] relative block h-[2px] rounded-sm bg-white transition-all" />
                      <i className="ease relative block h-[2px] rounded-sm bg-white transition-all" />
                    </div>
                  </button>
                </li>

                {/* User dropdown */}
                <li ref={dropdownRef} className="relative flex items-center px-4">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center p-0 text-sm text-white transition-all ease-nav-brand hover:opacity-80"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-2">
                      <i className="fa fa-user text-xs" />
                    </div>
                    <span className="hidden sm:inline font-medium">{auth.user.name}</span>
                    <i className={`fa fa-chevron-down ml-2 text-[10px] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <div className={`absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 transition-all duration-200 origin-top-right ${
                    dropdownOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                  }`}>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-slate-700 truncate">{auth.user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{auth.user.email}</p>
                    </div>
                    <a
                      href="/"
                      className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-gray-50 transition-colors"
                    >
                      <i className="fa fa-home mr-3 text-slate-400 w-4 text-center" />
                      Ke Website
                    </a>
                    <Link
                      href="/settings/profile"
                      className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-gray-50 transition-colors"
                    >
                      <i className="fa fa-user-cog mr-3 text-slate-400 w-4 text-center" />
                      Profil
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <Link
                      href="/logout"
                      method="post"
                      as="button"
                      className="flex items-center w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <i className="fa fa-sign-out-alt mr-3 w-4 text-center" />
                      Logout
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="w-full px-6 py-6 mx-auto">
          {children}
        </div>

        {/* Footer */}
        <footer className="pt-4 pb-6">
          <div className="w-full px-6 mx-auto">
            <div className="flex flex-wrap items-center -mx-3 lg:justify-between">
              <div className="w-full max-w-full px-3 mt-0 mb-6 shrink-0 lg:mb-0 lg:w-1/2 lg:flex-none">
                <div className="text-sm leading-normal text-center text-slate-500 lg:text-left">
                  © {new Date().getFullYear()}, dibuat oleh{' '}
                  <span className="font-semibold text-orange-500">SMK IT Baitul Aziz</span>
                </div>
              </div>
              <div className="w-full max-w-full px-3 mt-0 shrink-0 lg:w-1/2 lg:flex-none">
                <ul className="flex flex-wrap justify-center pl-0 mb-0 list-none lg:justify-end">
                  <li className="nav-item">
                    <a href="/" className="block px-4 pt-0 pb-1 text-sm font-normal text-slate-500 transition-colors hover:text-orange-500" target="_blank" rel="noreferrer">
                      Website
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AdminLayout;