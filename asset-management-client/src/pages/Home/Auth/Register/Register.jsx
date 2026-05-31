// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import useAuth from "../../../../hooks/useAuth";
// import SocialLogin from "../SocialLogin/SocialLogin";
// import axios from "axios";
// import useAxiosSecure from "../../../../hooks/useAxiosSecure";



// const Register = () => {
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const { registerUser, updateUserProfile } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const axiosSecure = useAxiosSecure();

//   const [loading, setLoading] = useState(false);

// const handleRegistration = async (data) => {
//   setLoading(true);

//   try {
//     // 1. Firebase register
//     const result = await registerUser(data.email, data.password);

//     // 2. Upload image
//     const formData = new FormData();
//     formData.append("image", data.photo[0]);

//     const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;
//     const imgRes = await axios.post(image_API_URL, formData);

//     const photoURL = imgRes.data.data.url;

//     // 3. Update Firebase profile
//     await updateUserProfile({
//       displayName: data.name,
//       photoURL,
//     });

//     // 4. IMPORTANT: wait for token update
//     const token = await result.user.getIdToken();

//     localStorage.setItem("accessToken", token);

//     // 5. Save to DB
//     const userInfo = {
//       email: data.email,
//       name: data.name,
//       photoURL,
//       uid: result.user.uid,
//       role: "employee",
//       createdAt: new Date().toISOString(),
//     };

//     const res = await axios.post("http://localhost:5000/users", userInfo, {
//       headers: {
//         authorization: `Bearer ${token}`,
//       },
//     });

//     console.log("DB SAVE RESPONSE:", res.data);

//     navigate(location.state?.from?.pathname || "/", { replace: true });

//   } catch (error) {
//     console.log("REG ERROR:", error);
//     alert(error.message || "Registration failed");
//   } finally {
//     setLoading(false);
//   }
// };
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">

//       {/* CARD */}
//       <div className="w-full max-w-md bg-base-100 shadow-2xl rounded-2xl p-6 md:p-8">

//         {/* HEADER */}
//         <div className="text-center mb-6">
//           <h2 className="text-3xl font-bold text-base-content">
//             Create Account
//           </h2>
//           <p className="text-sm text-gray-500 mt-1">
//             Join AssetVerse and manage assets easily
//           </p>
//         </div>

//         <form onSubmit={handleSubmit(handleRegistration)} className="space-y-4">

//           {/* NAME */}
//           <div>
//             <label className="label">
//               <span className="label-text font-medium">Full Name</span>
//             </label>
//             <input
//               type="text"
//               {...register("name", { required: "Name is required" })}
//               className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
//               placeholder="John Doe"
//               disabled={loading}
//             />
//             {errors.name && (
//               <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
//             )}
//           </div>

//           {/* PHOTO */}
//           <div>
//             <label className="label">
//               <span className="label-text font-medium">Profile Photo</span>
//             </label>
//             <input
//               type="file"
//               accept="image/*"
//               {...register("photo", { required: "Photo is required" })}
//               className="file-input file-input-bordered w-full"
//               disabled={loading}
//             />
//             {errors.photo && (
//               <p className="text-red-500 text-xs mt-1">{errors.photo.message}</p>
//             )}
//           </div>

//           {/* EMAIL */}
//           <div>
//             <label className="label">
//               <span className="label-text font-medium">Email</span>
//             </label>
//             <input
//               type="email"
//               {...register("email", { required: "Email is required" })}
//               className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
//               placeholder="example@gmail.com"
//               disabled={loading}
//             />
//             {errors.email && (
//               <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
//             )}
//           </div>

//           {/* PASSWORD */}
//           <div>
//             <label className="label">
//               <span className="label-text font-medium">Password</span>
//             </label>
//             <input
//               type="password"
//               {...register("password", {
//                 required: "Password is required",
//                 minLength: { value: 6, message: "Minimum 6 characters" },
//               })}
//               className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
//               placeholder="••••••"
//               disabled={loading}
//             />
//             {errors.password && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.password.message}
//               </p>
//             )}
//           </div>

//           {/* BUTTON */}
//           <button
//             type="submit"
//             className="btn btn-primary w-full mt-2"
//             disabled={loading}
//           >
//             {loading ? (
//               <span className="loading loading-spinner"></span>
//             ) : (
//               "Create Account"
//             )}
//           </button>

