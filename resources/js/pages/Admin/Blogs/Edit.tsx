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
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
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
            title: t('dashboard.nav.adminDashboard'),
            href: '/admin/dashboard',
        },
        {
            title: t('dashboard.nav.adminBlogs'),
            href: '/admin/blogs',
        },
        {
            title: t('dashboard.pages.adminBlogEdit.title'),
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
            <Head title={t('dashboard.pages.adminBlogEdit.headTitleFmt', { title: blog.title })} />

            <div className="space-y-6 p-3 sm:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <h1 className="text-2xl font-bold tracking-tight">{t('dashboard.pages.adminBlogEdit.title')}</h1>
                </div>

                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle>{t('dashboard.pages.adminBlogCreate.cardTitle')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title">{t('dashboard.pages.adminBlogCreate.fieldTitle')}</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder={t('dashboard.pages.adminBlogCreate.titlePlaceholder')}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">{t('dashboard.pages.adminBlogCreate.fieldCategory')}</Label>
                                    <Input
                                        id="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        placeholder={t('dashboard.pages.adminBlogCreate.categoryPlaceholder')}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="author">{t('dashboard.pages.adminBlogCreate.fieldAuthor')}</Label>
                                    <Input
                                        id="author"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        placeholder={t('dashboard.pages.adminBlogCreate.authorPlaceholder')}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="image">{t('dashboard.pages.adminBlogCreate.fieldImage')}</Label>
                                    <Input id="image" type="file" onChange={handleImageChange} accept="image/*" />
                                    {imagePreview && (
                                        <div className="mt-2">
                                            <img
                                                src={imagePreview}
                                                alt={t('dashboard.pages.adminBlogCreate.previewAlt')}
                                                className="h-40 rounded-md object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt">{t('dashboard.pages.adminBlogCreate.fieldExcerpt')}</Label>
                                <Textarea
                                    id="excerpt"
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    placeholder={t('dashboard.pages.adminBlogCreate.excerptPlaceholder')}
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">{t('dashboard.pages.adminBlogCreate.fieldContent')}</Label>
                                <RichTextEditor content={content} onChange={setContent} />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2 border-t px-6 py-4">
                            <Button type="button" variant="outline" onClick={() => router.visit('/admin/blogs')} disabled={submitting}>
                                {t('dashboard.pages.adminBlogEdit.cancel')}
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                <Save className="mr-2 h-4 w-4" />
                                {submitting ? t('dashboard.pages.adminBlogEdit.saving') : t('dashboard.pages.adminBlogEdit.save')}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AdminLayout>
    );
}
