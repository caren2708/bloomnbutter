import { motion } from 'framer-motion';
import { FiHeart, FiStar, FiPackage, FiMessageCircle } from 'react-icons/fi';

const features = [
    {
        icon: FiHeart,
        title: 'Handmade with Love',
        description: 'Every item is crafted with attention to detail and care.'
    },
    {
        icon: FiStar,
        title: 'Premium Quality',
        description: 'We use only the finest materials for our products.'
    },
    {
        icon: FiPackage,
        title: 'Personalized',
        description: 'Custom designs to make your gift truly unique.'
    },
    {
        icon: FiMessageCircle,
        title: 'Fast Replies',
        description: 'We are always here to answer your questions on WhatsApp.'
    }
];

const WhyChooseUs = () => {
    return (
        <section className="py-20 bg-cream">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl font-bold text-dark mb-4">Why Choose Us</h2>
                    <p className="text-gray-600">The Bloom & Butter Promise</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-8 rounded-2xl shadow-sm text-center hover:shadow-md transition-shadow"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/30 text-primary rounded-full mb-6">
                                <feature.icon size={32} />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-dark mb-3">{feature.title}</h3>
                            <p className="text-gray-500">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
