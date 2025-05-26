import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Save } from 'lucide-react';
import React, { useState } from 'react';

interface Blog {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string | null;
    category: string;
    author: string;
    created_at: string;
    updated_at: string;
}

interface BlogsEditProps {
    blog: Blog;
}

export default function BlogsEdit({ blog }: BlogsEditProps) {
    const [title, setTitle] = useState(blog.title);
    const [excerpt, setExcerpt] = useState(blog.excerpt);
    const [content, setContent] = useState(blog.content);
    const [category, setCategory] = useState(blog.category);
    const [author, setAuthor] = useState(blog.author);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(blog.image ? `/storage/${blog.image}` : null);
    const [submitting, setSubmitting] = useState(false);

    // Create breadcrumbs
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dasbor',
            href: '/admin/dashboard',
        },
        {
            title: 'Blog',
            href: '/admin/blogs',
        },
        {
            title: 'Edit',
            href: `/admin/blogs/${blog.id}/edit`,
        },
    ];

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('title', title);
        formData.append('excerpt', excerpt);
        formData.append('content', content);
        formData.append('category', category);
        formData.append('author', author);

        if (image) {
            formData.append('image', image);
        }

        router.post(`/admin/blogs/${blog.id}`, formData, {
            forceFormData: true,
            onSuccess: () => {
                setSubmitting(false);
            },
            onError: () => {
                setSubmitting(false);
            },
        });
    };

    // Handle image upload
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Blog: ${blog.title}`} />

            <div className="space-y-6 p-3 sm:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <h1 className="text-2xl font-bold tracking-tight">Edit Blog</h1>
                </div>

                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle>Detail Blog</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Judul</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Judul Blog"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Kategori</Label>
                                    <Input
                                        id="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        placeholder="Kategori"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="author">Penulis</Label>
                                    <Input
                                        id="author"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        placeholder="Nama Penulis"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="image">Gambar Utama</Label>
                                    <Input id="image" type="file" onChange={handleImageChange} accept="image/*" />
                                    {imagePreview && (
                                        <div className="mt-2">
                                            <img src={imagePreview} alt="Pratinjau" className="h-40 rounded-md object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Ringkasan</Label>
                                <Textarea
                                    id="excerpt"
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    placeholder="Deskripsi singkat untuk blog"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Konten</Label>
                                <RichTextEditor content={content} onChange={setContent} />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2 border-t px-6 py-4">
                            <Button type="button" variant="outline" onClick={() => router.visit('/admin/blogs')} disabled={submitting}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                <Save className="mr-2 h-4 w-4" />
                                Perbarui Blog
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AdminLayout>
    );
}
