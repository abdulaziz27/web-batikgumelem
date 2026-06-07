import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';
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

interface BlogsShowProps {
    blog: Blog;
}

export default function BlogsShow({ blog }: BlogsShowProps) {
    const { t } = useTranslation();
    // Format date helper
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

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
            title: blog.title,
            href: `/admin/blogs/${blog.id}`,
        },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard.pages.adminBlogShow.headTitleFmt', { title: blog.title })} />

            <div className="space-y-6 p-3 sm:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <h1 className="text-2xl font-bold tracking-tight">{t('dashboard.pages.adminBlogShow.title')}</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/admin/blogs">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {t('dashboard.pages.adminBlogShow.backToList')}
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/admin/blogs/${blog.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                {t('dashboard.pages.adminBlogShow.edit')}
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <CardTitle className="text-2xl">{blog.title}</CardTitle>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <Badge variant="outline">{blog.category}</Badge>
                                    <span className="text-muted-foreground text-sm">
                                        {t('dashboard.pages.adminBlogShow.byFmt', { author: blog.author, date: formatDate(blog.created_at) })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {blog.image && (
                            <div className="mb-6">
                                <img src={`/storage/${blog.image}`} alt={blog.title} className="max-h-80 w-full rounded-md object-cover" />
                            </div>
                        )}

                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">{t('dashboard.pages.adminBlogShow.excerpt')}</h3>
                            <p className="text-muted-foreground italic">{blog.excerpt}</p>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">{t('dashboard.pages.adminBlogShow.content')}</h3>
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-muted-foreground text-sm">{t('dashboard.pages.adminBlogShow.createdAt')}</p>
                                <p>{formatDate(blog.created_at)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">{t('dashboard.pages.adminBlogShow.updatedAt')}</p>
                                <p>{formatDate(blog.updated_at)}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t px-6 py-4">
                        <Button variant="outline" asChild>
                            <Link href={`/admin/blogs/${blog.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                {t('dashboard.pages.adminBlogShow.edit')}
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </AdminLayout>
    );
}
