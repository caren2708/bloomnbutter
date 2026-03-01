import { motion } from 'framer-motion';
import sunflowerImg from '../../assets/Beautiful-sunflower.jpg';


const StorySection = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Watercolor Background Element */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6"
                    >
                        Bloomed With Love
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-600 leading-relaxed mb-8"
                    >
                        At Bloom & Butter, we believe that every gift tells a story.
                        Our handcrafted accessories and personalized items are designed to bring joy,
                        elegance, and a touch of magic to your everyday life.
                        From delicate jewelry to custom printables, everything is made with passion and care.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <img
                            src={sunflowerImg}
                            alt="Flowers"
                            className="rounded-2xl shadow-lg mx-auto h-64 w-full object-cover"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default StorySection;
