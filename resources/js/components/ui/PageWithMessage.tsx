// PageWithMessage.tsx
import React, { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

interface CustomPageProps extends InertiaPageProps {
    flash: {
        success?: string | (() => string | null) | null;
        error?: string | (() => string | null) | null;
        message?: string | (() => string | null) | null;
    };
    success?: string | null;
    error?: string | null;
    message?: string | null;
    [key: string]: any; // Ini yang diperlukan untuk memenuhi constraint PageProps
}

const PageWithMessage = ({ children }: { children: React.ReactNode }) => {
    const props = usePage<CustomPageProps>().props;
    const { flash } = props;

    useEffect(() => {
        // Helper function untuk mendapatkan nilai dari flash message
        const getFlashValue = (flash: string | (() => string | null) | null | undefined): string | null => {
            if (typeof flash === 'function') {
                return flash();
            }
            return flash || null;
        };

        // Helper function untuk menampilkan toast
        const showToast = (message: string | null, type: 'success' | 'error') => {
            if (message) {
                if (type === 'success') {
                    toast.success(message, {
                        duration: 3000, // Durasi 3 detik
                        position: 'bottom-right', // Posisi di kanan atas
                    });
                } else {
                    toast.error(message, {
                        duration: 3000,
                        position: 'bottom-right',
                    });
                }
            }
        };

        // Cek dan tampilkan pesan dengan prioritas
        const flashSuccess = getFlashValue(flash?.success);
        const flashError = getFlashValue(flash?.error);
        const flashMessage = getFlashValue(flash?.message);
        const directSuccess = props.success;
        const directError = props.error;
        const directMessage = props.message;

        // Prioritas: flash error > direct error > flash success > direct success > flash message > direct message
        if (flashError) {
            showToast(flashError, 'error');
        } else if (directError) {
            showToast(directError, 'error');
        }

        if (flashSuccess) {
            showToast(flashSuccess, 'success');
        } else if (directSuccess) {
            showToast(directSuccess, 'success');
        } else if (flashMessage) {
            showToast(flashMessage, 'success');
        } else if (directMessage) {
            showToast(directMessage, 'success');
        }
    }, [props]);

    return <>{children}</>;
};

export default PageWithMessage;
