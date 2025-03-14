const ProductCard = ({ product }) => {
    return (
      <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
        <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded" />
        <h2 className="mt-2 text-xl font-semibold">{product.name}</h2>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-lg font-bold mt-1">₹{product.price}</p>
        <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Add to Cart
        </button>
      </div>
    );
  };
  
  export default ProductCard;
  