import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Minus, Plus, Save, Star, Upload, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';

interface ProductImage {
    id?: number;
    product_id?: number;
    image: string;
    is_primary: boolean;
    image_url?: string;
}

interface ProductSize {
    id?: number;
    product_id?: number;
    size: string;
    stock: number;
}

interface Product {
    id?: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    is_active: boolean;
    image?: string;
    image_url?: string;
    images?: ProductImage[];
    sizes?: ProductSize[];
}

interface ProductFormProps {
    product?: Product;
    isEdit?: boolean;
}

// Define form data shape that works with Inertia's useForm
type ProductFormData = {
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    is_active: boolean;
    sizes: Array<{ size: string; stock: number; id?: number }>;
    deleted_image_ids: number[];
    primary_image_id: number | null;
    new_images: File[];
    [key: string]: any; // Add index signature to satisfy useForm constraint
};

interface ImagePreview {
    id?: number;
    url: string;
    is_primary: boolean;
    is_new?: boolean;
    file?: File;
}

interface UseFormOptions {
    forceFormData?: boolean;
    preserveScroll?: boolean;
    preserveState?: boolean;
    transform?: (data: any) => any;
}

export default function ProductForm({ product, isEdit = false }: ProductFormProps) {
    // Set up initial image previews from existing images
    const initialPreviews: ImagePreview[] =
        product?.images?.map((img) => ({
            id: img.id,
            url: img.image_url || `/storage/${img.image}`,
            is_primary: img.is_primary,
            is_new: false,
        })) || [];

    const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>(initialPreviews);
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
    const [primaryImageId, setPrimaryImageId] = useState<number | null>(product?.images?.find((img) => img.is_primary)?.id || null);

    const [formData, setFormData] = useState<ProductFormData>({
        name: product?.name || '',
        slug: product?.slug || '',
        description: product?.description || '',
        price: product?.price || 0,
        stock: product?.stock || 0,
        is_active: product?.is_active ?? true,
        sizes: product?.sizes?.map((s) => ({
            id: s.id,
            size: s.size,
            stock: s.stock,
        })) || [{ size: '', stock: 0 }],
        deleted_image_ids: [],
        primary_image_id: primaryImageId,
        new_images: [],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const formOptions: UseFormOptions = {
        forceFormData: true,
        preserveScroll: true,
        preserveState: true,
        transform: (formData: ProductFormData) => {
            const form = new FormData();

            // Add basic fields
            form.append('name', formData.name);
            form.append('slug', formData.slug);
            form.append('description', formData.description);
            form.append('price', formData.price.toString());
            form.append('stock', formData.stock.toString());
            form.append('is_active', formData.is_active ? '1' : '0');

            // Add sizes
            formData.sizes.forEach((size: { id?: number; size: string; stock: number }, index: number) => {
                if (size.id) {
                    form.append(`sizes[${index}][id]`, size.id.toString());
                }
                form.append(`sizes[${index}][size]`, size.size);
                form.append(`sizes[${index}][stock]`, size.stock.toString());
            });

            // Add deleted image IDs
            deletedImageIds.forEach((id: number, index: number) => {
                form.append(`deleted_image_ids[${index}]`, id.toString());
            });

            // Add primary image ID if exists
            if (primaryImageId !== null) {
                form.append('primary_image_id', primaryImageId.toString());
            }

            // Add new images
            const newFiles = imagePreviews.filter((preview) => preview.is_new && preview.file).map((preview) => preview.file!);

            newFiles.forEach((file: File, index: number) => {
                form.append(`new_images[${index}]`, file);
            });

            return form;
        },
    };

    // Sync deleted image IDs and primary image ID with form data
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            deleted_image_ids: deletedImageIds,
        }));
    }, [deletedImageIds]);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            primary_image_id: primaryImageId,
        }));
    }, [primaryImageId]);

    // Sync new images with form data
    useEffect(() => {
        const newFiles = imagePreviews.filter((preview) => preview.is_new && preview.file).map((preview) => preview.file!);
        setFormData((prev) => ({
            ...prev,
            new_images: newFiles,
        }));
    }, [imagePreviews]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dasbor',
            href: '/admin/dashboard',
        },
        {
            title: 'Produk',
            href: '/admin/products',
        },
        {
            title: isEdit ? 'Edit Produk' : 'Tambah Produk',
            href: isEdit ? `/admin/products/${product?.id}/edit` : '/admin/products/create',
        },
    ];

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newFilesArray = Array.from(files);

        // Create new previews for the uploaded files
        const newPreviews: ImagePreview[] = [];

        newFilesArray.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    const newPreview: ImagePreview = {
                        url: event.target.result as string,
                        is_primary: imagePreviews.length === 0 && newPreviews.length === 0,
                        is_new: true,
                        file: file,
                    };

                    setImagePreviews((prev) => [...prev, newPreview]);
                }
            };
            reader.readAsDataURL(file);
        });

        // Reset the input value so the same file can be selected again
        e.target.value = '';
    };

    const handleDeleteImage = (index: number) => {
        const imageToDelete = imagePreviews[index];

        if (imageToDelete.id && !imageToDelete.is_new) {
            // It's an existing image, add to deletion list
            setDeletedImageIds((prev) => [...prev, imageToDelete.id!]);

            // If it was the primary image, reset primary image
            if (primaryImageId === imageToDelete.id) {
                setPrimaryImageId(null);
            }
        }

        // Remove from previews
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSetPrimary = (index: number) => {
        const selectedImage = imagePreviews[index];

        // Update previews to show which one is primary
        setImagePreviews((prev) =>
            prev.map((img, i) => ({
                ...img,
                is_primary: i === index,
            })),
        );

        // Set the primary image ID (null for new images)
        if (selectedImage.id && !selectedImage.is_new) {
            setPrimaryImageId(selectedImage.id);
        } else {
            setPrimaryImageId(null);
        }
    };

    const handleGenerateSlug = () => {
        if (typeof formData.name === 'string') {
            const slug = formData.name
                .toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');

            setFormData((prev) => ({
                ...prev,
                slug,
            }));
        }
    };

    const addSizeField = () => {
        setFormData((prev) => ({
            ...prev,
            sizes: [...prev.sizes, { size: '', stock: 0 }],
        }));
    };

    const removeSizeField = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            sizes: prev.sizes.filter((_, i: number) => i !== index),
        }));
    };

    const updateSizeField = (index: number, field: 'size' | 'stock', value: string | number) => {
        setFormData((prev) => {
            const updatedSizes = [...prev.sizes];
            updatedSizes[index] = { ...updatedSizes[index], [field]: value };
            return {
                ...prev,
                sizes: updatedSizes,
            };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        // Create FormData instance
        const form = new FormData();

        // Add basic fields
        form.append('name', formData.name);
        form.append('slug', formData.slug);
        form.append('description', formData.description);
        form.append('price', formData.price.toString());
        form.append('stock', formData.stock.toString());
        form.append('is_active', formData.is_active ? '1' : '0');

        // Add sizes
        formData.sizes.forEach((size: { id?: number; size: string; stock: number }, index: number) => {
            if (size.id) {
                form.append(`sizes[${index}][id]`, size.id.toString());
            }
            form.append(`sizes[${index}][size]`, size.size);
            form.append(`sizes[${index}][stock]`, size.stock.toString());
        });

        // Add deleted image IDs
        deletedImageIds.forEach((id: number, index: number) => {
            form.append(`deleted_image_ids[${index}]`, id.toString());
        });

        // Add primary image ID if exists
        if (primaryImageId !== null) {
            form.append('primary_image_id', primaryImageId.toString());
        }

        // Add new images
        const newFiles = imagePreviews.filter((preview) => preview.is_new && preview.file).map((preview) => preview.file!);

        newFiles.forEach((file: File, index: number) => {
            form.append(`new_images[${index}]`, file);
        });

        const options = {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setProcessing(false);
                setErrors({});
            },
            onError: (errors: Record<string, string>) => {
                setProcessing(false);
                setErrors(errors);
            },
        };

        if (isEdit && product?.id) {
            form.append('_method', 'PUT');
            router.post(`/admin/products/${product.id}`, form, options);
        } else {
            router.post('/admin/products', form, options);
        }
    };

    const handleInputChange = (field: keyof ProductFormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Produk' : 'Tambah Produk'} />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">{isEdit ? 'Edit Produk' : 'Tambah Produk'}</h1>
                    <div className="flex space-x-2">
                        <Button variant="outline" asChild>
                            <Link href="/admin/products">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Produk
                            </Link>
                        </Button>
                        <Button type="submit" form="product-form">
                            <Save className="mr-2 h-4 w-4" />
                            Simpan Produk
                        </Button>
                    </div>
                </div>

                <Separator />

                <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Dasar</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Produk</Label>
                                    <div className="space-y-1">
                                        <Input
                                            id="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <div className="space-y-1">
                                        <div className="flex gap-2">
                                            <Input
                                                id="slug"
                                                type="text"
                                                value={formData.slug}
                                                onChange={(e) => handleInputChange('slug', e.target.value)}
                                            />
                                            <Button type="button" variant="outline" onClick={handleGenerateSlug}>
                                                Generate
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">Harga</Label>
                                    <div className="space-y-1">
                                        <Input
                                            id="price"
                                            type="number"
                                            min="0"
                                            value={formData.price}
                                            onChange={(e) => handleInputChange('price', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stok</Label>
                                    <div className="space-y-1">
                                        <Input
                                            id="stock"
                                            type="number"
                                            min="0"
                                            value={formData.stock}
                                            onChange={(e) => handleInputChange('stock', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <div className="space-y-1">
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        rows={5}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                                />
                                <Label htmlFor="is_active">Produk Aktif</Label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Gambar Produk</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-center">
                                <Label
                                    htmlFor="images"
                                    className="border-border hover:bg-muted flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed transition-colors"
                                >
                                    <Upload className="h-8 w-8" />
                                    <span className="text-muted-foreground text-sm">Klik untuk mengunggah gambar</span>
                                    <span className="text-muted-foreground text-xs">PNG, JPG atau JPEG (maks. 2MB)</span>
                                </Label>
                                <Input
                                    id="images"
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    multiple
                                    className="hidden"
                                    onChange={handleImagesChange}
                                />
                            </div>

                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div
                                            key={index}
                                            className={`group relative aspect-square overflow-hidden rounded-lg border ${
                                                preview.is_primary ? 'ring-primary ring-2' : ''
                                            }`}
                                        >
                                            <img src={preview.url} alt="" className="h-full w-full object-cover" />
                                            <div className="bg-background/80 absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="icon"
                                                    onClick={() => handleSetPrimary(index)}
                                                    disabled={preview.is_primary}
                                                >
                                                    <Star className={preview.is_primary ? 'fill-primary' : ''} />
                                                </Button>
                                                <Button type="button" variant="destructive" size="icon" onClick={() => handleDeleteImage(index)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle>Ukuran yang Tersedia</CardTitle>
                            <Button type="button" variant="outline" size="sm" onClick={addSizeField}>
                                <Plus className="mr-1 h-4 w-4" />
                                Tambah Ukuran
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.sizes.map((size, index) => (
                                <div key={index} className="flex items-end gap-4">
                                    <div className="flex-1 space-y-2">
                                        <Label htmlFor={`size-${index}`}>Ukuran</Label>
                                        <Input
                                            id={`size-${index}`}
                                            type="text"
                                            value={size.size}
                                            onChange={(e) => updateSizeField(index, 'size', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <Label htmlFor={`stock-${index}`}>Stok</Label>
                                        <Input
                                            id={`stock-${index}`}
                                            type="number"
                                            min="0"
                                            value={size.stock}
                                            onChange={(e) => updateSizeField(index, 'stock', e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => removeSizeField(index)}
                                        disabled={formData.sizes.length === 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}
