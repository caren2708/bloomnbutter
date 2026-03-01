import { useEffect, useState } from 'react';
import { Package, Tags, Star, AlertCircle } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image_url: string;
    in_stock: boolean;
    featured: boolean;
}

export default function Dashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://bloomnbutter-api.vercel.app/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching products", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    const outOfStock = products.filter(p => !p.in_stock).length;
    const featured = products.filter(p => p.featured).length;
    const categoriesCount = new Set(products.map(p => p.category)).size;

    const stats = [
        { label: 'Total Products', value: products.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Categories', value: categoriesCount, icon: Tags, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Featured', value: featured, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100' },
        { label: 'Out of Stock', value: outOfStock, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#8B1A3A]">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-[#eddcd2] flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#eddcd2] overflow-hidden mt-8">
                <div className="px-6 py-4 border-b border-[#eddcd2]">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Products</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-[#eddcd2]">
                                <th className="px-6 py-3 font-medium">Product</th>
                                <th className="px-6 py-3 font-medium">Category</th>
                                <th className="px-6 py-3 font-medium">Price</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#eddcd2]">
                            {products.slice().reverse().slice(0, 5).map(product => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 flex items-center">
                                        {product.image_url ? (
                                            <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded object-cover mr-3 bg-gray-100" />
                                        ) : (
                                            <div className="w-10 h-10 rounded bg-gray-200 mr-3"></div>
                                        )}
                                        <span className="font-medium text-gray-900">{product.name}</span>
                                    </td>
                                    <td className="px-6 py-4 capitalize text-gray-600">{product.category}</td>
                                    <td className="px-6 py-4 text-gray-900 font-medium">₹{product.price.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No products found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
