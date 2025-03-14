const ProductCard = ({ product }) => {
    return (
      <div className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-200">
        <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover rounded-md" />
        <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
        <p className="text-gray-700">${product.price}</p>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-orange-700">
          Add to Cart
        </button>
      </div>
    );
  };
  
  export default ProductCard;
  