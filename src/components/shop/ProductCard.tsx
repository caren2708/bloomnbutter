import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { type Product, useWishlistStore } from '../../context/wishlistStore';

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { isWishlisted, toggleWishlist } = useWishlistStore();
    const isLiked = isWishlisted(product.id);

    return (
        <motion.div
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-square">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
            </Link>

            <button
                onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product);
                }}
                className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition-all duration-300 ${isLiked ? 'bg-primary text-white' : 'bg-white text-gray-400 hover:text-primary'
                    }`}
            >
                <motion.div
                    whileTap={{ scale: 0.8 }}
                    animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
                >
                    <FiHeart className={isLiked ? 'fill-current' : ''} size={20} />
                </motion.div>
            </button>

            <div className="p-4">
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{product.category}</p>
                <Link to={`/product/${product.id}`}>
                    <h3 className="font-serif text-lg font-bold text-dark mb-1 hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-primary font-medium">{product.price}</p>
            </div>
        </motion.div>
    );
};

export default ProductCard;
