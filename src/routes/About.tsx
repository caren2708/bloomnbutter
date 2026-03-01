import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero */}
            <div className="relative h-[40vh] bg-secondary/30 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490750967868-58cb75069ed6?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20" />
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 font-serif text-5xl md:text-6xl font-bold text-dark"
                >
                    Our Story
                </motion.h1>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xl text-primary font-serif italic mb-8"
                    >
                        "Bloom where you are planted."
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="prose prose-lg mx-auto text-gray-600"
                    >
                        <p className="mb-6">
                            Bloom & Butter started as a small passion project in a cozy home studio.
                            Inspired by the beauty of nature and the joy of giving, we set out to create
                            products that bring a smile to your face.
                        </p>
                        <p className="mb-6">
                            Our mission is simple: to provide high-quality, handcrafted gifts and accessories
                            that add a touch of elegance to your everyday life. Whether it's a piece of
                            jewelry, a custom printable, or a curated gift box, every item is made with love.
                        </p>
                        <p>
                            Thank you for being part of our journey. We hope our products help you bloom
                            and spread joy to those around you.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="mt-12 grid grid-cols-2 gap-4"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=500"
                            alt="Studio"
                            className="rounded-2xl shadow-md w-full h-64 object-cover"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=500"
                            alt="Crafting"
                            className="rounded-2xl shadow-md w-full h-64 object-cover"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default About;
