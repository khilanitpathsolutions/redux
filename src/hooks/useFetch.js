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
    try {
      const response = await axios.get(`${BASE_URL}${endpoint}`);
      const responseData = response.data;
      setData({ data: responseData, error: null });
    } catch (error) {
      setData({ data: null, error: error });   
    } finally {
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
