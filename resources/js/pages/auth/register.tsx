import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Layout from '@/components/layout/Layout';
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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { t } = useTranslation();

    const { data, setData, post, processing, errors } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-md">
                    <div className="bg-card rounded-lg border p-6 shadow-sm">
                        <div className="mb-6 text-center">
                            <h1 className="text-batik-brown text-2xl font-bold tracking-tight">
                                {t('auth.registerHeadingPrefix')} <span className="text-batik-indigo">{t('auth.brand')}</span>
                            </h1>
                            <p className="text-muted-foreground mt-2 text-sm">{t('auth.registerSubheading')}</p>
                        </div>

                        <Head title={t('auth.registerTitle')} />

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4">
                                <div>
                                    <Label htmlFor="name">{t('auth.fullName')}</Label>
                                    <div className="relative">
                                        <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder={t('auth.fullName')}
                                            className="pl-10"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                        />
                                    </div>
                                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="email">{t('auth.email')}</Label>
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
                                    <Label htmlFor="password">{t('auth.password')}</Label>
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
                                            <span className="sr-only">{showPassword ? t('auth.hidePassword') : t('auth.showPassword')}</span>
                                        </Button>
                                    </div>
                                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="password_confirmation">{t('auth.confirmPassword')}</Label>
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
                                                {showConfirmPassword ? t('auth.hideConfirmPassword') : t('auth.showConfirmPassword')}
                                            </span>
                                        </Button>
                                    </div>
                                    {errors.password_confirmation && <p className="mt-1 text-sm text-red-500">{errors.password_confirmation}</p>}
                                </div>
                            </div>

                            <Button type="submit" className="bg-batik-indigo hover:bg-batik-indigo/90 mt-4 w-full" disabled={processing}>
                                {processing ? t('auth.processing') : t('auth.signUp')}
                            </Button>

                            <div className="mt-6 text-center text-sm">
                                <p>
                                    {t('auth.haveAccount')}{' '}
                                    <Link href={route('login')} className="text-batik-indigo font-medium hover:underline">
                                        {t('auth.signInNow')}
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
