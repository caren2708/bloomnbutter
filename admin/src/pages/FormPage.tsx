import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UploadCloud, X } from 'lucide-react';

export default function FormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        badge: '',
        in_stock: true,
        featured: false,
    });
    const [existingCategories, setExistingCategories] = useState<string[]>([]);
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImagesList, setExistingImagesList] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        Promise.all([
            fetch('https://bloomnbutter-api.vercel.app/api/categories').then(res => res.json()),
            isEdit ? fetch('https://bloomnbutter-api.vercel.app/api/products').then(res => res.json()) : Promise.resolve([])
        ])
            .then(([categoriesData, productsData]) => {
                const cats = categoriesData.map((c: any) => c.name) as string[];
                setExistingCategories(cats);

                if (isEdit) {
                    const product = productsData.find((p: any) => p.id === id);
                    if (product) {
                        setFormData({
                            name: product.name,
                            price: product.price.toString(),
                            category: product.category,
                            description: product.description || '',
                            badge: product.badge || '',
                            in_stock: product.in_stock,
                            featured: product.featured,
                        });
                        if (product.images && product.images.length > 0) {
                            setExistingImagesList(product.images);
                        } else if (product.image_url) {
                            setExistingImagesList([product.image_url]);
                        }
                    }
                } else if (cats.length > 0) {
                    setFormData(prev => ({ ...prev, category: cats[0] }));
                }
            })
            .catch(err => console.error(err));
    }, [id, isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleFiles = (files: File[]) => {
        setImageFiles(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeNewImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index: number) => {
        setExistingImagesList(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const fd = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                fd.append(key, String(value));
            });
            imageFiles.forEach(file => {
                fd.append('images', file);
            });

            existingImagesList.forEach(img => {
                fd.append('existingImages', img);
            });

            const url = isEdit
                ? `https://bloomnbutter-api.vercel.app/api/products/${id}`
                : 'https://bloomnbutter-api.vercel.app/api/products';

            const res = await fetch(url, {
                method: isEdit ? 'PUT' : 'POST',
                body: fd
            });

            if (!res.ok) throw new Error('Failed to save product');

            // Simple toast alternative (native alert or just redirect)
            alert(isEdit ? 'Product updated successfully!' : 'Product added successfully!');
            navigate('/products');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-[#8B1A3A] mb-8">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-[#eddcd2] p-8 space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Product Name</label>
                        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A3A] focus:outline-none" />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                        <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A3A] focus:outline-none" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        {isNewCategory ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A3A] focus:outline-none bg-white"
                                    placeholder="Enter new category"
                                    required
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsNewCategory(false);
                                        setFormData(prev => ({ ...prev, category: existingCategories[0] || '' }));
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <select
                                name="category"
                                value={formData.category}
                                onChange={(e) => {
                                    if (e.target.value === '___new___') {
                                        setIsNewCategory(true);
                                        setFormData(prev => ({ ...prev, category: '' }));
                                    } else {
                                        handleChange(e);
                                    }
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A3A] focus:outline-none bg-white capitalize"
                                required
                            >
                                {!formData.category && <option value="" disabled>Select a category</option>}
                                {existingCategories.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                                <option value="___new___" className="font-semibold text-[#8B1A3A]">+ Add New Category</option>
                            </select>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Badge (Optional)</label>
                        <input type="text" name="badge" placeholder="e.g. Best Seller, New" value={formData.badge} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A3A] focus:outline-none" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea rows={4} name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A3A] focus:outline-none"></textarea>
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Product Images</label>

                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleImageDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative overflow-hidden"
                    >
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) handleFiles(Array.from(e.target.files));
                            }}
                        />

                        <div className="flex flex-col items-center text-gray-500">
                            <UploadCloud className="w-12 h-12 mb-3 text-gray-400" />
                            <p className="font-medium">Click to upload or drag and drop</p>
                            <p className="text-sm mt-1">Select multiple SVG, PNG, JPG or GIF</p>
                        </div>
                    </div>

                    {(existingImagesList.length > 0 || imagePreviews.length > 0) && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                            {existingImagesList.map((img, index) => (
                                <div key={`existing-${index}`} className="relative group">
                                    <img src={img} alt={`Existing ${index}`} className="w-full h-32 object-cover rounded-lg shadow-sm" />
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeExistingImage(index); }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {imagePreviews.map((img, index) => (
                                <div key={`new-${index}`} className="relative group">
                                    <img src={img} alt={`New ${index}`} className="w-full h-32 object-cover rounded-lg shadow-sm" />
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeNewImage(index); }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-6 pt-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" name="in_stock" checked={formData.in_stock} onChange={handleChange} className="w-5 h-5 text-[#8B1A3A] rounded focus:ring-[#8B1A3A]" />
                        <span className="font-medium text-gray-700">In Stock</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 text-[#8B1A3A] rounded focus:ring-[#8B1A3A]" />
                        <span className="font-medium text-gray-700">Best Seller</span>
                    </label>
                </div>

                <div className="pt-6 border-t border-[#eddcd2] flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/products')}
                        className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-[#8B1A3A] hover:bg-[#6c142d] text-white rounded-lg transition-colors font-medium disabled:opacity-70 flex items-center"
                    >
                        {loading ? 'Saving...' : 'Save Product'}
                    </button>
                </div>

            </form>
        </div>
    );
}
