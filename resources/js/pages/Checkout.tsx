import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import { useCoupon } from '@/hooks/useCoupon';
import { useShipping, type ShippingAddress, type ShippingOption } from '@/hooks/useShipping';
import { formatRupiah } from '@/utils/formatters';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { Check, CreditCard, Loader2, Package, Truck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Define validation schema for shipping details
const shippingFormSchema = z.object({
    fullName: z.string().min(3, { message: 'Nama lengkap harus diisi' }),
    address: z.string().min(5, { message: 'Alamat harus diisi' }),
    city: z.string().min(3, { message: 'Kota harus diisi' }),
    postalCode: z.string().min(5, { message: 'Kode pos harus diisi' }),
    province: z.string().min(3, { message: 'Provinsi harus diisi' }),
    phone: z.string().min(10, { message: 'Nomor telepon harus diisi dengan benar' }),
    email: z.string().email({ message: 'Format email tidak valid' }).optional(),
});

// Define schema for address selection
const addressSelectionSchema = z.object({
    addressType: z.enum(['new', 'saved']),
    savedAddressId: z.number().optional(),
    saveAddress: z.boolean().optional(),
    setAsDefault: z.boolean().optional(),
});

// Define payment method validation schema
const paymentFormSchema = z.object({
    paymentMethod: z.enum(['bank_transfer', 'e_wallet'], {
        required_error: 'Pilih metode pembayaran',
    }),
});

// Create a step type
type CheckoutStep = 'shipping' | 'delivery' | 'payment' | 'review';

// Add interface for saved address
interface SavedAddress {
    id: number;
    full_name: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
    phone: string;
    is_default: boolean;
}

// Add interface for props
interface CheckoutProps {
    cart: any; // Replace with proper cart type
    coupon: any; // Replace with proper coupon type
    shippingOptions: ShippingOption[] | null;
    savedAddresses: SavedAddress[] | null;
    auth: {
        check: boolean;
        user?: any;
    };
}

// Error boundary class component
class CheckoutErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: any; errorInfo: any }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }
    static getDerivedStateFromError(error: any) {
        return { error, errorInfo: null };
    }
    componentDidCatch(error: any, errorInfo: any) {
        this.setState({ error, errorInfo });
    }
    render() {
        if (this.state.error) {
            return (
                <Layout>
                    <div style={{ color: 'red', padding: 24 }}>
                        <h2>Terjadi error di Checkout:</h2>
                        <pre>{this.state.error?.toString()}</pre>
                        <pre>{this.state.errorInfo?.componentStack}</pre>
                        <pre>{this.state.error?.stack}</pre>
                    </div>
                </Layout>
            );
        }
        return this.props.children;
    }
}

