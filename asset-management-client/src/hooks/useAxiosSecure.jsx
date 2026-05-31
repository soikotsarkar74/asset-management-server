// import axios from "axios";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import useAuth from "./useAuth";

// const axiosSecure = axios.create({
//   baseURL: "http://localhost:5000",
// });

// const useAxiosSecure = () => {
//   const { user, logOut } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {

//     const reqInterceptor = axiosSecure.interceptors.request.use((config) => {
//       if (user?.accessToken) {
//         config.headers.authorization = `Bearer ${user.accessToken}`;
//       }

//       return config;
//     });



//     const resInterceptor = axiosSecure.interceptors.response.use(
//       (response) => response,
//       async (error) => {
      

//         const statusCode = error.response?.status;


//         if (statusCode === 401) {
//           await logOut();
//           navigate("/login", { replace: true });
//         }


//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       axiosSecure.interceptors.request.eject(reqInterceptor);
//       axiosSecure.interceptors.response.eject(resInterceptor);
//     };
//   }, [user, logOut, navigate]);

//   return axiosSecure;
// };

// export default useAxiosSecure;

// hooks/useAxiosSecure.js
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
  
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
    
        if (user?.accessToken) {
          config.headers.authorization = `Bearer ${user.accessToken}`;
          console.log("✅ টোকেন যোগ করা হয়েছে:", user.accessToken.substring(0, 30));
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

// import axios from "axios";
// import { getAuth, signOut } from "firebase/auth";
// import { useEffect } from "react";
// const axiosSecure = axios.create({
//   baseURL: 'http://localhost:5000'
 
// });

// const useAxiosSecure = () => {
//   const auth = getAuth();

//   useEffect(() => {

//     const requestInterceptor = axiosSecure.interceptors.request.use(
//       async (config) => {
//         const user = auth.currentUser;
//         if (user) {
//           const token = await user.getIdToken(true);
//           config.headers.authorization = `Bearer ${token}`;
//         }
//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     const responseInterceptor = axiosSecure.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         if (
//           error.response &&
//           (error.response.status === 401 || error.response.status === 403)
//         ) {
//           await signOut(auth);
//           window.location.href = "/login";
//         }
//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       axiosSecure.interceptors.request.eject(requestInterceptor);
//       axiosSecure.interceptors.response.eject(responseInterceptor);
//     };
//   }, [auth]);

//   return axiosSecure;
// };

// export default useAxiosSecure;



// import axios from "axios";
// import { auth } from "../firebase/firebase.init";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import useAuth from "./useAuth";

// const axiosSecure = axios.create({
//   baseURL: "http://localhost:5000",
// });

// const useAxiosSecure = () => {
//   const { logOut } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {

//     const requestInterceptor =
//       axiosSecure.interceptors.request.use(
//         async (config) => {

//           const user = auth.currentUser;

//           console.log("🔥 CURRENT USER:", user);

//           if (user) {

//             const token =
//               await user.getIdToken();

//             console.log("🔥 TOKEN:", token);

//             config.headers = {
//               ...config.headers,
//               Authorization: `Bearer ${token}`,
//             };
//           }

//           return config;
//         }
//       );

//     const responseInterceptor =
//       axiosSecure.interceptors.response.use(
//         (response) => response,

//         async (error) => {

//           const status =
//             error.response?.status;

//           if (status === 401 || status === 403) {

//             await logOut();

//             navigate("/login", {
//               replace: true,
//             });
//           }

//           return Promise.reject(error);
//         }
//       );



//     return () => {

//       axiosSecure.interceptors.request.eject(
//         requestInterceptor
//       );

//       axiosSecure.interceptors.response.eject(
//         responseInterceptor
//       );
//     };

//   }, [logOut, navigate]);

//   return axiosSecure;
// };

// export default useAxiosSecure;

// import axios from "axios";
// import { auth } from "../firebase/firebase.init";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import useAuth from "./useAuth";

// const axiosSecure = axios.create({
//   baseURL: "http://localhost:5000",
// });

// const useAxiosSecure = () => {
//   const { logOut } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const requestInterceptor = axiosSecure.interceptors.request.use(
//       async (config) => {
//         const user = auth.currentUser;

//         if (user) {
//           const token = await user.getIdToken();

//           // ✅ IMPORTANT FIX HERE
//           config.headers = config.headers || {};
//           config.headers["Authorization"] = `Bearer ${token}`;
//         }

//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     const responseInterceptor = axiosSecure.interceptors.response.use(
//       (res) => res,
//       async (error) => {
//         const status = error.response?.status;

//         if (status === 401 || status === 403) {
//           await logOut();
//           navigate("/login", { replace: true });
//         }

//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       axiosSecure.interceptors.request.eject(requestInterceptor);
//       axiosSecure.interceptors.response.eject(responseInterceptor);
//     };
//   }, [logOut, navigate]);

//   return axiosSecure;
// };

// export default useAxiosSecure;

// import axios from "axios";
// import { auth } from "../firebase/firebase.init";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import useAuth from "./useAuth";


// const axiosSecure = axios.create({
//   baseURL: "http://localhost:5000",
// });

// const useAxiosSecure = () => {
//   //const { logOut } = useAuth();
//   const navigate = useNavigate();
//  const {logOut} = useAuth();

//   useEffect(() => {
//     const interceptor = axiosSecure.interceptors.request.use(
//       async (config) => {
//         const user = auth.currentUser;

//         if (user) {
//           const token = await user.getIdToken();

//           // 🔥 IMPORTANT: lowercase header (BEST PRACTICE)
//           config.headers = {
//             ...config.headers,
//             authorization: `Bearer ${token}`,
//           };

//           console.log("🔥 SENDING HEADERS:", config.headers);
//         }

//         return config;
//       }
//     );

//     return () => {
//       axiosSecure.interceptors.request.eject(interceptor);
//     };
//   }, []);

//   return axiosSecure;
// };

// export default useAxiosSecure;