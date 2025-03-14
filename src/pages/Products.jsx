import ProductCard from "../components/ProductCard";

const Products = () => {
  const products = [
    { name: "Elegant Sofa", price: 299.99, imageUrl: "/images/sofa.jpg" },
    { name: "Minimalist Table", price: 199.99, imageUrl: "/images/table.jpg" },
  ];

  return (
    <div className="mt-16 px-6">
      <h2 className="text-3xl font-bold text-center mb-6">Our Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