// Wrapper component yang menangkap error useCart dan menampilkan UI Checkout
const CheckoutContent = ({ cart, coupon, shippingOptions: initialShippingOptions, savedAddresses, auth }: CheckoutProps) => {
    const [error, setError] = useState<Error | null>(null);

    // Semua hooks di level teratas
    const { cartItems, totalPrice, clearCart } = useCart();
    const { activeCoupon, applyCoupon, removeCoupon, discountAmount, isLoading: isCouponLoading } = useCoupon();
    const { shippingAddress, setShippingAddress, calculateShipping, selectShipping, selectedShipping, isCalculatingShipping } = useShipping();

    const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
    const [couponCode, setCouponCode] = useState('');
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);
    const [addressType, setAddressType] = useState<'new' | 'saved'>(savedAddresses?.length ? 'saved' : 'new');
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
        savedAddresses?.find((addr) => addr.is_default)?.id || savedAddresses?.[0]?.id || null,
    );
    const [saveNewAddress, setSaveNewAddress] = useState(false);
    const [setAsDefault, setSetAsDefault] = useState(false);
    const [localShippingOptions, setLocalShippingOptions] = useState<ShippingOption[]>(initialShippingOptions || []);

    // Create form for shipping details
    const shippingForm = useForm<z.infer<typeof shippingFormSchema>>({
        resolver: zodResolver(shippingFormSchema),
        defaultValues: shippingAddress || {
            fullName: '',
            address: '',
            city: '',
            postalCode: '',
            province: '',
            phone: '',
        },
    });

    // Create form for payment method
    const paymentForm = useForm<z.infer<typeof paymentFormSchema>>({
        resolver: zodResolver(paymentFormSchema),
        defaultValues: {
            paymentMethod: 'bank_transfer',
        },
    });

    useEffect(() => {
        if (initialShippingOptions) {
            console.log('Updating local shipping options:', initialShippingOptions);
            setLocalShippingOptions(initialShippingOptions);
        }
    }, [initialShippingOptions]);

    useEffect(() => {
        if (activeCoupon) {
            setCouponCode(activeCoupon.code);
        } else {
            setCouponCode('');
        }
    }, [activeCoupon]);

    // Setelah semua hooks, baru pengecekan kondisi
    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    <Package className="mx-auto h-16 w-16 text-gray-400" />
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Keranjang Belanja Kosong</h2>
                    <p className="mt-4 text-gray-500">Anda belum menambahkan produk apapun ke keranjang belanja.</p>
                    <div className="mt-6">
                        <Button asChild className="bg-batik-indigo hover:bg-batik-indigo/90">
                            <a href="/products">Lihat Produk</a>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Compute order summary
    const subtotal = totalPrice;
    const discount = discountAmount(subtotal);
    const shippingCost = selectedShipping ? selectedShipping.price : 0;
    const total = subtotal - discount + shippingCost;

    // Handler for applying coupon
    const handleApplyCoupon = () => {
        if (!couponCode) {
            toast('Kode kupon tidak boleh kosong', {
                description: 'Silakan masukkan kode kupon',
            });
            return;
        }

        applyCoupon(couponCode);
    };

    // Handler for shipping form submission
    const onShippingSubmit = (data: z.infer<typeof shippingFormSchema>) => {
        // Explicitly ensure all required fields are present in the right format
        const shippingData: ShippingAddress = {
            fullName: data.fullName,
            address: data.address,
            city: data.city,
            postalCode: data.postalCode,
            province: data.province,
            phone: data.phone,
        };

        setShippingAddress(shippingData);
        setCurrentStep('delivery');
    };

    // Handler for calculating shipping options
    const handleCalculateShipping = () => {
        if (!shippingAddress) return;

        calculateShipping(shippingAddress.city, shippingAddress.postalCode);
    };

    // Handler for selecting shipping method
    const handleSelectShipping = (option: ShippingOption) => {
        selectShipping(option);
        setCurrentStep('payment');
    };

    // Handler for payment form submission
    const onPaymentSubmit = (data: z.infer<typeof paymentFormSchema>) => {
        // Process payment method selection
        console.log('Payment method selected:', data.paymentMethod);
        setCurrentStep('review');
    };

    // Handler for placing order
    const handlePlaceOrder = () => {
        if (!selectedShipping || !shippingAddress) {
            // toast('Informasi tidak lengkap', {
            //     description: 'Silakan lengkapi semua informasi pengiriman dan pembayaran',
            // });
            return;
        }
        setIsProcessingOrder(true);
        const orderData = {
            shipping_address: {
                full_name: shippingAddress.fullName,
                address: shippingAddress.address,
                city: shippingAddress.city,
                province: shippingAddress.province,
                postal_code: shippingAddress.postalCode,
                phone: shippingAddress.phone,
            },
            shipping_method: {
                id: selectedShipping.type,
                company: selectedShipping.courier_name,
                name: selectedShipping.courier_service_name,
                price: selectedShipping.price,
            },
            payment_method: paymentForm.getValues('paymentMethod'),
            ...(activeCoupon?.id ? { coupon_id: activeCoupon.id } : {}),
            ...(shippingAddress.email ? { email: shippingAddress.email } : {}),
            notes: '',
            ...(addressType === 'saved' && selectedAddressId ? { saved_address_id: selectedAddressId } : {}),
            ...(addressType === 'new' && !auth?.check ? { save_address: saveNewAddress, set_as_default: setAsDefault } : {}),
        };
        router.post('/checkout', orderData, {
            onSuccess: () => {
                // Cart akan otomatis kosong setelah backend proses order
            },
            onError: (errors) => {
                // toast.error('Gagal membuat pesanan', {
                //     description: errors.message || 'Terjadi kesalahan saat membuat pesanan',
                // });
            },
            onFinish: () => {
                setIsProcessingOrder(false);
            },
        });
    };

    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12">
                {/* Checkout steps */}
                <div className="lg:col-span-8">
                    <div className="mb-10">
                        <h1 className="text-batik-brown text-2xl font-bold tracking-tight">Checkout</h1>
                        <div className="mt-4">
                            <nav className="flex items-center justify-between">
                                <ol className="flex w-full items-center justify-between">
                                    <li
                                        className={`flex items-center ${currentStep === 'shipping' ? 'text-batik-indigo font-medium' : 'text-gray-500'}`}
                                    >
                                        <span
                                            className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep === 'shipping' ? 'bg-batik-indigo text-white' : 'bg-gray-100'}`}
                                        >
                                            1
                                        </span>
                                        <span className="ml-2 hidden sm:inline">Pengiriman</span>
                                    </li>
                                    <div className="mx-2 h-0.5 w-full flex-1 bg-gray-200"></div>
                                    <li
                                        className={`flex items-center ${currentStep === 'delivery' ? 'text-batik-indigo font-medium' : 'text-gray-500'}`}
                                    >
                                        <span
                                            className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep === 'delivery' ? 'bg-batik-indigo text-white' : currentStep === 'payment' || currentStep === 'review' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
                                        >
                                            {currentStep === 'payment' || currentStep === 'review' ? <Check className="h-4 w-4" /> : '2'}
                                        </span>
                                        <span className="ml-2 hidden sm:inline">Pengiriman</span>
                                    </li>
                                    <div className="mx-2 h-0.5 w-full flex-1 bg-gray-200"></div>
                                    <li
                                        className={`flex items-center ${currentStep === 'payment' ? 'text-batik-indigo font-medium' : 'text-gray-500'}`}
                                    >
                                        <span
                                            className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep === 'payment' ? 'bg-batik-indigo text-white' : currentStep === 'review' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
                                        >
                                            {currentStep === 'review' ? <Check className="h-4 w-4" /> : '3'}
                                        </span>
                                        <span className="ml-2 hidden sm:inline">Pembayaran</span>
                                    </li>
                                    <div className="mx-2 h-0.5 w-full flex-1 bg-gray-200"></div>
                                    <li
                                        className={`flex items-center ${currentStep === 'review' ? 'text-batik-indigo font-medium' : 'text-gray-500'}`}
                                    >
                                        <span
                                            className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep === 'review' ? 'bg-batik-indigo text-white' : 'bg-gray-100'}`}
                                        >
                                            4
                                        </span>
                                        <span className="ml-2 hidden sm:inline">Konfirmasi</span>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>

                    {/* Shipping Information */}
                    {currentStep === 'shipping' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Package className="mr-2 h-5 w-5" />
                                    Informasi Pengiriman
                                </CardTitle>
                                <CardDescription>Masukkan alamat pengiriman untuk pesanan Anda</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {savedAddresses && savedAddresses.length > 0 && (
                                    <div className="mb-6">
                                        <div className="mb-4">
                                            <Label className="text-base font-semibold">Pilih Alamat</Label>
                                            <RadioGroup
                                                value={addressType}
                                                onValueChange={(value) => setAddressType(value as 'new' | 'saved')}
                                                className="mt-2"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="saved" id="saved-address" />
                                                    <Label htmlFor="saved-address" className="font-normal">
                                                        Gunakan alamat tersimpan
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="new" id="new-address" />
                                                    <Label htmlFor="new-address" className="font-normal">
                                                        Gunakan alamat baru
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </div>

                                        {addressType === 'saved' && (
                                            <div className="mt-4 space-y-4">
                                                <Label className="block text-sm font-medium">Pilih alamat pengiriman</Label>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    {savedAddresses.map((address) => (
                                                        <div
                                                            key={address.id}
                                                            className={`cursor-pointer rounded-lg border p-4 transition-colors ${selectedAddressId === address.id ? 'border-batik-indigo bg-batik-indigo/5' : 'border-gray-200 hover:border-gray-300'}`}
                                                            onClick={() => setSelectedAddressId(address.id)}
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <h3 className="font-medium">{address.full_name}</h3>
                                                                    <p className="mt-1 text-sm text-gray-500">{address.phone}</p>
                                                                </div>
                                                                {address.is_default && (
                                                                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                                                                        Default
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="mt-2 text-sm text-gray-700">
                                                                {address.address}, {address.city}, {address.province}, {address.postal_code}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-6 flex justify-end">
                                                    <Button
                                                        type="button"
                                                        disabled={!selectedAddressId}
                                                        onClick={() => {
                                                            // Find the selected address
                                                            const address = savedAddresses.find((a) => a.id === selectedAddressId);
                                                            if (address) {
                                                                // Map to the shipping address format
                                                                const shippingData: ShippingAddress = {
                                                                    fullName: address.full_name,
                                                                    address: address.address,
                                                                    city: address.city,
                                                                    province: address.province,
                                                                    postalCode: address.postal_code,
                                                                    phone: address.phone,
                                                                };
                                                                setShippingAddress(shippingData);
                                                                setCurrentStep('delivery');
                                                            }
                                                        }}
                                                        className="bg-batik-indigo hover:bg-batik-indigo/90"
                                                    >
                                                        Lanjutkan
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {(addressType === 'new' || !savedAddresses || savedAddresses.length === 0) && (
                                    <Form {...shippingForm}>
                                        <form onSubmit={shippingForm.handleSubmit(onShippingSubmit)} className="space-y-6">
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <FormField
                                                    control={shippingForm.control}
                                                    name="fullName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Nama Lengkap</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Masukkan nama lengkap" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={shippingForm.control}
                                                    name="phone"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Nomor Telepon</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="contoh: 081234567890" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                {/* Add email field for guest users */}
                                                {!auth?.check && (
                                                    <FormField
                                                        control={shippingForm.control}
                                                        name="email"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Email</FormLabel>
                                                                <FormControl>
                                                                    <Input type="email" placeholder="Masukkan alamat email" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                )}
                                                <div className={`${!auth?.check ? '' : 'sm:col-span-2'}`}>
                                                    <FormField
                                                        control={shippingForm.control}
                                                        name="address"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Alamat</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Masukkan alamat lengkap" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <FormField
                                                    control={shippingForm.control}
                                                    name="city"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Kota</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Masukkan nama kota" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={shippingForm.control}
                                                    name="province"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Provinsi</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Masukkan nama provinsi" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={shippingForm.control}
                                                    name="postalCode"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Kode Pos</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="contoh: 12345" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Save address options */}
                                            {savedAddresses && (
                                                <div className="mt-4 space-y-2">
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            id="save-address"
                                                            checked={saveNewAddress}
                                                            onChange={(e) => setSaveNewAddress(e.target.checked)}
                                                            className="text-batik-indigo focus:ring-batik-indigo h-4 w-4 rounded border-gray-300"
                                                        />
                                                        <Label htmlFor="save-address" className="text-sm leading-none font-medium">
                                                            Simpan alamat ini untuk pembelian selanjutnya
                                                        </Label>
                                                    </div>

                                                    {saveNewAddress && (
                                                        <div className="ml-6 flex items-center space-x-2">
                                                            <input
                                                                type="checkbox"
                                                                id="set-default"
                                                                checked={setAsDefault}
                                                                onChange={(e) => setSetAsDefault(e.target.checked)}
                                                                className="text-batik-indigo focus:ring-batik-indigo h-4 w-4 rounded border-gray-300"
                                                            />
                                                            <Label htmlFor="set-default" className="text-sm leading-none font-medium">
                                                                Jadikan sebagai alamat utama
                                                            </Label>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex justify-end">
                                                <Button type="submit" className="bg-batik-indigo hover:bg-batik-indigo/90">
                                                    Lanjutkan
                                                </Button>
                                            </div>
                                        </form>
                                    </Form>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Delivery Options */}
                    {currentStep === 'delivery' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Truck className="mr-2 h-5 w-5" />
                                    Opsi Pengiriman
                                </CardTitle>
                                <CardDescription>Pilih metode pengiriman yang Anda inginkan</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {localShippingOptions.length === 0 ? (
                                    <div className="py-6 text-center">
                                        <Button
                                            onClick={handleCalculateShipping}
                                            disabled={isCalculatingShipping}
                                            className="bg-batik-indigo hover:bg-batik-indigo/90"
                                        >
                                            {isCalculatingShipping ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Menghitung...
                                                </>
                                            ) : (
                                                'Hitung Ongkos Kirim'
                                            )}
                                        </Button>
                                        <p className="mt-2 text-sm text-gray-500">Klik tombol di atas untuk menghitung ongkos kirim ke alamat Anda</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {localShippingOptions.map((option) => {
                                            const isSelected =
                                                selectedShipping &&
                                                selectedShipping.courier_code === option.courier_code &&
                                                selectedShipping.courier_service_code === option.courier_service_code;

                                            return (
                                                <div
                                                    key={`${option.courier_code}-${option.courier_service_code}`}
                                                    className={`hover:border-batik-indigo/50 flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${isSelected ? 'border-batik-indigo bg-batik-indigo/5' : 'border-gray-200'}`}
                                                    onClick={() => handleSelectShipping(option)}
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div
                                                            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${isSelected ? 'border-batik-indigo' : 'border-gray-300'}`}
                                                        >
                                                            {isSelected && <div className="bg-batik-indigo h-3 w-3 rounded-full"></div>}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="font-medium">
                                                                {option.courier_name} - {option.courier_service_name}
                                                            </p>
                                                            <div className="text-sm text-gray-500">
                                                                <p>{option.description}</p>
                                                                <p>Estimasi: {option.duration}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-batik-indigo font-medium">{formatRupiah(option.price)}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Payment Method */}
                    {currentStep === 'payment' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <CreditCard className="mr-2 h-5 w-5" />
                                    Metode Pembayaran
                                </CardTitle>
                                <CardDescription>Pilih metode pembayaran yang Anda inginkan</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...paymentForm}>
                                    <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-6">
                                        <FormField
                                            control={paymentForm.control}
                                            name="paymentMethod"
                                            render={({ field }) => (
                                                <FormItem className="space-y-3">
                                                    <FormControl>
                                                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                                                            <FormItem className="flex items-center space-y-0 space-x-3 rounded-lg border p-4">
                                                                <FormControl>
                                                                    <RadioGroupItem value="bank_transfer" />
                                                                </FormControl>
                                                                <FormLabel className="flex-1 cursor-pointer font-normal">
                                                                    <div>
                                                                        <p className="font-medium">Transfer Bank</p>
                                                                        <p className="text-sm text-gray-500">
                                                                            Bayar melalui transfer bank (BCA, Mandiri, BNI, BRI)
                                                                        </p>
                                                                    </div>
                                                                </FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-y-0 space-x-3 rounded-lg border p-4">
                                                                <FormControl>
                                                                    <RadioGroupItem value="e_wallet" />
                                                                </FormControl>
                                                                <FormLabel className="flex-1 cursor-pointer font-normal">
                                                                    <div>
                                                                        <p className="font-medium">E-Wallet</p>
                                                                        <p className="text-sm text-gray-500">
                                                                            Bayar menggunakan e-wallet (OVO, GoPay, DANA, LinkAja)
                                                                        </p>
                                                                    </div>
                                                                </FormLabel>
                                                            </FormItem>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="flex justify-between">
                                            <Button variant="outline" onClick={() => setCurrentStep('delivery')}>
                                                Kembali
                                            </Button>
                                            <Button type="submit" className="bg-batik-indigo hover:bg-batik-indigo/90">
                                                Lanjutkan
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    )}

                    {/* Review Order */}
                    {currentStep === 'review' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Konfirmasi Pesanan</CardTitle>
                                <CardDescription>Tinjau pesanan Anda sebelum melakukan pembayaran</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Shipping Address */}
                                <div>
                                    <h3 className="text-batik-brown mb-2 font-semibold">Alamat Pengiriman</h3>
                                    <div className="rounded-lg border p-4">
                                        {shippingAddress && (
                                            <>
                                                <p className="font-medium">{shippingAddress.fullName}</p>
                                                <p className="text-sm text-gray-600">{shippingAddress.phone}</p>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.province}{' '}
                                                    {shippingAddress.postalCode}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Shipping Method */}
                                <div>
                                    <h3 className="text-batik-brown mb-2 font-semibold">Metode Pengiriman</h3>
                                    <div className="rounded-lg border p-4">
                                        {selectedShipping && (
                                            <>
                                                <p className="font-medium">
                                                    {selectedShipping.company} - {selectedShipping.courier_name}
                                                </p>
                                                <p className="text-sm text-gray-600">Estimasi {selectedShipping.duration}</p>
                                                <p className="text-batik-indigo mt-1 text-sm font-medium">{formatRupiah(selectedShipping.price)}</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <h3 className="text-batik-brown mb-2 font-semibold">Metode Pembayaran</h3>
                                    <div className="rounded-lg border p-4">
                                        <p className="font-medium">
                                            {paymentForm.getValues('paymentMethod') === 'bank_transfer' && 'Transfer Bank'}
                                            {paymentForm.getValues('paymentMethod') === 'e_wallet' && 'E-Wallet'}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-600">
                                            {paymentForm.getValues('paymentMethod') === 'bank_transfer' &&
                                                'Instruksi pembayaran akan dikirim melalui email'}
                                            {paymentForm.getValues('paymentMethod') === 'e_wallet' && 'Anda akan diarahkan ke halaman pembayaran'}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                    <h3 className="text-batik-brown mb-2 font-semibold">Produk yang Dibeli</h3>
                                    <div className="space-y-4">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between border-b pb-4">
                                                <div className="flex items-center">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-20 w-20 rounded-md object-cover object-center"
                                                    />
                                                    <div className="ml-4">
                                                        <p className="font-medium">{item.name}</p>
                                                        <p className="text-sm text-gray-600">Jumlah: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="font-medium">{formatRupiah(item.price * item.quantity)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-between">
                                    <Button variant="outline" onClick={() => setCurrentStep('payment')}>
                                        Kembali
                                    </Button>
                                    <Button
                                        onClick={handlePlaceOrder}
                                        disabled={isProcessingOrder}
                                        className="bg-batik-indigo hover:bg-batik-indigo/90"
                                    >
                                        {isProcessingOrder ? 'Memproses...' : 'Buat Pesanan'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-4">
                    <div className="sticky top-24">
                        <Card>
                            <CardHeader>
                                <CardTitle>Ringkasan Pesanan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Cart Items */}
                                <div className="space-y-2">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span>
                                                {item.name} <span className="text-gray-500">x{item.quantity}</span>
                                            </span>
                                            <span>{formatRupiah(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                {/* Coupon */}
                                <div>
                                    <Label htmlFor="coupon">Kode Kupon</Label>
                                    <div className="mt-1 flex">
                                        <Input
                                            id="coupon"
                                            placeholder="Masukkan kode kupon"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            disabled={!!activeCoupon}
                                            className="rounded-r-none"
                                        />
                                        {activeCoupon ? (
                                            <Button
                                                onClick={removeCoupon}
                                                variant="outline"
                                                className="rounded-l-none border-l-0"
                                                disabled={isCouponLoading}
                                            >
                                                {isCouponLoading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        <span>Menghapus...</span>
                                                    </>
                                                ) : (
                                                    'Hapus'
                                                )}
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={handleApplyCoupon}
                                                variant="outline"
                                                className="rounded-l-none border-l-0"
                                                disabled={isCouponLoading}
                                            >
                                                {isCouponLoading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        <span>Menerapkan...</span>
                                                    </>
                                                ) : (
                                                    'Terapkan'
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                    {activeCoupon && (
                                        <p className="mt-1 text-xs text-green-600">
                                            Kupon {activeCoupon.code} diterapkan - Diskon {activeCoupon.discount_percent}%
                                        </p>
                                    )}
                                </div>

                                <Separator />

                                {/* Totals */}
                                <div className="space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Subtotal</span>
                                        <span>{formatRupiah(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Diskon</span>
                                        <span>{discount > 0 ? `- ${formatRupiah(discount)}` : '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Pengiriman</span>
                                        <span>{shippingCost > 0 ? formatRupiah(shippingCost) : '-'}</span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex justify-between font-medium">
                                    <span>Total</span>
                                    <span>{formatRupiah(total)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Wrapper component to place the Checkout within the Layout
const Checkout = (props: CheckoutProps) => {
    return (
        <Layout>
            <CheckoutContent {...props} />
        </Layout>
    );
};

// Export default with error boundary
export default function CheckoutWithBoundary(props: CheckoutProps) {
    return (
        <CheckoutErrorBoundary>
            <Checkout {...props} />
        </CheckoutErrorBoundary>
    );
}
