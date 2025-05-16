import { Head, Link, useForm } from '@inertiajs/react';
import { Mail } from 'lucide-react';

import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-md">
                    <div className="bg-card rounded-lg border p-6 shadow-sm">
                        <div className="mb-6 text-center">
                            <h1 className="text-batik-brown text-2xl font-bold tracking-tight">Lupa Password</h1>
                            <p className="text-muted-foreground mt-2 text-sm">Masukkan email Anda untuk menerima tautan reset password</p>
                        </div>

                        <Head title="Lupa Password" />

                        {status && <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-600">{status}</div>}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="email@example.com"
                                        className="pl-10"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                </div>
                                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                            </div>

                            <div className="flex items-center justify-between">
                                <Link href={route('login')} className="text-batik-indigo text-sm hover:underline">
                                    Kembali ke halaman masuk
                                </Link>

                                <Button type="submit" className="bg-batik-indigo hover:bg-batik-indigo/90" disabled={processing}>
                                    {processing ? 'Memproses...' : 'Kirim Tautan Reset'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
