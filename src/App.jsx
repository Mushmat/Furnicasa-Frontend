import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/")
      .then((response) => {
        setMessage(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to fetch data from the server.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {loading ? (
        <h1 className="text-4xl font-bold text-yellow-500 animate-pulse">Loading...</h1>
      ) : error ? (
        <h1 className="text-4xl font-bold text-red-500">{error}</h1>
      ) : (
        <h1 className="text-4xl font-bold text-blue-600">{message}</h1>
      )}
    </div>
  );
}

export default App;
