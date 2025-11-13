import { useEffect, useState } from 'react';
import axios from 'axios';

const electronicCategories = [
  'smartphones',
  'laptops',
  'mobile-accessories',
  'tablets',
  'mens-watches',
  'womens-watches',
];

export function useManager() {
  const [data, setData] = useState({ products: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;

    const fetchData = async () => {
      try {
        const categoryRequests = electronicCategories.map(category =>
          axios.get(`${import.meta.env.VITE_SUPPLIER_URL}/category/${category}`)
        );

        const responses = await Promise.all(categoryRequests);
        const allProducts = responses.flatMap(response => response.data.products);

        if (!cancel) {
          setData({ products: allProducts });
        }
      } catch (error) {
        if (!cancel) {
          setError(error);
        }
      } finally {
        if (!cancel) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancel = true;
    };
  }, []);

  return { data, error, loading };
}
