import { type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import FloatingWhatsApp from '../ui/FloatingWhatsApp';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="flex flex-col min-h-screen bg-cream font-sans text-dark">
            <Header />
            <main className="flex-grow pt-20">
                {children}
            </main>
            <Footer />
            <FloatingWhatsApp />
        </div>
    );
};

export default Layout;
