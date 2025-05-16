import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

// Form schema
const loginSchema = z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Setup form
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = (data: LoginFormValues) => {
        // Simulate login - in a real app, this would call an API
        console.info('Login attempt with:', data.email);
        toast('Login berhasil', {
            description: 'Selamat datang kembali di Batik Gumelem',
        });
        navigate('/products');
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

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <div className="relative">
                                                <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                                <FormControl>
                                                    <Input placeholder="email@example.com" className="pl-10" {...field} />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <div className="relative">
                                                <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                                <FormControl>
                                                    <Input
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="******"
                                                        className="pl-10"
                                                        {...field}
                                                    />
                                                </FormControl>
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
                                                    <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                                                </Button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="bg-batik-indigo hover:bg-batik-indigo/90 w-full">
                                    Masuk
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-6 text-center text-sm">
                            <p>
                                Belum memiliki akun?{' '}
                                <Link to="/register" className="text-batik-indigo font-medium hover:underline">
                                    Daftar sekarang
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
