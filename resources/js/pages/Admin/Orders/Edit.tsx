import { router } from '@inertiajs/react';
import { useEffect } from 'react';

interface Order {
    id: number;
}

interface EditProps {
    order: Order;
}

export default function Edit({ order }: EditProps) {
    useEffect(() => {
        // Redirect to the show page which has the edit functionality
        router.visit(`/admin/orders/${order.id}`);
    }, [order.id]);

    // This component will not render anything as it immediately redirects
    return null;
}
