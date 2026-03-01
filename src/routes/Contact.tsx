import { motion } from 'framer-motion';
import { FiMail, FiInstagram, FiMessageCircle } from 'react-icons/fi';

const Contact = () => {
    return (
        <div className="bg-cream/30 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="font-serif text-5xl font-bold text-dark mb-4">Get in Touch</h1>
                    <p className="text-gray-600">We'd love to hear from you.</p>
                </motion.div>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-8 rounded-2xl shadow-sm"
                    >
                        <h2 className="font-serif text-2xl font-bold text-dark mb-6">Contact Information</h2>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <FiMessageCircle size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-dark">WhatsApp</p>
                                    <p className="text-gray-600">+1 234 567 890</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <FiMail size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-dark">Email</p>
                                    <p className="text-gray-600">hello@bloomandbutter.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <FiInstagram size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-dark">Instagram</p>
                                    <p className="text-gray-600">@bloomandbutter</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white p-8 rounded-2xl shadow-sm"
                    >
                        <h2 className="font-serif text-2xl font-bold text-dark mb-6">Send us a Message</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                    placeholder="How can we help?"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-dark transition-colors"
                            >
                                Send Message
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
