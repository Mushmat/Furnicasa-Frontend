// src/pages/ProductDetail.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <img src={product.imageUrl} alt={product.name} className="h-64 w-full object-cover rounded" />
      <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
      <p className="text-lg">{product.price} ₹</p>
      <p>{product.description}</p>
    </div>
  );
};

export default ProductDetail;
