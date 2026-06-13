import axios from "axios";
import { auth } from "../firebase/firebase.init";

const axiosSecure = axios.create({
  // baseURL: 'asset-management-server-flax.vercel.app',
   //baseURL: import.meta.env.VITE_API_URL,
   http:'//localhost:5000',
  //withCredentials: true,
});

axiosSecure.interceptors.request.use(async (config) => {
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

export default axiosSecure;