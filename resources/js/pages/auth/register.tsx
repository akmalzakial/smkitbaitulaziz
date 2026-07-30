import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center px-4 py-12 relative overflow-hidden">
            <Head title="Registrasi" />
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8 relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <Link href="/">
                        <img src="/assets/images/logo.png" alt="SMK IT Baitul Aziz" className="h-24 w-auto mb-4 hover:scale-105 transition-transform" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Daftar <span className="text-orange-500">Akun</span></h1>
                    <p className="text-slate-500 text-sm mt-1.5 text-center">Lengkapi data berikut untuk membuat akun baru dan melakukan pendaftaran SPMB</p>
                </div>
                
                <form className="flex flex-col gap-5" onSubmit={submit}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-slate-700 font-medium">Nama Lengkap</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Nama lengkap"
                                className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500 focus:bg-white"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-slate-700 font-medium">Alamat Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="email@example.com"
                                className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500 focus:bg-white"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Password"
                                className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500 focus:bg-white"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className="text-slate-700 font-medium">Konfirmasi Password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Konfirmasi password"
                                className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500 focus:bg-white"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <Button 
                            type="submit" 
                            className="mt-3 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md shadow-orange-500/20 font-semibold py-2.5 rounded-lg transition-all" 
                            tabIndex={5} 
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Daftar Sekarang
                        </Button>
                    </div>

                    <div className="text-center text-sm text-slate-500 mt-2">
                        Sudah punya akun?{' '}
                        <TextLink href={route('login')} className="text-orange-600 hover:text-orange-700 font-semibold" tabIndex={6}>
                            Login di sini
                        </TextLink>
                    </div>
                </form>
            </div>
        </div>
    );
}
