import { router } from '@inertiajs/react';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Deklarasi interface untuk window
declare global {
    interface Window {
        initialCoupon?: {
            id: number;
            code: string;
            discount_percent: number;
        } | null;
    }
}

export interface Coupon {
    id?: number;
    code: string;
    discount_percent: number;
}

interface CouponContextType {
    applyCoupon: (code: string) => void;
    removeCoupon: () => void;
    activeCoupon: Coupon | null;
    discountAmount: (subtotal: number) => number;
    isLoading: boolean;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export const CouponProvider = ({ children }: { children: ReactNode }) => {
    // Get initial coupon data from session if available
    const initialCoupon = typeof window !== 'undefined' && window.initialCoupon ? window.initialCoupon : null;
    const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(initialCoupon);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Setiap kali props coupon berubah (dari Inertia), update state
    useEffect(() => {
        if (typeof window !== 'undefined' && window.initialCoupon) {
            setActiveCoupon(window.initialCoupon);
        }
    }, []);

    const applyCoupon = (code: string) => {
        if (!code) {
            // toast('Kode kupon tidak boleh kosong', {
            //     description: 'Silakan masukkan kode kupon',
            // });
            return;
        }
        setIsLoading(true);
        router.post(
            '/checkout/coupon',
            { code },
            {
                preserveState: true,
                onSuccess: (page: any) => {
                    if (page && page.props && page.props.coupon) {
                        const couponData = page.props.coupon;
                        setActiveCoupon(couponData);
                        // toast('Kupon berhasil diterapkan', {
                        //     description: `Diskon ${couponData.discount_percent}% telah diterapkan ke pesanan Anda`,
                        // });
                    } else {
                        // toast.error('Kupon tidak valid', {
                        //     description: page.props.error || 'Kode kupon yang Anda masukkan tidak dapat digunakan',
                        // });
                    }
                },
                onError: (errors: any) => {
                    // toast.error('Gagal menerapkan kupon', {
                    //     description: errors.message || 'Terjadi kesalahan saat mencoba menerapkan kupon',
                    // });
                },
                onFinish: () => {
                    setIsLoading(false);
                },
            },
        );
    };

    const removeCoupon = () => {
        if (!activeCoupon) return;
        setIsLoading(true);
        router.delete('/checkout/coupon', {
            preserveState: true,
            onSuccess: (page: any) => {
                setActiveCoupon(null);
                // toast('Kupon dihapus', {
                //     description: 'Kupon telah dihapus dari pesanan Anda',
                // });
            },
            onError: (errors: any) => {
                // toast.error('Gagal menghapus kupon', {
                //     description: errors.message || 'Terjadi kesalahan saat mencoba menghapus kupon',
                // });
            },
            onFinish: () => {
                setIsLoading(false);
            },
        });
    };

    const discountAmount = (subtotal: number) => {
        return activeCoupon ? (subtotal * activeCoupon.discount_percent) / 100 : 0;
    };

    return (
        <CouponContext.Provider
            value={{
                applyCoupon,
                removeCoupon,
                activeCoupon,
                discountAmount,
                isLoading,
            }}
        >
            {children}
        </CouponContext.Provider>
    );
};

export const useCoupon = () => {
    const context = useContext(CouponContext);
    if (context === undefined) {
        throw new Error('useCoupon must be used within a CouponProvider');
    }
    return context;
};
