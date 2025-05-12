import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';
import ProductCard from './ProductCard';

const HomePopularProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getPopularProducts = async () => {
      const data = await fetchProducts();
      setProducts(data.slice(0, 4)); // Display top 4 products
    };

    getPopularProducts();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Popular Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomePopularProducts;