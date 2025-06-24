import Layout from '@/components/layout/Layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';

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
    canResetPassword?: boolean;
    success?: string;
}

export default function Login({ status, canResetPassword = true, success }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-md">
                    <div className="bg-card rounded-lg border p-6 shadow-sm">
                        <div className="mb-6 text-center">
                            <h1 className="text-batik-brown text-2xl font-bold tracking-tight">
                                Masuk ke <span className="text-batik-indigo">Batik Gumelem</span>
                            </h1>
                            <p className="text-muted-foreground mt-2 text-sm">Masuk untuk melihat pesanan dan melanjutkan belanja</p>
                        </div>

                        <Head title="Masuk" />

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4">
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="email@example.com"
                                            className="pl-10"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                    </div>
                                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        {canResetPassword && (
                                            <Link href={route('password.request')} className="text-batik-indigo text-sm hover:underline">
                                                Lupa password?
                                            </Link>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="******"
                                            className="pl-10"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-0 right-0 h-full px-3"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="text-muted-foreground h-4 w-4" />
                                            ) : (
                                                <Eye className="text-muted-foreground h-4 w-4" />
                                            )}
                                            <span className="sr-only">{showPassword ? 'Sembunyikan password' : 'Tampilkan password'}</span>
                                        </Button>
                                    </div>
                                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        checked={data.remember}
                                        onCheckedChange={(checked) => setData('remember', checked === true)}
                                    />
                                    <Label htmlFor="remember">Ingat saya</Label>
                                </div>
                            </div>

                            <Button type="submit" className="bg-batik-indigo hover:bg-batik-indigo/90 w-full" disabled={processing}>
                                {processing ? 'Memproses...' : 'Masuk'}
                            </Button>

                            <div className="mt-6 text-center text-sm">
                                <p>
                                    Belum memiliki akun?{' '}
                                    <Link href={route('register')} className="text-batik-indigo font-medium hover:underline">
                                        Daftar sekarang
                                    </Link>
                                </p>
                            </div>
                        </form>

                        {status && <div className="mt-4 text-center text-sm font-medium text-green-600">{status}</div>}
                        {success && <div className="mt-4 text-center text-sm font-medium text-green-600">{success}</div>}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
