import { useEffect, useState } from 'react';
import axios from 'axios';

export function useManager({ limit = 28 }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;

    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SUPPLIER_URL}?limit=${limit}`);
        if (!cancel) setData(response.data);
      } catch (error) {
        if (!cancel) setError(error);
      } finally {
        if (!cancel) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancel = true;
    };
  }, [limit]);

  return { data, error, loading };
}
