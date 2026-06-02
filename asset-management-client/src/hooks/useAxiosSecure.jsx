
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
 


  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,

});

const useAxiosSecure = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {

    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {

        if (user?.accessToken) {
          config.headers.authorization = `Bearer ${user.accessToken}`;

        } else {
          console.log("⚠️ টোকেন নেই!");
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;

        if (status === 401 || status === 403) {
          console.log("❌ Token expire");
          await logOut();
          navigate("/login", { replace: true });
        }

        return Promise.reject(error);
      }
    );


    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [user, logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
