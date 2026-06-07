import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { useTranslation } from 'react-i18next';

interface ProductImage {
    id: number;
    product_id: number;
    image: string;
    image_url: string;
    is_primary: boolean;
}

interface ProductSize {
    id: number;
    product_id: number;
    size: string;
    stock: number;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    is_active: boolean;
    image?: string;
    image_url?: string;
    images: ProductImage[];
    sizes: ProductSize[];
    created_at: string;
    updated_at: string;
}

interface ShowProps {
    product: Product;
}

export default function Show({ product }: ShowProps) {
    const { t } = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('dashboard.nav.adminDashboard'),
            href: '/admin/dashboard',
        },
        {
            title: t('dashboard.nav.adminProducts'),
            href: '/admin/products',
        },
        {
            title: product.name,
            href: `/admin/products/${product.id}`,
        },
    ];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Get primary image
    const primaryImage = product.images.find((img) => img.is_primary);
    const mainImageUrl = primaryImage?.image_url || product.image_url;

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard.pages.adminProductShow.headTitleFmt', { name: product.name })} />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">{t('dashboard.pages.adminProductShow.title')}</h1>
                    <div className="flex space-x-2">
                        <Button variant="outline" asChild>
                            <Link href="/admin/products">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {t('dashboard.pages.adminProductShow.back')}
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/admin/products/${product.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                {t('dashboard.pages.adminProductShow.edit')}
                            </Link>
                        </Button>
                    </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Product Image */}
                    <div className="space-y-6 md:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('dashboard.pages.adminProductShow.mainImage')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {mainImageUrl ? (
                                    <div className="aspect-square overflow-hidden rounded-lg border">
                                        <img src={mainImageUrl} alt={product.name} className="h-full w-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="bg-muted flex aspect-square items-center justify-center rounded-lg border">
                                        <p className="text-muted-foreground">{t('dashboard.pages.adminProductShow.noImage')}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {product.images.length > 1 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('dashboard.pages.adminProductShow.allImages')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 gap-2">
                                        {product.images.map((image) => (
                                            <div
                                                key={image.id}
                                                className={`overflow-hidden rounded-md border ${image.is_primary ? 'ring-primary ring-2' : ''}`}
                                            >
                                                <img src={image.image_url} alt={product.name} className="aspect-square w-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {product.sizes.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('dashboard.pages.adminProductShow.availableSizes')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-2">
                                        {product.sizes.map((size) => (
                                            <div key={size.id} className="rounded-md border p-3">
                                                <div className="font-medium">{size.size}</div>
                                                <div className="text-muted-foreground text-sm">
                                                    {t('dashboard.pages.adminProductShow.stockFmt', { count: size.stock })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Product Information */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>{t('dashboard.pages.adminProductShow.info')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <h3 className="text-muted-foreground mb-1 text-sm font-medium">{t('dashboard.pages.adminProductShow.fieldName')}</h3>
                                    <p>{product.name}</p>
                                </div>
                                <div>
                                    <h3 className="text-muted-foreground mb-1 text-sm font-medium">{t('dashboard.pages.adminProductShow.fieldSlug')}</h3>
                                    <p className="font-mono text-sm">{product.slug}</p>
                                </div>
                                <div>
                                    <h3 className="text-muted-foreground mb-1 text-sm font-medium">{t('dashboard.pages.adminProductShow.fieldPrice')}</h3>
                                    <p>{formatPrice(product.price)}</p>
                                </div>
                                <div>
                                    <h3 className="text-muted-foreground mb-1 text-sm font-medium">{t('dashboard.pages.adminProductShow.fieldTotalStock')}</h3>
                                    <p>{product.sizes.reduce((total, size) => total + size.stock, 0)}</p>
                                </div>
                                <div>
                                    <h3 className="text-muted-foreground mb-1 text-sm font-medium">{t('dashboard.pages.adminProductShow.fieldStatus')}</h3>
                                    <Badge variant={product.is_active ? 'default' : 'outline'}>
                                        {product.is_active ? t('dashboard.pages.adminCoupons.active') : t('dashboard.pages.adminCoupons.inactive')}
                                    </Badge>
                                </div>
                                <div>
                                    <h3 className="text-muted-foreground mb-1 text-sm font-medium">{t('dashboard.pages.adminProductShow.fieldImages')}</h3>
                                    <p>{t('dashboard.pages.adminProductShow.imagesCountFmt', { count: product.images.length })}</p>
                                </div>
                                <div className="col-span-2">
                                    <h3 className="text-muted-foreground mb-1 text-sm font-medium">{t('dashboard.pages.adminProductShow.fieldDescription')}</h3>
                                    <p className="whitespace-pre-wrap">{product.description}</p>
                                </div>
                                <div>
                                    <h3 className="text-muted-foreground mb-1 text-sm font-medium">{t('dashboard.pages.adminProductShow.createdAt')}</h3>
                                    <p>{formatDate(product.created_at)}</p>
                                </div>
                                <div>
                                    <h3 className="text-muted-foreground mb-1 text-sm font-medium">{t('dashboard.pages.adminProductShow.updatedAt')}</h3>
                                    <p>{formatDate(product.updated_at)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
