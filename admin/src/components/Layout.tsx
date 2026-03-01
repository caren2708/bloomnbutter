import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Store } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Layout() {
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: ShoppingBag, label: 'Products', path: '/products' },
        { icon: Store, label: 'Categories', path: '/categories' },
    ];

    return (
        <div className="flex h-screen w-full bg-[#fdf6ee] font-sans text-gray-800">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-[#eddcd2] flex flex-col shadow-sm hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-[#eddcd2]">
                    <Store className="w-6 h-6 text-[#8B1A3A] mr-2" />
                    <span className="font-bold text-xl text-[#8B1A3A]">B&B Admin</span>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map((item) => {
                        const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center px-4 py-3 rounded-lg transition-colors group",
                                    active
                                        ? "bg-[#8B1A3A] text-white"
                                        : "text-gray-600 hover:bg-[#fdf6ee] hover:text-[#8B1A3A]"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5 mr-3", active ? "text-white" : "text-gray-500 group-hover:text-[#8B1A3A]")} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-[#eddcd2] flex items-center px-8 shadow-sm justify-between md:hidden">
                    <div className="flex items-center">
                        <Store className="w-6 h-6 text-[#8B1A3A] mr-2" />
                        <span className="font-bold text-xl text-[#8B1A3A]">B&B</span>
                    </div>
                    {/* simple mobile nav link */}
                    <nav className="flex space-x-4">
                        <Link to="/" className="text-sm font-medium">Dashboard</Link>
                        <Link to="/products" className="text-sm font-medium">Products</Link>
                        <Link to="/categories" className="text-sm font-medium">Categories</Link>
                    </nav>
                </header>
                <div className="flex-1 overflow-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
