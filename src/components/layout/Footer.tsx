import { Link } from 'react-router-dom';
import { FiInstagram, FiMail } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Brand */}
                    <div className="text-center md:text-left">
                        <h3 className="font-serif text-2xl font-bold text-primary mb-4">Bloom & Butter</h3>
                        <p className="text-gray-600 mb-4">
                            Handcrafted gifts, accessories, and printables designed to add a touch of elegance to your life.
                        </p>
                        <div className="flex justify-center md:justify-start gap-4">
                            <a href="#" className="text-dark hover:text-primary transition-colors">
                                <FiInstagram size={24} />
                            </a>
                            <a href="mailto:hello@bloomandbutter.com" className="text-dark hover:text-primary transition-colors">
                                <FiMail size={24} />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="text-center">
                        <h4 className="font-bold text-dark mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-600 hover:text-primary transition-colors">Home</Link></li>
                            <li><Link to="/shop" className="text-gray-600 hover:text-primary transition-colors">Shop</Link></li>
                            <li><Link to="/about" className="text-gray-600 hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="text-gray-600 hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="text-center md:text-right">
                        <h4 className="font-bold text-dark mb-4">Contact Us</h4>
                        <p className="text-gray-600 mb-2">Email: hello@bloomandbutter.com</p>
                        <p className="text-gray-600">WhatsApp: +1 234 567 890</p>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Bloom & Butter. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
