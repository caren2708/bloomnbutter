import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image_url?: string;
    images?: string[];
    in_stock: boolean;
    featured: boolean;
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const fetchData = () => {
        Promise.all([
            fetch('https://bloomnbutter-api.vercel.app/api/products').then(res => res.json()),
            fetch('https://bloomnbutter-api.vercel.app/api/categories').then(res => res.json())
        ])
            .then(([prodData, catData]) => {
                setProducts(prodData);
                setCategories(catData.map((c: any) => c.name));
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await fetch(`https://bloomnbutter-api.vercel.app/api/products/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggle = async (product: Product, field: 'in_stock' | 'featured') => {
        try {
            // create FormData because the backend expects multipart/form-data for updates
            // However, we didn't send a new image so we can just send the updated fields.
            // Wait, backend supports JSON or FormData if no file is strictly required, BUT our multer setup uses upload.single('image').
            // So FormData is safest.
            const fd = new FormData();
            fd.append('name', product.name);
            fd.append('price', product.price.toString());
            fd.append('category', product.category);
            if (field === 'in_stock') {
                fd.append('in_stock', String(!product.in_stock));
                fd.append('featured', String(product.featured));
            } else {
                fd.append('in_stock', String(product.in_stock));
                fd.append('featured', String(!product.featured));
            }

            await fetch(`https://bloomnbutter-api.vercel.app/api/products/${product.id}`, {
                method: 'PUT',
                body: fd
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };



    const filteredProducts = products.filter(p => {
        if (filter !== 'all' && p.category !== filter) return false;
        if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-[#8B1A3A]">Products</h1>
                <Link to="/products/new" className="bg-[#8B1A3A] hover:bg-[#6c142d] text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Product
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A3A] bg-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B1A3A] bg-white"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    {categories.map(c => (
                        <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#eddcd2] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-[#eddcd2]">
                                <th className="px-6 py-3 font-medium">Product</th>
                                <th className="px-6 py-3 font-medium">Category</th>
                                <th className="px-6 py-3 font-medium">Price (₹)</th>
                                <th className="px-6 py-3 font-medium text-center">In Stock</th>
                                <th className="px-6 py-3 font-medium text-center">Best Seller</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#eddcd2]">
                            {filteredProducts.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 flex items-center">
                                        {(product.images && product.images.length > 0) ? (
                                            <img src={`https://bloomnbutter-api.vercel.app${product.images[0]}`} alt={product.name} className="w-12 h-12 rounded object-cover mr-4 bg-gray-100 border border-gray-200" />
                                        ) : product.image_url ? (
                                            <img src={`https://bloomnbutter-api.vercel.app${product.image_url}`} alt={product.name} className="w-12 h-12 rounded object-cover mr-4 bg-gray-100 border border-gray-200" />
                                        ) : (
                                            <div className="w-12 h-12 rounded bg-gray-200 mr-4 border border-gray-200"></div>
                                        )}
                                        <span className="font-medium text-gray-900">{product.name}</span>
                                    </td>
                                    <td className="px-6 py-4 capitalize text-gray-600">{product.category}</td>
                                    <td className="px-6 py-4 text-gray-900 font-medium">₹{product.price.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => handleToggle(product, 'in_stock')} className="hover:scale-110 transition-transform">
                                            {product.in_stock ? <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" /> : <XCircle className="w-6 h-6 text-gray-300 mx-auto" />}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => handleToggle(product, 'featured')} className="hover:scale-110 transition-transform">
                                            {product.featured ? <CheckCircle2 className="w-6 h-6 text-[#8B1A3A] mx-auto" /> : <XCircle className="w-6 h-6 text-gray-300 mx-auto" />}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            <Link to={`/products/${product.id}`} className="text-blue-600 hover:text-blue-800 p-1">
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800 p-1">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No products found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
