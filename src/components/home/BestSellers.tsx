import { Link } from 'react-router-dom';
import { useProductStore } from '../../store/productStore';
import ProductCard from '../shop/ProductCard';

const BestSellers = () => {
    const products = useProductStore(state => state.products);
    // only show featured products
    const bestSellers = products.filter(p => p.featured).slice(0, 4);

    return (
        <section className="py-20 bg-cream/50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="font-serif text-4xl font-bold text-dark mb-2">Best Sellers</h2>
                        <p className="text-gray-600">Our most loved products</p>
                    </div>
                    <Link to="/shop" className="text-primary font-medium hover:text-dark transition-colors">
                        View All &rarr;
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {bestSellers.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BestSellers;
