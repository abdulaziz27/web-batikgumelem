import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2, Mail } from 'lucide-react';

import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

interface VerifyEmailProps {
    status?: string;
}

export default function VerifyEmail({ status }: VerifyEmailProps) {
    const { post, processing } = useForm({});

    const handleResendVerification = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-md">
                    <div className="bg-card rounded-lg border p-6 shadow-sm">
                        <div className="mb-6 text-center">
                            <div className="flex justify-center">
                                <div className="bg-batik-indigo/10 flex h-16 w-16 items-center justify-center rounded-full">
                                    <Mail className="text-batik-indigo h-8 w-8" />
                                </div>
                            </div>
                            <h1 className="text-batik-brown mt-4 text-2xl font-bold tracking-tight">Verifikasi Email</h1>
                            <p className="text-muted-foreground mt-2 text-sm">
                                Silakan verifikasi alamat email Anda dengan mengklik tautan yang telah kami kirimkan ke email Anda.
                            </p>
                        </div>

                        <Head title="Verifikasi Email" />

                        {status === 'verification-link-sent' && (
                            <div className="mb-6 rounded-md bg-green-50 p-4 text-sm text-green-600">
                                Tautan verifikasi baru telah dikirim ke alamat email yang Anda berikan saat pendaftaran.
                            </div>
                        )}

                        <form onSubmit={handleResendVerification} className="space-y-6">
                            <div className="text-center">
                                <p className="mb-6 text-sm text-gray-600">
                                    Jika Anda tidak menerima email verifikasi, silakan periksa folder spam atau klik tombol di bawah ini untuk
                                    mengirim ulang.
                                </p>

                                <Button type="submit" className="bg-batik-indigo hover:bg-batik-indigo/90 w-full" disabled={processing}>
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Mengirim...
                                        </>
                                    ) : (
                                        'Kirim Ulang Email Verifikasi'
                                    )}
                                </Button>

                                <div className="mt-6">
                                    <Link href={route('home')} className="text-batik-indigo text-sm hover:underline">
                                        Kembali ke Beranda
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
