import ProductForm from './Form';

interface ProductSize {
    id?: number;
    product_id?: number;
    size: string;
    stock: number;
}

interface ProductImage {
    id?: number;
    product_id?: number;
    image: string;
    is_primary: boolean;
}

interface Product {
    id: number;
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

interface EditProps {
    product: Product;
}

export default function Edit({ product }: EditProps) {
    return <ProductForm product={product} isEdit={true} />;
}
