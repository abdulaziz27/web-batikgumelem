import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';

import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('password.store'));
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-md">
                    <div className="bg-card rounded-lg border p-6 shadow-sm">
                        <div className="mb-6 text-center">
                            <h1 className="text-batik-brown text-2xl font-bold tracking-tight">Reset Password</h1>
                            <p className="text-muted-foreground mt-2 text-sm">Silakan masukkan password baru Anda</p>
                        </div>

                        <Head title="Reset Password" />

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4">
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                        <Input id="email" name="email" type="email" value={data.email} className="pl-10" readOnly />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="password">Password Baru</Label>
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

                                <div>
                                    <Label htmlFor="password_confirmation">Konfirmasi Password Baru</Label>
                                    <div className="relative">
                                        <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="******"
                                            className="pl-10"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-0 right-0 h-full px-3"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="text-muted-foreground h-4 w-4" />
                                            ) : (
                                                <Eye className="text-muted-foreground h-4 w-4" />
                                            )}
                                            <span className="sr-only">
                                                {showConfirmPassword ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'}
                                            </span>
                                        </Button>
                                    </div>
                                    {errors.password_confirmation && <p className="mt-1 text-sm text-red-500">{errors.password_confirmation}</p>}
                                </div>
                            </div>

                            <Button type="submit" className="bg-batik-indigo hover:bg-batik-indigo/90 mt-4 w-full" disabled={processing}>
                                {processing ? 'Memproses...' : 'Reset Password'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
