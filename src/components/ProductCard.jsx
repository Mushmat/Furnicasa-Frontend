const ProductCard = ({ product }) => {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-md transition">
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-40 object-cover rounded"
        />
      )}
      <h3 className="mt-2 text-lg font-bold">{product.title}</h3>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-blue-600 text-lg font-semibold">₹{product.price}</p>
      <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
