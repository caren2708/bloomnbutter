import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
    id: string;
    name: string;
    price?: string;
    image: string;
    images?: string[];
    category: string;
    description?: string;
    in_stock?: boolean;
    featured?: boolean;
    badge?: string;
}

interface WishlistState {
    items: Product[];
    addItem: (product: Product) => void;
    removeItem: (id: string) => void;
    isWishlisted: (id: string) => boolean;
    toggleWishlist: (product: Product) => void;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => set((state) => ({ items: [...state.items, product] })),
            removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
            isWishlisted: (id) => get().items.some((item) => item.id === id),
            toggleWishlist: (product) => {
                const { isWishlisted, addItem, removeItem } = get();
                if (isWishlisted(product.id)) {
                    removeItem(product.id);
                } else {
                    addItem(product);
                }
            },
        }),
        {
            name: 'wishlist-storage',
        }
    )
);
