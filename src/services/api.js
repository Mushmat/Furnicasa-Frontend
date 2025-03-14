// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'https://furnicasa.onrender.com/api';

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch products.');
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch product details.');
  }
};
