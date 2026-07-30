import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center px-4 py-12 relative overflow-hidden">
            <Head title="Login" />

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>
            
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8 relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <Link href="/">
                        <img src="/assets/images/logo.png" alt="SMK IT Baitul Aziz" className="h-24 w-auto mb-4 hover:scale-105 transition-transform" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Login <span className="text-orange-500">Akun</span></h1>
                    <p className="text-slate-500 text-sm mt-1.5 text-center">Masukkan email dan password untuk masuk ke sistem</p>
                </div>
                
                <form className="flex flex-col gap-5" onSubmit={submit}>
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-slate-700 font-medium">Alamat Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@example.com"
                                className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500 focus:bg-white"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                                {canResetPassword && (
                                    <TextLink href={route('password.request')} className="ml-auto text-sm text-orange-600 hover:text-orange-700 font-medium" tabIndex={5}>
                                        Lupa password?
                                    </TextLink>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Password"
                                className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500 focus:bg-white"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onClick={() => setData('remember', !data.remember)}
                                tabIndex={3}
                                className="border-slate-300 text-orange-500 focus:ring-orange-500"
                            />
                            <Label htmlFor="remember" className="text-slate-600 font-normal">Ingat saya</Label>
                        </div>

                        <Button 
                            type="submit" 
                            className="mt-2 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md shadow-orange-500/20 font-semibold py-2.5 rounded-lg transition-all" 
                            tabIndex={4} 
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Masuk
                        </Button>
                    </div>

                    <div className="text-center text-sm text-slate-500 mt-2">
                        Belum punya akun?{' '}
                        <TextLink href={route('register')} className="text-orange-600 hover:text-orange-700 font-semibold" tabIndex={5}>
                            Daftar sekarang
                        </TextLink>
                    </div>
                </form>

                {status && <div className="mt-4 text-center text-sm font-medium text-emerald-600 bg-emerald-50 py-2 rounded-lg border border-emerald-200">{status}</div>}
            </div>
        </div>
    );
}
