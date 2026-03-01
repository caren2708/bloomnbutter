import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProductStore } from '../../store/productStore';

const FeaturedCategories = () => {
    const categories = useProductStore(state => state.categories);

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-serif text-4xl font-bold text-dark mb-4">Shop by Category</h2>
                    <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link to={`/shop?category=${encodeURIComponent(category.name)}`} className="group block relative overflow-hidden rounded-2xl aspect-[4/5]">
                                <img
                                    src={category.image_url ? `https://bloomnbutter-api.vercel.app${category.image_url}` : ''}
                                    alt={category.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 bg-gray-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-6">
                                    <h3 className="text-white font-serif text-2xl font-bold tracking-wide group-hover:text-gold transition-colors">
                                        {category.name}
                                    </h3>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
