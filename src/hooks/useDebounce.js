import { useState, useEffect } from "react";

const useDebounce = (initialValue = "", delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const [timer, setTimer] = useState(null);

  const debounce= (value) => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    setTimer(newTimer);
    console.log(`Debounced by ${delay} ms`);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line
  }, []);

  return [debouncedValue, debounce];
};

export default useDebounce;
