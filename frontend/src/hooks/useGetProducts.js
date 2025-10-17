import { useEffect, useState } from 'react';
import axios from 'axios';

export function useGetProducts({ limit = 28 }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const url = import.meta.env.VITE_SUPPLIER_URL;

  useEffect(() => {
    let cancel = false;

    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/?limit=${limit}`); // ! o backend não tem suporte para isto, deve ser ajustado
        console.log(response.data)
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
  }, [url, limit]);

  return { data, error, loading };
}
