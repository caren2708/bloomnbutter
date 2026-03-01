import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiArrowLeft, FiMessageCircle } from 'react-icons/fi';
import { useWishlistStore } from '../context/wishlistStore';
import { useProductStore } from '../store/productStore';

const ProductDetail = () => {
    const { id } = useParams();
    const products = useProductStore(state => state.products);
    const loading = useProductStore(state => state.loading);
    const product = products.find((p) => p.id === id);
    const { isWishlisted, toggleWishlist } = useWishlistStore();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Reset selected image if product changes
    useEffect(() => {
        setSelectedImage(null);
    }, [product?.id]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-serif text-dark mb-4">Loading...</h2>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-serif text-dark mb-4">Product not found</h2>
                <Link to="/shop" className="text-primary hover:underline">Back to Shop</Link>
            </div>
        );
    }

    const isLiked = isWishlisted(product.id);
    const phoneNumber = "1234567890"; // Replace with actual number
    const message = `Hi! I'm interested in the product: ${product.name}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    const mainImage = selectedImage || product.image;

    return (
        <div className="container mx-auto px-4 py-12">
            <Link to="/shop" className="inline-flex items-center text-gray-500 hover:text-primary mb-8 transition-colors">
                <FiArrowLeft className="mr-2" /> Back to Shop
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <div className="flex flex-col gap-4 w-full">
                    {/* Main Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={mainImage} // forces remount for animation on change
                        className="bg-white rounded-2xl overflow-hidden shadow-sm aspect-square w-full relative"
                    >
                        <img
                            src={mainImage}
                            alt={product.name}
                            className="w-full h-full object-cover absolute inset-0"
                            style={{ objectFit: 'cover' }}
                        />
                    </motion.div>

                    {/* Thumbnails */}
                    {(product.images && product.images.length > 1) && (
                        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all hover:opacity-100 ${mainImage === img ? 'border-primary opacity-100 scale-105' : 'border-transparent opacity-60'}`}
                                    aria-label={`View image ${idx + 1}`}
                                >
                                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <span className="text-primary font-medium tracking-wider uppercase text-sm">
                        {product.category}
                    </span>
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-dark mt-2 mb-4">
                        {product.name}
                    </h1>
                    <p className="text-2xl text-gray-800 font-medium mb-6">{product.price}</p>

                    <div className="prose prose-lg text-gray-600 mb-8">
                        <p>{product.description}</p>
                        <p>
                            Handcrafted with care. Perfect for gifting or treating yourself.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-green-500 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            <FiMessageCircle size={24} />
                            Message on WhatsApp
                        </a>

                        <button
                            onClick={() => toggleWishlist(product)}
                            className={`flex-1 px-8 py-4 rounded-full font-medium text-lg border-2 transition-all flex items-center justify-center gap-2 ${isLiked
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                                }`}
                        >
                            <FiHeart className={isLiked ? 'fill-current' : ''} size={24} />
                            {isLiked ? 'Wishlisted' : 'Add to Wishlist'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetail;
