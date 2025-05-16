import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Minus, Plus, Save, Upload, X } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function ProductForm({ product, isEdit = false }: ProductFormProps) {
    // Set up initial image previews from existing images
    const initialPreviews =
        product?.images?.map((img) => ({
            id: img.id,
            url: `/storage/${img.image}`,
            is_primary: img.is_primary,
        })) || [];

    const [imagePreviews, setImagePreviews] = useState<Array<{ id?: number; url: string; is_primary: boolean }>>(initialPreviews);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
    const [primaryImageId, setPrimaryImageId] = useState<number | null>(product?.images?.find((img) => img.is_primary)?.id || null);

    // Initialize form with proper typings
    const { data, setData, errors, processing, post, put } = useForm<ProductFormData>({
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

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Products',
            href: '/admin/products',
        },
        {
            title: isEdit ? 'Edit Product' : 'Create Product',
            href: isEdit ? `/admin/products/${product?.id}/edit` : '/admin/products/create',
        },
    ];

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newFilesArray = Array.from(files);
        setNewImages([...newImages, ...newFilesArray]);

        // Create image previews
        newFilesArray.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setImagePreviews((prev) => [
                        ...prev,
                        {
                            url: event.target!.result as string,
                            is_primary: imagePreviews.length === 0 && prev.length === 0,
                        },
                    ]);
                }
            };
            reader.readAsDataURL(file);
        });

        setData('new_images', [...newImages, ...newFilesArray]);
    };

    const handleDeleteImage = (index: number, id?: number) => {
        if (id) {
            // For existing images
            setDeletedImageIds([...deletedImageIds, id]);
            setData('deleted_image_ids', [...deletedImageIds, id]);

            if (primaryImageId === id) {
                setPrimaryImageId(null);
                setData('primary_image_id', null);
            }
        }

        // Remove from previews
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));

        // Remove from newImages if it's a new image
        if (!id && index >= (initialPreviews.length || 0)) {
            const newIndex = index - (initialPreviews.length || 0);
            const updatedNewImages = [...newImages];
            updatedNewImages.splice(newIndex, 1);
            setNewImages(updatedNewImages);
            setData('new_images', updatedNewImages);
        }
    };

    const handleSetPrimary = (index: number, id?: number) => {
        setImagePreviews(
            imagePreviews.map((img, i) => ({
                ...img,
                is_primary: i === index,
            })),
        );

        if (id) {
            setPrimaryImageId(id);
            setData('primary_image_id', id);
        } else {
            setPrimaryImageId(null);
        }
    };

    const handleGenerateSlug = () => {
        if (typeof data.name === 'string') {
            const slug = data.name
                .toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');

            setData('slug', slug);
        }
    };

    const addSizeField = () => {
        setData('sizes', [...data.sizes, { size: '', stock: 0 }]);
    };

    const removeSizeField = (index: number) => {
        setData(
            'sizes',
            data.sizes.filter((_, i: number) => i !== index),
        );
    };

    const updateSizeField = (index: number, field: 'size' | 'stock', value: string | number) => {
        const updatedSizes = [...data.sizes];
        updatedSizes[index] = { ...updatedSizes[index], [field]: value };
        setData('sizes', updatedSizes);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && product?.id) {
            put(`/admin/products/${product.id}`);
        } else {
            post('/admin/products');
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Product' : 'Create Product'} />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">{isEdit ? 'Edit Product' : 'Create Product'}</h1>
                    <Button variant="outline" asChild>
                        <Link href="/admin/products">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Products
                        </Link>
                    </Button>
                </div>

                <Separator />

                <form onSubmit={handleSubmit} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        onBlur={handleGenerateSlug}
                                        placeholder="Product Name"
                                    />
                                    {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} placeholder="product-slug" />
                                    {errors.slug && <p className="text-destructive text-sm">{errors.slug}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (IDR)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={data.price}
                                        onChange={(e) => setData('price', Number(e.target.value))}
                                        placeholder="0"
                                        min="0"
                                    />
                                    {errors.price && <p className="text-destructive text-sm">{errors.price}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        value={data.stock}
                                        onChange={(e) => setData('stock', Number(e.target.value))}
                                        placeholder="0"
                                        min="0"
                                    />
                                    {errors.stock && <p className="text-destructive text-sm">{errors.stock}</p>}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked: boolean) => setData('is_active', checked)}
                                    />
                                    <Label htmlFor="is_active">Active</Label>
                                    {errors.is_active && <p className="text-destructive text-sm">{errors.is_active}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={5}
                                    placeholder="Product description..."
                                />
                                {errors.description && <p className="text-destructive text-sm">{errors.description}</p>}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Product Images</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('images')?.click()}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Add Images
                                    </Button>
                                    <Input id="images" type="file" multiple className="hidden" accept="image/*" onChange={handleImagesChange} />
                                </div>

                                {errors.new_images && <p className="text-destructive text-sm">{errors.new_images}</p>}

                                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div
                                            key={index}
                                            className={`relative aspect-square overflow-hidden rounded-md border ${
                                                preview.is_primary ? 'ring-primary ring-2' : ''
                                            }`}
                                        >
                                            <img src={preview.url} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                                                <div className="absolute right-2 bottom-2 left-2 flex justify-between">
                                                    <Button
                                                        type="button"
                                                        variant={preview.is_primary ? 'default' : 'secondary'}
                                                        size="sm"
                                                        onClick={() => handleSetPrimary(index, preview.id)}
                                                        disabled={preview.is_primary}
                                                    >
                                                        {preview.is_primary ? 'Primary' : 'Set Primary'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => handleDeleteImage(index, preview.id)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Product Sizes</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addSizeField}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Size
                                    </Button>
                                </div>

                                {data.sizes.map((size, index) => (
                                    <div key={index} className="grid grid-cols-12 items-center gap-4">
                                        <div className="col-span-5 space-y-2">
                                            <Label htmlFor={`size-${index}`}>Size</Label>
                                            <Input
                                                id={`size-${index}`}
                                                value={size.size}
                                                onChange={(e) => updateSizeField(index, 'size', e.target.value)}
                                                placeholder="XL, L, M, S, etc."
                                            />
                                        </div>
                                        <div className="col-span-5 space-y-2">
                                            <Label htmlFor={`stock-${index}`}>Stock</Label>
                                            <Input
                                                id={`stock-${index}`}
                                                type="number"
                                                value={size.stock}
                                                onChange={(e) => updateSizeField(index, 'stock', Number(e.target.value))}
                                                placeholder="0"
                                                min="0"
                                            />
                                        </div>
                                        <div className="col-span-2 pt-6">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeSizeField(index)}
                                                disabled={data.sizes.length === 1}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {errors.sizes && <p className="text-destructive text-sm">{errors.sizes}</p>}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" type="button" asChild>
                                <Link href="/admin/products">Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2 h-4 w-4" />
                                {isEdit ? 'Update Product' : 'Create Product'}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AdminLayout>
    );
}
