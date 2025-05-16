// PageWithMessage.tsx
import React, { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

// Tipe untuk props yang diteruskan
interface PageProps {
    message?: string;
    [key: string]: any; // Tambahkan tipe dinamis jika perlu
}

const PageWithMessage = ({ children }: { children: React.ReactNode }) => {
    const { message } = usePage<PageProps>().props;

    useEffect(() => {
        if (message) {
            toast(message);
        }
    }, [message]);

    return <>{children}</>; // Just render the children
};

export default PageWithMessage;
