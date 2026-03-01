import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import video from '../../assets/bloom-logo-video.mp4';

const Hero = () => {
    return (
        <section className="relative min-h-[100vh] lg:min-h-[110vh] w-full overflow-hidden flex items-center justify-center pb-24 md:pb-40">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-90"
                    style={{ objectPosition: 'center' }}
                >
                    <source src={video} type="video/mp4" />
                </video>
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-cream/40 backdrop-blur-[2px]" />

                {/* Gradient Fade to remove white gap at bottom - matches next section's white bg */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-5xl px-4 md:px-6 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col items-center justify-center gap-6 md:gap-8 lg:gap-10 text-center"
                >
                    <h1 className="font-serif font-bold text-dark drop-shadow-sm leading-tight text-[clamp(2.5rem,8vw,6rem)] break-words w-full">
                        Bloom & Butter
                    </h1>
                    <p className="text-dark/80 font-light tracking-wide leading-relaxed max-w-2xl text-[clamp(1.125rem,2vw,1.5rem)] px-2">
                        Custom Gifts & Accessories Bloomed With Love
                    </p>
                    <Link
                        to="/shop"
                        className="inline-flex items-center justify-center bg-primary text-white rounded-full font-medium transition-all shadow-lg hover:shadow-[0_0_20px_rgba(197,39,91,0.5)] transform hover:-translate-y-1 hover:scale-105 active:scale-95
                        px-10 py-4 text-xl min-w-[200px] min-h-[60px]"
                        aria-label="Explore Products"
                    >
                        Explore Products
                    </Link>
                </motion.div>
            </div>

            {/* Floating Particles (Simple CSS/SVG) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden motion-reduce:hidden">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-primary/20 rounded-full blur-xl"
                        style={{
                            width: Math.random() * 100 + 50,
                            height: Math.random() * 100 + 50,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -100, 0],
                            x: [0, 50, 0],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 10 + Math.random() * 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>
        </section>
    );
};

export default Hero;
