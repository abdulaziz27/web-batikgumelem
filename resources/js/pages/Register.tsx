import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

// Form schema
const registerSchema = z
    .object({
        name: z.string().min(3, 'Nama minimal 3 karakter'),
        email: z.string().email('Email tidak valid'),
        password: z.string().min(6, 'Password minimal 6 karakter'),
        confirmPassword: z.string().min(6, 'Password minimal 6 karakter'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Password tidak sama',
        path: ['confirmPassword'],
    });

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    // Setup form
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (data: RegisterFormValues) => {
        // Simulate registration - in a real app, this would call an API
        console.info('Registration attempt with:', data.email);
        toast('Pendaftaran berhasil', {
            description: 'Selamat datang di Batik Gumelem',
        });
        navigate('/login');
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-md">
                    <div className="bg-card rounded-lg border p-6 shadow-sm">
                        <div className="mb-6 text-center">
                            <h1 className="text-batik-brown text-2xl font-bold tracking-tight">
                                Daftar di <span className="text-batik-indigo">Batik Gumelem</span>
                            </h1>
                            <p className="text-muted-foreground mt-2 text-sm">Buat akun untuk menikmati berbagai keuntungan</p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama Lengkap</FormLabel>
                                            <div className="relative">
                                                <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                                <FormControl>
                                                    <Input placeholder="Nama Lengkap" className="pl-10" {...field} />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

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

                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Konfirmasi Password</FormLabel>
                                            <div className="relative">
                                                <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                                <FormControl>
                                                    <Input
                                                        type={showConfirmPassword ? 'text' : 'password'}
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
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="text-muted-foreground h-4 w-4" />
                                                    ) : (
                                                        <Eye className="text-muted-foreground h-4 w-4" />
                                                    )}
                                                    <span className="sr-only">
                                                        {showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                                    </span>
                                                </Button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="bg-batik-indigo hover:bg-batik-indigo/90 w-full">
                                    Daftar
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-6 text-center text-sm">
                            <p>
                                Sudah memiliki akun?{' '}
                                <Link to="/login" className="text-batik-indigo font-medium hover:underline">
                                    Masuk sekarang
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Register;
