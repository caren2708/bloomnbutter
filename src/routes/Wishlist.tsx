import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '../context/wishlistStore';
import ProductCard from '../components/shop/ProductCard';

const Wishlist = () => {
    const { items } = useWishlistStore();

    return (
        <div className="bg-cream/30 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="font-serif text-5xl font-bold text-dark mb-4">My Wishlist</h1>
                    <p className="text-gray-600">Your favorite items saved for later.</p>
                </motion.div>

                {items.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-xl text-gray-500 mb-6">Your wishlist is empty.</p>
                        <Link
                            to="/shop"
                            className="inline-block bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-dark transition-colors shadow-md"
                        >
                            Start Shopping
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                        <AnimatePresence>
                            {items.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
