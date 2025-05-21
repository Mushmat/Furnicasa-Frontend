import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const LoadingContext = createContext();
export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  /* central on/off switch */
  const [loading, setLoading] = useState(false);
  const show  = () => setLoading(true);
  const hide  = () => setLoading(false);

  /* wire into every Axios request */
  useEffect(() => {
    const reqId = axios.interceptors.request.use((config) => {
      show();
      return config;
    });
    const resId = axios.interceptors.response.use(
      (res) => {
        hide();
        return res;
      },
      (err) => {
        hide();
        return Promise.reject(err);
      }
    );
    return () => {
      axios.interceptors.request.eject(reqId);
      axios.interceptors.response.eject(resId);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, show, hide }}>
      {children}
    </LoadingContext.Provider>
  );
};
