const Home = () => {
    return (
      <section>
        <h1>Discover Furniture Collections</h1>
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Featured Categories</h2>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-700">Chairs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-700">Sofas</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-700">Desks</p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default Home;
  