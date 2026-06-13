// JoinHR.jsx - ফাংশনের নাম ঠিক করুন
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaUserTie,
} from "react-icons/fa";

import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const JoinHR = () => {
  // 👇 ফাংশনের নাম ঠিক করুন (registerUser, signIn)
  const { 
    registerUser,      // ✅ createUser এর পরিবর্তে registerUser
    updateUserProfile, 
    googleLogin,
    signIn             // ✅ loginUser এর পরিবর্তে signIn
  } = useAuth();

  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      console.log("Starting registration for:", data.email);
      
      // 👇 registerUser ব্যবহার করুন
      const result = await registerUser(data.email, data.password);
      console.log("User created:", result.user.uid);

      // 👇 প্রোফাইল আপডেট করুন
      await updateUserProfile({
        displayName: data.name,
        photoURL: data.companyLogo
      });
      console.log("Profile updated");

      // ডাটাবেজে সেভ করুন
      const hrData = {
        uid: result.user.uid,
        name: data.name,
        email: data.email,
        companyName: data.companyName,
        companyLogo: data.companyLogo,
        dateOfBirth: data.dateOfBirth,
        role: "hr",
        packageLimit: 5,
        currentEmployees: 0,
        subscription: "basic",
        createdAt: new Date(),
      };

      const response = await axiosSecure.post("/users", hrData);
      console.log("Saved to database:", response.data);

      Swal.fire({
        icon: "success",
        title: "HR Registration Successful!",
        text: "Welcome to AssetVerse!",
        timer: 2000,
        showConfirmButton: false,
      });

      reset();
      setLogoPreview("");
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Registration error:", error);
      
      let errorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please login instead.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      }
      
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const result = await googleLogin();
      console.log("Google login success:", result.user.email);

      const userInfo = {
        uid: result.user.uid,
        name: result.user.displayName || result.user.email.split('@')[0],
        email: result.user.email,
        photoURL: result.user.photoURL || "",
        role: "hr",
        packageLimit: 5,
        currentEmployees: 0,
        subscription: "basic",
        createdAt: new Date(),
      };

      await axiosSecure.post("/users", userInfo);

      Swal.fire({
        icon: "success",
        title: "Google Login Successful!",
        text: "Welcome to AssetVerse!",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/dashboard");
      
    } catch (error) {
      console.error("Google login error:", error);
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-3xl">
        <div className="card bg-base-100 shadow-2xl border">
          <div className="card-body p-8">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <FaUserTie className="text-5xl text-primary" />
              </div>
              <h2 className="text-4xl font-bold">Join as HR Manager</h2>
              <p className="text-gray-500 mt-2">
                Create your company workspace and manage employees efficiently.
              </p>
            </div>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              className="btn btn-outline w-full"
              disabled={loading}
            >
              <FaGoogle />
              Continue with Google
            </button>

            <div className="divider">OR REGISTER WITH EMAIL</div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Full Name */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input input-bordered"
                  {...register("name", { required: "Full name is required" })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Company Name */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-medium">Company Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Google Inc."
                  className="input input-bordered"
                  {...register("companyName", { required: "Company name is required" })}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
                )}
              </div>

              {/* Company Logo URL */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-medium">Company Logo URL</span>
                </label>
                <input
                  type="text"
                  placeholder="https://logo.png"
                  className="input input-bordered"
                  {...register("companyLogo", { required: "Company logo is required" })}
                  onChange={(e) => setLogoPreview(e.target.value)}
                />
                {logoPreview && (
                  <div className="mt-3 flex justify-center">
                    <img
                      src={logoPreview}
                      alt="Company Logo"
                      className="h-24 w-24 rounded-xl border object-cover"
                    />
                  </div>
                )}
                {errors.companyLogo && (
                  <p className="text-red-500 text-sm mt-1">{errors.companyLogo.message}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-medium">Date of Birth</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  {...register("dateOfBirth", { required: "Date of birth is required" })}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-medium">Email Address</span>
                </label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  className="input input-bordered"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="input input-bordered w-full"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Minimum 6 characters required",
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                        message: "Must contain uppercase, lowercase and number",
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Join as HR"
                )}
              </button>
            </form>

            <p className="text-center mt-6">
              Already have an account?
              <Link to="/login" className="text-primary font-semibold ml-2">
                Login
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinHR;


// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import useAuth from "../../../hooks/useAuth";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";

// const JoinHR = () => {
//   const { register, handleSubmit } = useForm();
//   const { registerUser, updateUserProfile } = useAuth();
//   const axiosSecure = useAxiosSecure();

//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleJoinHr = async (data) => {
//     setLoading(true);

//     try {
//       // 1️⃣ Firebase create user
//       const result = await registerUser(data.email, data.password);
//       const user = result.user;

//       // 2️⃣ token
//       const token = await user.getIdToken(true);

//       // 3️⃣ upload image
//       const formData = new FormData();
//       formData.append("image", data.photo[0]);

//       const imgRes = await axios.post(
//         `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
//         formData
//       );

//       const photoURL = imgRes.data.data.url;

//       // 4️⃣ update firebase profile
//       await updateUserProfile({
//         displayName: data.name,
//         photoURL,
//       });

//       // 5️⃣ HR user object
//       const hrUser = {
//         email: data.email,
//         displayName: data.name,
//         photoURL,
//         uid: user.uid,
//         role: "hr",
//         company: data.company || "",
//         createdAt: new Date().toISOString(),
//       };

//       // 6️⃣ save to DB (secure)
//       await axiosSecure.post("/users", hrUser, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       // 7️⃣ redirect
//       navigate(location.state?.from?.pathname || "/dashboard", {
//         replace: true,
//       });

//     } catch (error) {
//       console.log(error);

//       if (error.code === "auth/email-already-in-use") {
//         alert("এই email আগে থেকেই ব্যবহার করা হয়েছে");
//       } else {
//         alert("HR create failed");
//       }

//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <form
//         onSubmit={handleSubmit(handleJoinHr)}
//         className="p-6 shadow-xl rounded-lg w-96 space-y-3"
//       >

//         <h2 className="text-xl font-bold text-center">Join as HR</h2>

//         <input
//           {...register("name", { required: true })}
//           placeholder="Full Name"
//           className="input input-bordered w-full"
//         />

//         <input
//           {...register("company")}
//           placeholder="Company Name"
//           className="input input-bordered w-full"
//         />

//         <input
//           type="file"
//           {...register("photo", { required: true })}
//           className="file-input file-input-bordered w-full"
//         />

//         <input
//           type="email"
//           {...register("email", { required: true })}
//           placeholder="Email"
//           className="input input-bordered w-full"
//         />

//         <input
//           type="password"
//           {...register("password", { required: true, minLength: 6 })}
//           placeholder="Password"
//           className="input input-bordered w-full"
//         />

//         <button
//           disabled={loading}
//           className="btn btn-primary w-full"
//         >
//           {loading ? "Creating..." : "Join HR"}
//         </button>

//       </form>
//     </div>
//   );
// };

// export default JoinHR;