import ProductCard from "../components/ProductCard";

const Home = () => {
  const featuredProducts = [
    { name: "Wooden Chair", price: 49.99, imageUrl: "/images/chair.jpg" },
    { name: "Modern Sofa", price: 399.99, imageUrl: "/images/sofa.jpg" },
    { name: "Glass Dining Table", price: 599.99, imageUrl: "/images/table.jpg" },
  ];

  return (
    <div className="mt-16 px-6">
      <h2 className="text-3xl font-bold text-center mb-6">Featured Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
