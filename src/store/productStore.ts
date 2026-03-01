import { create } from 'zustand';
import { type Product } from '../context/wishlistStore';

export interface StoreCategory {
    id: string;
    name: string;
    image_url: string;
}

interface ProductState {
    products: Product[];
    categories: StoreCategory[];
    loading: boolean;
    fetchProducts: () => Promise<void>;
    fetchCategories: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
    products: [],
    categories: [],
    loading: false,
    fetchProducts: async () => {
        set({ loading: true });
        try {
            const res = await fetch('https://bloomnbutter-api.vercel.app/api/products');
            const data = await res.json();
            const mapped = data.map((p: any) => ({
                id: String(p.id),
                name: p.name,
                price: `₹${Number(p.price).toLocaleString()}`,
                category: p.category,
                image: (p.images && p.images.length > 0) ? p.images[0] : (p.image_url || ''),
                images: p.images || [],
                description: p.description,
                in_stock: p.in_stock,
                featured: p.featured,
                badge: p.badge
            }));
            set({ products: mapped.filter((p: any) => p.in_stock), loading: false });
        } catch (error) {
            console.error('Failed to fetch products', error);
            set({ loading: false });
        }
    },
    fetchCategories: async () => {
        try {
            const res = await fetch('https://bloomnbutter-api.vercel.app/api/categories');
            const data = await res.json();
            set({ categories: data });
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    }
}));
