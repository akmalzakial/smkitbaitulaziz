import { Head, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import AdminLayout from '@/layouts/AdminLayout';
import ArgonCard from '@/components/admin/ArgonCard';
import { Link } from '@inertiajs/react';

const AdminSettingsNav = ({ activeTab }: { activeTab: 'profile' | 'password' | 'appearance' }) => {
  const getLinkClass = (tab: string) => {
    const base = "flex items-center px-4 py-3.5 text-xs font-bold uppercase rounded-xl transition-all duration-200 ";
    return base + (activeTab === tab
      ? "bg-gradient-to-tl from-orange-500 to-yellow-500 text-white shadow-md"
      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700");
  };

  return (
    <ArgonCard title="Menu Pengaturan" noPadding className="pb-2">
      <div className="flex flex-col p-3 space-y-1">
        <Link href="/settings/profile" className={getLinkClass('profile')}>
          <i className="fas fa-user-cog mr-3 text-sm" />
          Informasi Profil
        </Link>
        <Link href="/settings/password" className={getLinkClass('password')}>
          <i className="fas fa-key mr-3 text-sm" />
          Ubah Kata Sandi
        </Link>
        <Link href="/settings/appearance" className={getLinkClass('appearance')}>
          <i className="fas fa-palette mr-3 text-sm" />
          Tampilan
        </Link>
      </div>
    </ArgonCard>
  );
};

export default function Appearance() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth?.user?.role === 'admin';

    if (isAdmin) {
        return (
            <AdminLayout>
                <Head title="Pengaturan Tampilan - Admin Dashboard" />

                {/* Header Title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white mb-1">Pengaturan Tampilan</h1>
                    <p className="text-white/80 text-sm">Sesuaikan gaya visual dan tema dashboard Anda.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-1">
                        <AdminSettingsNav activeTab="appearance" />
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <ArgonCard title="Tema Visual">
                            <div className="space-y-4">
                                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                                    Pilih tema visual yang nyaman untuk mata Anda saat menggunakan dashboard.
                                </p>
                                
                                <div className="mt-2">
                                    <AppearanceTabs />
                                </div>
                            </div>
                        </ArgonCard>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const breadcrumbs = [
        {
            title: 'Appearance settings',
            href: '/settings/appearance',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
