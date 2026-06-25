import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

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

export default function Password() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user.role === 'admin';

    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    if (isAdmin) {
        return (
            <AdminLayout>
                <Head title="Ubah Kata Sandi - Admin Dashboard" />

                {/* Header Title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white mb-1">Ubah Kata Sandi</h1>
                    <p className="text-white/80 text-sm">Pastikan akun Anda menggunakan kata sandi yang kuat dan aman.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-1">
                        <AdminSettingsNav activeTab="password" />
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <ArgonCard title="Perbarui Kata Sandi">
                            <form onSubmit={updatePassword} className="space-y-4">
                                <div>
                                    <label htmlFor="current_password" className="block text-xs font-bold uppercase text-slate-400 mb-1">
                                        Kata Sandi Saat Ini
                                    </label>
                                    <input
                                        id="current_password"
                                        type="password"
                                        ref={currentPasswordInput}
                                        className="focus:shadow-primary-outline text-xs leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-semibold text-slate-700 outline-none transition-all focus:border-orange-500 focus:outline-none"
                                        value={data.current_password}
                                        onChange={(e) => setData('current_password', e.target.value)}
                                        autoComplete="current-password"
                                        placeholder="Kata Sandi Saat Ini"
                                    />
                                    <InputError className="mt-1" message={errors.current_password} />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-xs font-bold uppercase text-slate-400 mb-1">
                                        Kata Sandi Baru
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        ref={passwordInput}
                                        className="focus:shadow-primary-outline text-xs leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-semibold text-slate-700 outline-none transition-all focus:border-orange-500 focus:outline-none"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        autoComplete="new-password"
                                        placeholder="Kata Sandi Baru"
                                    />
                                    <InputError className="mt-1" message={errors.password} />
                                </div>

                                <div>
                                    <label htmlFor="password_confirmation" className="block text-xs font-bold uppercase text-slate-400 mb-1">
                                        Konfirmasi Kata Sandi Baru
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        className="focus:shadow-primary-outline text-xs leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-semibold text-slate-700 outline-none transition-all focus:border-orange-500 focus:outline-none"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        autoComplete="new-password"
                                        placeholder="Konfirmasi Kata Sandi Baru"
                                    />
                                    <InputError className="mt-1" message={errors.password_confirmation} />
                                </div>

                                <div className="flex items-center gap-4 pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-block px-5 py-2.5 bg-gradient-to-tl from-orange-500 to-yellow-500 text-white text-xs font-bold uppercase rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-px text-center disabled:opacity-50"
                                    >
                                        Simpan Sandi Baru
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
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const breadcrumbs = [
        {
            title: 'Password settings',
            href: '/settings/password',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <Head title="Password settings" />
                    <form onSubmit={updatePassword} className="space-y-6">
                        <div className="grid gap-2">
                            <label htmlFor="current_password">Current password</label>

                            <input
                                id="current_password"
                                ref={currentPasswordInput}
                                value={data.current_password}
                                onChange={(e) => setData('current_password', e.target.value)}
                                type="password"
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                placeholder="Current password"
                            />

                            <InputError message={errors.current_password} />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="password">New password</label>

                            <input
                                id="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                type="password"
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                placeholder="New password"
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="password_confirmation">Confirm password</label>

                            <input
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                type="password"
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                placeholder="Confirm password"
                            />

                            <InputError message={errors.password_confirmation} />
                        </div>

                        <div className="flex items-center gap-4">
                            <button disabled={processing}>Save password</button>

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
            </SettingsLayout>
        </AppLayout>
    );
}