//           {/* LOGIN LINK */}
//           <p className="text-center text-sm mt-3">
//             Already have account?{" "}
//             <Link to="/login" className="text-primary font-semibold">
//               Login
//             </Link>
//           </p>

//           {/* SOCIAL LOGIN */}
//           <div className="divider">OR</div>
//           <SocialLogin />

//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;



import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import useAuth from "../../../../hooks/useAuth";
import SocialLogin from "../SocialLogin/SocialLogin";

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { registerUser, updateUserProfile } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleRegistration = async (data) => {
    setLoading(true);
    setServerError("");

    try {
      // =========================
      // 1. CREATE FIREBASE USER
      // =========================
      const result = await registerUser(data.email, data.password);

      // =========================
      // 2. IMAGE UPLOAD
      // =========================
      let photoURL = "";

      if (data.photo?.[0]) {
        const formData = new FormData();
        formData.append("image", data.photo[0]);

        const imageAPI = `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_image_host_key
        }`;

        const imageRes = await axios.post(imageAPI, formData);

        photoURL = imageRes.data.data.url;
      }

      // =========================
      // 3. UPDATE FIREBASE PROFILE
      // =========================
      await updateUserProfile({
        displayName: data.name,
        photoURL,
      });

      // =========================
      // 4. GET FIREBASE TOKEN
      // =========================
      const token = await result.user.getIdToken();

      // =========================
      // 5. USER DATA
      // =========================
      const userInfo = {
        uid: result.user.uid,
        name: data.name,
        email: data.email,
        photoURL,

        role: "employee",

        // MULTI COMPANY SUPPORT
        companies: [],

        // OPTIONAL CURRENT ACTIVE COMPANY
        activeCompany: null,

        // ASSET HISTORY SUPPORT
        totalRequestedAssets: 0,
        totalApprovedAssets: 0,

        // ACCOUNT STATUS
        status: "active",

        createdAt: new Date().toISOString(),
      };

      // =========================
      // 6. SAVE USER TO DATABASE
      // =========================
      const saveUser = await axios.post(
        "http://localhost:5000/users",
        userInfo,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(saveUser.data);

      // =========================
      // 7. RESET + NAVIGATE
      // =========================
      reset();

      navigate(location.state?.from?.pathname || "/", {
        replace: true,
      });
    } catch (error) {
      console.log(error);

      if (error.message.includes("email-already-in-use")) {
        setServerError("This email is already registered.");
      } else {
        setServerError(error.message || "Registration Failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-base-100 shadow-2xl rounded-2xl p-6 md:p-8">
        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Create Employee Account</h2>

          <p className="text-sm text-gray-500 mt-2">
            Join your company and manage assets easily
          </p>
        </div>

        {/* ERROR */}
        {serverError && (
          <div className="alert alert-error mb-4 text-sm">
            {serverError}
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit(handleRegistration)}
          className="space-y-4"
        >
          {/* NAME */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                Full Name
              </span>
            </label>

            <input
              type="text"
              placeholder="John Doe"
              className="input input-bordered w-full"
              disabled={loading}
              {...register("name", {
                required: "Name is required",
              })}
            />

            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* PHOTO */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                Profile Photo
              </span>
            </label>

            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              disabled={loading}
              {...register("photo", {
                required: "Photo is required",
              })}
            />

            {errors.photo && (
              <p className="text-red-500 text-xs mt-1">
                {errors.photo.message}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                Email
              </span>
            </label>

            <input
              type="email"
              placeholder="example@gmail.com"
              className="input input-bordered w-full"
              disabled={loading}
              {...register("email", {
                required: "Email is required",
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                Password
              </span>
            </label>

            <input
              type="password"
              placeholder="******"
              className="input input-bordered w-full"
              disabled={loading}
              {...register("password", {
                required: "Password is required",

                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },

                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                  message:
                    "Must contain uppercase, lowercase and number",
                },
              })}
            />

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full mt-2"
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Create Account"
            )}
          </button>

          {/* LOGIN */}
          <p className="text-center text-sm pt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold"
            >
              Login
            </Link>
          </p>

          {/* SOCIAL LOGIN */}
          <div className="divider">OR</div>

          <SocialLogin />
        </form>
      </div>
    </div>
  );
};

export default Register;