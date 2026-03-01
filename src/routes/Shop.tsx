import { motion } from 'framer-motion';
import ProductGrid from '../components/shop/ProductGrid';
import { useProductStore } from '../store/productStore';

const Shop = () => {
    const products = useProductStore(state => state.products);
    return (
        <div className="bg-cream/30 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="font-serif text-5xl font-bold text-dark mb-4">Shop</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover our collection of handcrafted gifts and accessories.
                    </p>
                </motion.div>

                <ProductGrid products={products} />
            </div>
        </div>
    );
};

export default Shop;
