import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const useFetch = (endpoint) => {
  const [data, setData] = useState({
    data: null,
    error: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      setTimeout(async () => {
        const response = await axios.get(`${BASE_URL}${endpoint}`);
        const responseData = response.data;
        setData({ data: responseData, error: null });
        setLoading(false);
      }, 2000);
    } catch (error) {
      setData({ data: null, error: error });
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    console.log(data.data);
    console.log(data.error);
  }, [data.data, data.error]);

  return { data, loading };
};

export default useFetch;