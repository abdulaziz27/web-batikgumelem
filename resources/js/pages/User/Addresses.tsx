import { Head, Link, usePage } from '@inertiajs/react';
import { MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Address {
    id: number;
    full_name: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
    phone: string;
    is_default: boolean;
}

interface AddressesProps {
    addresses: Address[];
}

export default function Addresses({ addresses = [] }: AddressesProps) {
    const { auth, csrf_token } = usePage().props as any;
    const [open, setOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Alamat Pengiriman',
            href: '/addresses',
        },
    ];

    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setOpen(true);
    };

    const handleNew = () => {
        setEditingAddress(null);
        setOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Alamat Pengiriman" />

            <div className="space-y-6 p-6">
                <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                    <h1 className="text-2xl font-bold tracking-tight">Alamat Pengiriman</h1>
                    <Button onClick={handleNew}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Alamat Baru
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {addresses.length > 0 ? (
                        addresses.map((address) => (
                            <Card key={address.id} className={address.is_default ? 'border-primary border-2' : ''}>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base font-medium">{address.full_name}</CardTitle>
                                        {address.is_default && (
                                            <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">Utama</span>
                                        )}
                                    </div>
                                    <CardDescription>{address.phone}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-muted-foreground space-y-1 text-sm">
                                        <p>{address.address}</p>
                                        <p>
                                            {address.city}, {address.province}, {address.postal_code}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex items-center justify-end space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(address)}>
                                            <Pencil className="mr-2 h-3 w-3" />
                                            Edit
                                        </Button>
                                        {!address.is_default && (
                                            <Link
                                                href={`/addresses/${address.id}`}
                                                method="delete"
                                                as="button"
                                                className="border-input bg-background ring-offset-background hover:bg-destructive hover:text-destructive-foreground inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-medium transition-colors"
                                            >
                                                <Trash2 className="mr-2 h-3 w-3" />
                                                Hapus
                                            </Link>
                                        )}
                                        {!address.is_default && (
                                            <Link
                                                href={`/addresses/${address.id}/default`}
                                                method="post"
                                                as="button"
                                                className="border-input bg-background ring-offset-background hover:bg-accent hover:text-accent-foreground inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-medium transition-colors"
                                            >
                                                Jadikan Utama
                                            </Link>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="md:col-span-2 lg:col-span-3">
                            <Card>
                                <CardContent className="flex h-[200px] flex-col items-center justify-center">
                                    <MapPin className="text-muted-foreground h-8 w-8" />
                                    <h3 className="mt-4 text-lg font-medium">Belum ada alamat</h3>
                                    <p className="text-muted-foreground text-sm">Tambahkan alamat pengiriman untuk memudahkan proses pemesanan</p>
                                    <Button onClick={handleNew} className="mt-4">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Alamat Baru
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingAddress ? 'Edit Alamat' : 'Tambah Alamat Baru'}</DialogTitle>
                        <DialogDescription>
                            {editingAddress ? 'Ubah detail alamat pengiriman Anda.' : 'Tambahkan alamat pengiriman baru untuk memudahkan checkout.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form action={editingAddress ? `/addresses/${editingAddress.id}` : '/addresses'} method="post">
                        <input type="hidden" name="_token" value={csrf_token} />
                        {editingAddress && <input type="hidden" name="_method" value="PUT" />}
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="full_name" className="text-right">
                                    Nama Lengkap
                                </Label>
                                <Input
                                    id="full_name"
                                    name="full_name"
                                    defaultValue={editingAddress?.full_name || ''}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phone" className="text-right">
                                    No. Telepon
                                </Label>
                                <Input id="phone" name="phone" defaultValue={editingAddress?.phone || ''} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="address" className="text-right">
                                    Alamat
                                </Label>
                                <Textarea id="address" name="address" defaultValue={editingAddress?.address || ''} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="city" className="text-right">
                                    Kota
                                </Label>
                                <Input id="city" name="city" defaultValue={editingAddress?.city || ''} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="province" className="text-right">
                                    Provinsi
                                </Label>
                                <Input id="province" name="province" defaultValue={editingAddress?.province || ''} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="postal_code" className="text-right">
                                    Kode Pos
                                </Label>
                                <Input
                                    id="postal_code"
                                    name="postal_code"
                                    defaultValue={editingAddress?.postal_code || ''}
                                    className="col-span-3"
                                    required
                                />
                            </div>

                            {!editingAddress?.is_default && (
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="is_default" className="text-right">
                                        Alamat Utama
                                    </Label>
                                    <div className="col-span-3 flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="is_default"
                                            name="is_default"
                                            value="1"
                                            defaultChecked={editingAddress?.is_default || false}
                                            className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                                        />
                                        <span className="text-muted-foreground text-sm">Jadikan alamat utama</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="submit">{editingAddress ? 'Simpan Perubahan' : 'Tambah Alamat'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
