import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();

  const product = { name: "Luxury Sofa", price: 399.99, description: "A comfortable modern sofa.", imageUrl: "/images/sofa.jpg" };

  return (
    <div className="max-w-4xl mx-auto mt-20 p-6">
      <img src={product.imageUrl} alt={product.name} className="w-full h-60 object-cover rounded-lg" />
      <h2 className="text-3xl font-bold mt-4">{product.name}</h2>
      <p className="text-gray-700 mt-2">${product.price}</p>
      <p className="mt-4">{product.description}</p>
      <button className="bg-orange-600 text-white px-4 py-2 rounded-md mt-4">Add to Cart</button>
    </div>
  );
};

export default ProductDetail;
