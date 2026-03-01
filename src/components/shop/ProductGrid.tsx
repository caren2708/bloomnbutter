import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import { type Product } from '../../context/wishlistStore';
import { useProductStore } from '../../store/productStore';


interface ProductGridProps {
    products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');
    const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');

    // We can still use Store's categories if we want, but unique categories from products might be safer here 
    // depending on if we want empty categories to show up. Showing actual created categories is better:
    const storeCategories = useProductStore(state => state.categories);

    useEffect(() => {
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        } else {
            setSelectedCategory('All');
        }
    }, [categoryParam]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        if (category === 'All') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', category);
        }
        setSearchParams(searchParams);
    };

    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

    return (
        <div>
            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
                <button
                    onClick={() => handleCategoryChange('All')}
                    className={`px-6 py-2 rounded-full transition-all ${selectedCategory === 'All'
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    All
                </button>
                {storeCategories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.name)}
                        className={`px-6 py-2 rounded-full transition-all capitalize ${selectedCategory === cat.name
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
                <AnimatePresence>
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    No products found in this category.
                </div>
            )}
        </div>
    );
};

export default ProductGrid;
