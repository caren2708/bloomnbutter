import { useEffect, useState, useRef } from 'react';
import { Trash2, UploadCloud, X } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    image_url: string;
    created_at: string;
}

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchCategories = () => {
        fetch('https://bloomnbutter-api.vercel.app/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFile = (file: File) => {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        setLoading(true);

        try {
            const fd = new FormData();
            fd.append('name', name.toLowerCase());
            if (imageFile) {
                fd.append('image', imageFile);
            }

            const res = await fetch('https://bloomnbutter-api.vercel.app/api/categories', {
                method: 'POST',
                body: fd
            });

            if (!res.ok) throw new Error('Failed to save category');

            // Reset form
            setName('');
            setImageFile(null);
            setImagePreview(null);
            fetchCategories();
        } catch (err) {
            console.error(err);
            alert("Error saving category");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category? Products in this category will not be deleted, but they may not display correctly until reassigned.')) return;
        try {
            await fetch(`https://bloomnbutter-api.vercel.app/api/categories/${id}`, { method: 'DELETE' });
            fetchCategories();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-[#8B1A3A]">Categories</h1>

            <div className="bg-white rounded-xl shadow-sm border border-[#eddcd2] p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Category</h2>
                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Category Name</label>
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A3A] focus:outline-none"
                            placeholder="e.g. jewelry"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Category Image</label>

                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleImageDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative overflow-hidden"
                        >
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
                                }}
                            />

                            {imagePreview ? (
                                <div className="relative inline-block">
                                    <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg shadow-sm" />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setImageFile(null);
                                            setImagePreview(null);
                                        }}
                                        className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-gray-500">
                                    <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                                    <p className="font-medium">Click to upload or drag and drop</p>
                                    <p className="text-sm mt-1">Recommended size: 800x1000px</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-[#8B1A3A] hover:bg-[#6c142d] text-white rounded-lg transition-colors font-medium disabled:opacity-70 flex items-center"
                        >
                            {loading ? 'Saving...' : 'Save Category'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#eddcd2] overflow-hidden">
                <div className="p-6 border-b border-[#eddcd2]">
                    <h2 className="text-xl font-bold text-gray-800">Existing Categories</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-[#eddcd2]">
                                <th className="px-6 py-3 font-medium">Image</th>
                                <th className="px-6 py-3 font-medium">Category Name</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#eddcd2]">
                            {categories.map(category => (
                                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        {category.image_url ? (
                                            <img src={`https://bloomnbutter-api.vercel.app${category.image_url}`} alt={category.name} className="w-16 h-16 rounded object-cover bg-gray-100 border border-gray-200" />
                                        ) : (
                                            <div className="w-16 h-16 rounded bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-400 text-xs text-center p-1">No Image</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 capitalize text-gray-900 font-medium">
                                        {category.name}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                        No categories added yet. Add one above!
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
