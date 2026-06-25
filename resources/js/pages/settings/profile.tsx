import { type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import AdminLayout from '@/layouts/AdminLayout';
import ArgonCard from '@/components/admin/ArgonCard';

type ProfileForm = {
    name: string;
    email: string;
}

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

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user.role === 'admin';

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    if (isAdmin) {
        return (
            <AdminLayout>
                <Head title="Pengaturan Profil - Admin Dashboard" />
                
                {/* Header Title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white mb-1">Pengaturan Profil</h1>
                    <p className="text-white/80 text-sm">Kelola informasi data diri dan keamanan akun Anda.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-1">
                        <AdminSettingsNav activeTab="profile" />
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <ArgonCard title="Informasi Profil">
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-xs font-bold uppercase text-slate-400 mb-1">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="focus:shadow-primary-outline text-xs leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-semibold text-slate-700 outline-none transition-all focus:border-orange-500 focus:outline-none"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoComplete="name"
                                        placeholder="Nama Lengkap"
                                    />
                                    <InputError className="mt-1" message={errors.name} />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-xs font-bold uppercase text-slate-400 mb-1">
                                        Alamat Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="focus:shadow-primary-outline text-xs leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-semibold text-slate-700 outline-none transition-all focus:border-orange-500 focus:outline-none"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="username"
                                        placeholder="Alamat Email"
                                    />
                                    <InputError className="mt-1" message={errors.email} />
                                </div>

                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 text-xs text-amber-700 leading-normal">
                                        <i className="fas fa-exclamation-circle mr-1" />
                                        Alamat email Anda belum terverifikasi.{' '}
                                        <Link
                                            href={route('verification.send')}
                                            method="post"
                                            as="button"
                                            className="underline hover:text-amber-900 font-bold"
                                        >
                                            Kirim ulang email verifikasi.
                                        </Link>
                                    </div>
                                )}

                                {status === 'verification-link-sent' && (
                                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-xs text-emerald-700">
                                        Link verifikasi baru telah dikirim ke alamat email Anda.
                                    </div>
                                )}

                                <div className="flex items-center gap-4 pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-block px-5 py-2.5 bg-gradient-to-tl from-orange-500 to-yellow-500 text-white text-xs font-bold uppercase rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-px text-center disabled:opacity-50"
                                    >
                                        Simpan Perubahan
                                    </button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <span className="text-xs font-bold text-emerald-600 flex items-center">
                                            <i className="fas fa-check mr-1" /> Tersimpan
                                        </span>
                                    </Transition>
                                </div>
                            </form>
                        </ArgonCard>

                        {/* Account Deletion */}
                        <ArgonCard title="Hapus Akun">
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                                <h6 className="text-red-700 font-bold text-sm mb-1">
                                    <i className="fas fa-exclamation-triangle mr-1.5" /> Peringatan
                                </h6>
                                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                                    Setelah akun Anda dihapus, semua data dan sumber daya di dalamnya akan dihapus secara permanen. Harap berhati-hati sebelum melakukan tindakan ini.
                                </p>
                                <DeleteUser />
                            </div>
                        </ArgonCard>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const breadcrumbs = [
        {
            title: 'Profile settings',
            href: '/settings/profile',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your name and email address" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="text-muted-foreground -mt-4 text-sm">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
