const ProductCard = ({ product }) => {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg">
      <img 
        src={product.imageUrl} 
        alt={product.title || product.name || "Product Image"} 
        className="h-60 w-full object-contain p-4" 
      />
      <h2 className="text-lg font-bold mt-2">
        {product.title || product.name || "No Name"}
      </h2>
      <p>{product.price} ₹</p>
    </div>
  );
};

export default ProductCard;
