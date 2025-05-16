import { router } from '@inertiajs/react';
import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'sonner';

export interface ShippingAddress {
    fullName: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    phone: string;
    email?: string;
}

export interface ShippingOption {
    available_collection_method: string[];
    available_for_cash_on_delivery: boolean;
    available_for_proof_of_delivery: boolean;
    available_for_instant_waybill_id: boolean;
    available_for_insurance: boolean;
    company: string;
    courier_name: string;
    courier_code: string;
    courier_service_name: string;
    courier_service_code: string;
    currency: string;
    description: string;
    duration: string;
    shipment_duration_range: string;
    shipment_duration_unit: string;
    service_type: string;
    shipping_type: string;
    price: number;
    tax_lines: any[];
    type: string;
}

interface BiteshipResponse {
    courier_code: string;
    courier_name: string;
    service_code: string;
    service_name: string;
    price: number;
    estimated_days: string;
}

interface ShippingContextType {
    shippingAddress: ShippingAddress | null;
    setShippingAddress: (address: ShippingAddress) => void;
    calculateShipping: (city: string, postalCode: string) => Promise<void>;
    selectedShipping: ShippingOption | null;
    selectShipping: (option: ShippingOption) => void;
    isCalculatingShipping: boolean;
}

const ShippingContext = createContext<ShippingContextType | undefined>(undefined);

export const ShippingProvider = ({ children }: { children: ReactNode }) => {
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
    const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

    const handleSetShippingAddress = (address: ShippingAddress) => {
        setShippingAddress(address);
        toast('Alamat pengiriman disimpan', {
            description: 'Alamat pengiriman Anda telah disimpan',
        });
    };

    const calculateShipping = async (city: string, postalCode: string) => {
        if (!shippingAddress) return;
        setIsCalculatingShipping(true);
        try {
            await router.post(
                '/checkout/shipping',
                {
                    city,
                    postal_code: postalCode,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: false,
                    onError: (errors) => {
                        console.error('Shipping calculation error:', errors);
                        toast.error('Gagal menghitung ongkos kirim', {
                            description: errors.message || 'Terjadi kesalahan saat menghitung ongkos kirim',
                        });
                    },
                },
            );
        } catch (error) {
            console.error('Shipping calculation error:', error);
            toast.error('Gagal menghitung ongkos kirim', {
                description: 'Terjadi kesalahan saat menghitung ongkos kirim',
            });
        } finally {
            setIsCalculatingShipping(false);
        }
    };

    const selectShipping = (option: ShippingOption) => {
        setSelectedShipping(option);
        toast('Metode pengiriman dipilih', {
            description: `${option.company} ${option.courier_name} telah dipilih`,
        });
    };

    return (
        <ShippingContext.Provider
            value={{
                shippingAddress,
                setShippingAddress: handleSetShippingAddress,
                calculateShipping,
                selectedShipping,
                selectShipping,
                isCalculatingShipping,
            }}
        >
            {children}
        </ShippingContext.Provider>
    );
};

export const useShipping = () => {
    const context = useContext(ShippingContext);
    if (context === undefined) {
        throw new Error('useShipping must be used within a ShippingProvider');
    }
    return context;
};
