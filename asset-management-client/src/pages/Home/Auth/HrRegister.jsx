// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import useAuth from "../../../hooks/useAuth";

// const HrRegister = () => {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();

//   const { registerUser, updateUserProfile } = useAuth();

//   const navigate = useNavigate();
//   const location = useLocation();

//   const [loading, setLoading] = useState(false);
//   const [serverError, setServerError] = useState("");

//   const handleHRRegistration = async (data) => {
//     setLoading(true);
//     setServerError("");

//     try {
//       // =========================
//       // FIREBASE REGISTER
//       // =========================
//       const result = await registerUser(
//         data.email,
//         data.password
//       );

//       // =========================
//       // IMAGE UPLOAD
//       // =========================
//       let logoURL = "";

//       if (data.companyLogo?.[0]) {
//         const formData = new FormData();

//         formData.append("image", data.companyLogo[0]);

//         const imageAPI = `https://api.imgbb.com/1/upload?key=${
//           import.meta.env.VITE_image_host_key
//         }`;

//         const imageRes = await axios.post(
//           imageAPI,
//           formData
//         );

//         logoURL = imageRes.data.data.url;
//       }

//       // =========================
//       // UPDATE FIREBASE PROFILE
//       // =========================
//       await updateUserProfile({
//         displayName: data.hrName,
//         photoURL: logoURL,
//       });

//       // =========================
//       // GET TOKEN
//       // =========================
//       const token = await result.user.getIdToken();

//       // =========================
//       // COMPANY DATA
//       // =========================
//       const companyInfo = {
//         companyName: data.companyName,

//         companyLogo: logoURL,

//         companyEmail: data.email,

//         hrName: data.hrName,

//         hrEmail: data.email,

//         package: {
//           packageName: "Starter",

//           employeeLimit: 5,

//           price: 0,
//         },

//         currentEmployees: 0,

//         createdAt: new Date().toISOString(),
//       };

//       // =========================
//       // USER DATA
//       // =========================
//       const userInfo = {
//         uid: result.user.uid,

//         name: data.hrName,

//         email: data.email,

//         photoURL: logoURL,

//         role: "hr",

//         companyName: data.companyName,

//         companyLogo: logoURL,

//         companyId: null,

//         status: "active",

//         createdAt: new Date().toISOString(),
//       };

//       // =========================
//       // SAVE COMPANY
//       // =========================
//       const companyRes = await axios.post(
//         "http://localhost:5000/companies",
//         companyInfo,
//         {
//           headers: {
//             authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // =========================
//       // ADD COMPANY ID TO USER
//       // =========================
//       userInfo.companyId =
//         companyRes.data.insertedId;

//       // =========================
//       // SAVE USER
//       // =========================
//       await axios.post(
//         "http://localhost:5000/users",
//         userInfo,
//         {
//           headers: {
//             authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       reset();

//       navigate(
//         location.state?.from?.pathname || "/",
//         {
//           replace: true,
//         }
//       );
//     } catch (error) {
//       console.log(error);

//       if (
//         error.message.includes(
//           "email-already-in-use"
//         )
//       ) {
//         setServerError(
//           "This email is already registered."
//         );
//       } else {
//         setServerError(
//           error.message || "Registration Failed"
//         );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
//       <div className="w-full max-w-lg bg-base-100 shadow-2xl rounded-2xl p-6 md:p-8">
//         <div className="text-center mb-6">
//           <h2 className="text-3xl font-bold">
//             HR Registration
//           </h2>

//           <p className="text-sm text-gray-500 mt-2">
//             Create company and manage employees
//           </p>
//         </div>

//         {serverError && (
//           <div className="alert alert-error mb-4 text-sm">
//             {serverError}
//           </div>
//         )}

//         <form
//           onSubmit={handleSubmit(
//             handleHRRegistration
//           )}
//           className="space-y-4"
//         >
//           {/* HR NAME */}
//           <div>
//             <label className="label">
//               <span className="label-text">
//                 HR Name
//               </span>
//             </label>

//             <input
//               type="text"
//               className="input input-bordered w-full"
//               placeholder="John Doe"
//               {...register("hrName", {
//                 required: "HR name is required",
//               })}
//             />

//             {errors.hrName && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.hrName.message}
//               </p>
//             )}
//           </div>

//           {/* COMPANY NAME */}
//           <div>
//             <label className="label">
//               <span className="label-text">
//                 Company Name
//               </span>
//             </label>

//             <input
//               type="text"
//               className="input input-bordered w-full"
//               placeholder="Tech Corp"
//               {...register("companyName", {
//                 required:
//                   "Company name is required",
//               })}
//             />

//             {errors.companyName && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.companyName.message}
//               </p>
//             )}
//           </div>

//           {/* COMPANY LOGO */}
//           <div>
//             <label className="label">
//               <span className="label-text">
//                 Company Logo
//               </span>
//             </label>

//             <input
//               type="file"
//               accept="image/*"
//               className="file-input file-input-bordered w-full"
//               {...register("companyLogo", {
//                 required:
//                   "Company logo is required",
//               })}
//             />

//             {errors.companyLogo && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.companyLogo.message}
//               </p>
//             )}
//           </div>

//           {/* EMAIL */}
//           <div>
//             <label className="label">
//               <span className="label-text">
//                 Email
//               </span>
//             </label>

//             <input
//               type="email"
//               className="input input-bordered w-full"
//               placeholder="hr@company.com"
//               {...register("email", {
//                 required: "Email is required",
//               })}
//             />

//             {errors.email && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.email.message}
//               </p>
//             )}
//           </div>

//           {/* PASSWORD */}
//           <div>
//             <label className="label">
//               <span className="label-text">
//                 Password
//               </span>
//             </label>

//             <input
//               type="password"
//               className="input input-bordered w-full"
//               placeholder="******"
//               {...register("password", {
//                 required: "Password is required",

//                 minLength: {
//                   value: 6,
//                   message:
//                     "Minimum 6 characters",
//                 },
//               })}
//             />

//             {errors.password && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.password.message}
//               </p>
//             )}
//           </div>

//           {/* PACKAGE INFO */}
//           <div className="bg-base-200 rounded-xl p-4">
//             <h3 className="font-bold mb-2">
//               Default Package
//             </h3>

//             <p className="text-sm">
//               Package: Starter
//             </p>

//             <p className="text-sm">
//               Employee Limit: 5
//             </p>

//             <p className="text-sm">
//               Price: $0
//             </p>
//           </div>

//           <button
//             type="submit"
//             className="btn btn-primary w-full"
//             disabled={loading}
//           >
//             {loading ? (
//               <span className="loading loading-spinner"></span>
//             ) : (
//               "Create HR Account"
//             )}
//           </button>

//           <p className="text-center text-sm">
//             Already have an account?{" "}
//             <Link
//               to="/login"
//               className="text-primary font-semibold"
//             >
//               Login
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default HrRegister;


import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";

const HrRegister = () => {
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

  const handleHRRegistration = async (data) => {
    setLoading(true);
    setServerError("");

    try {
 
      const result = await registerUser(data.email, data.password);

      let logoURL = "";

      if (data.companyLogo?.[0]) {
        const formData = new FormData();
        formData.append("image", data.companyLogo[0]);

        const imageAPI = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;
        const imageRes = await axios.post(imageAPI, formData);
        logoURL = imageRes.data.data.url;
      }


      await updateUserProfile({
        displayName: data.hrName,
        photoURL: logoURL,
      });


      const token = await result.user.getIdToken();



      const userInfo = {
        name: data.hrName,
        email: data.email,
        role: "admin", 
        companyName: data.companyName,
        companyLogo: logoURL,
        packageLimit: 5,
        currentEmployees: 0,
        subscription: "basic",
        status: "active",
        dateOfBirth: data.dateOfBirth || null,
        profileImage: logoURL,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

  
      const userRes = await axios.post(
        "http://localhost:5000/users",
        userInfo,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("User saved with company info:", userRes.data);

      reset();
      navigate(location.state?.from?.pathname || "/", {
        replace: true,
      });
      
    } catch (error) {
      console.log("Registration Error:", error);
      
      if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else if (error.message.includes("email-already-in-use")) {
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
      <div className="w-full max-w-lg bg-base-100 shadow-2xl rounded-2xl p-6 md:p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">HR Registration</h2>
          <p className="text-sm text-gray-500 mt-2">
            Create company and manage employees
          </p>
        </div>

        {serverError && (
          <div className="alert alert-error mb-4 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(handleHRRegistration)} className="space-y-4">
          
          {/* HR NAME */}
          <div>
            <label className="label">
              <span className="label-text">HR Name *</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="John Doe"
              {...register("hrName", {
                required: "HR name is required",
              })}
            />
            {errors.hrName && (
              <p className="text-red-500 text-xs mt-1">{errors.hrName.message}</p>
            )}
          </div>

          {/* COMPANY NAME */}
          <div>
            <label className="label">
              <span className="label-text">Company Name *</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Tech Corp"
              {...register("companyName", {
                required: "Company name is required",
              })}
            />
            {errors.companyName && (
              <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>
            )}
          </div>

          {/* COMPANY LOGO */}
          <div>
            <label className="label">
              <span className="label-text">Company Logo *</span>
            </label>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              {...register("companyLogo", {
                required: "Company logo is required",
              })}
            />
            {errors.companyLogo && (
              <p className="text-red-500 text-xs mt-1">{errors.companyLogo.message}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="label">
              <span className="label-text">Email *</span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full"
              placeholder="hr@company.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="label">
              <span className="label-text">Password *</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              placeholder="******"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* DATE OF BIRTH (Optional) */}
          <div>
            <label className="label">
              <span className="label-text">Date of Birth (Optional)</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              {...register("dateOfBirth")}
            />
          </div>

          {/* PACKAGE INFO */}
          <div className="bg-base-200 rounded-xl p-4">
            <h3 className="font-bold mb-2">Default Package</h3>
            <p className="text-sm">📦 Package: Starter (Basic)</p>
            <p className="text-sm">👥 Employee Limit: 5 employees</p>
            <p className="text-sm">💰 Price: $0 (Free)</p>
            <p className="text-xs text-gray-500 mt-2">
              ✅ Asset Tracking<br />
              ✅ Employee Management<br />
              ✅ Basic Support
            </p>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Create HR Account"
            )}
          </button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default HrRegister;

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import useAuth from "../../../hooks/useAuth";
// import { toast } from "react-hot-toast";

// const HrRegister = () => {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();

//   const { registerUser, updateUserProfile } = useAuth();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);
//   const [serverError, setServerError] = useState("");

//   const handleHRRegistration = async (data) => {
//     setLoading(true);
//     setServerError("");
    
//     // Loading toast
//     const loadingToast = toast.loading("Creating HR account...");

//     try {
//       // =========================
//       // 1. FIREBASE REGISTER
//       // =========================
//       const result = await registerUser(data.email, data.password);
//       console.log("✅ Firebase user created:", result.user.uid);

//       // =========================
//       // 2. UPLOAD COMPANY LOGO TO IMGBB
//       // =========================
//       let logoURL = "";
//       if (data.companyLogo && data.companyLogo[0]) {
//         const formData = new FormData();
//         formData.append("image", data.companyLogo[0]);

//         const imageAPI = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;
//         const imageRes = await axios.post(imageAPI, formData);
//         logoURL = imageRes.data.data.url;
//         console.log("✅ Logo uploaded:", logoURL);
//       }

//       // =========================
//       // 3. UPDATE FIREBASE PROFILE
//       // =========================
//       await updateUserProfile({
//         displayName: data.hrName,
//         photoURL: logoURL || "https://via.placeholder.com/150",
//       });
//       console.log("✅ Firebase profile updated");

//       // =========================
//       // 4. GET FIREBASE TOKEN
//       // =========================
//       const token = await result.user.getIdToken(true); // Force refresh
//       console.log("✅ Token obtained");

//       // =========================
//       // 5. REGISTER HR IN BACKEND
//       // =========================
//       const hrData = {
//         name: data.hrName,
//         email: data.email,
//         company: data.companyName,
//         role: "hr",
//       };

//       const hrResponse = await axios.post(
//         `${import.meta.env.VITE_API_URL}/register-hr`,
//         hrData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!hrResponse.data.success) {
//         throw new Error(hrResponse.data.message || "Failed to register HR");
//       }
//       console.log("✅ HR registered in backend:", hrResponse.data);

//       // =========================
//       // 6. CREATE COMPANY
//       // =========================
//       const companyData = {
//         companyName: data.companyName,
//         companyLogo: logoURL || "https://via.placeholder.com/150",
//       };

//       const companyResponse = await axios.post(
//         `${import.meta.env.VITE_API_URL}/companies`,
//         companyData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("✅ Company created:", companyResponse.data);

//       // =========================
//       // 7. SAVE TO LOCALSTORAGE (Optional)
//       // =========================
//       localStorage.setItem("hrEmail", data.email);
//       localStorage.setItem("companyName", data.companyName);

//       // Success message
//       toast.success("HR Account Created Successfully!", {
//         id: loadingToast,
//       });

//       // Reset form
//       reset();

//       // Navigate to dashboard
//       setTimeout(() => {
//         navigate("/dashboard");
//       }, 1500);

//     } catch (error) {
//       console.error("❌ Registration Error:", error);
      
//       // Handle different error types
//       let errorMessage = "Registration failed. Please try again.";
      
//       if (error.response) {
//         // Server responded with error
//         console.log("Server error response:", error.response.data);
//         errorMessage = error.response.data.message || error.response.data.error || errorMessage;
//       } else if (error.request) {
//         // Request made but no response
//         console.log("No response from server");
//         errorMessage = "Server is not responding. Please check your connection.";
//       } else if (error.message.includes("email-already-in-use")) {
//         errorMessage = "This email is already registered. Please login instead.";
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       setServerError(errorMessage);
//       toast.error(errorMessage, {
//         id: loadingToast,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-10">
//       <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
//           <h2 className="text-3xl font-bold text-white text-center">
//             HR Registration
//           </h2>
//           <p className="text-blue-100 text-center mt-2">
//             Create your company account and start managing assets
//           </p>
//         </div>

//         {/* Form Body */}
//         <div className="p-8">
//           {serverError && (
//             <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//                 <span>{serverError}</span>
//               </div>
//             </div>
//           )}

//           <form onSubmit={handleSubmit(handleHRRegistration)} className="space-y-5">
//             {/* HR Personal Information */}
//             <div className="border-b border-gray-200 pb-4">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                 Personal Information
//               </h3>
              
//               {/* HR Name */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Full Name *
//                 </label>
//                 <input
//                   type="text"
//                   className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.hrName ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="John Doe"
//                   {...register("hrName", { 
//                     required: "HR name is required",
//                     minLength: {
//                       value: 2,
//                       message: "Name must be at least 2 characters"
//                     }
//                   })}
//                 />
//                 {errors.hrName && (
//                   <p className="text-red-500 text-xs mt-1">{errors.hrName.message}</p>
//                 )}
//               </div>

//               {/* Email */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Address *
//                 </label>
//                 <input
//                   type="email"
//                   className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.email ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="hr@company.com"
//                   {...register("email", { 
//                     required: "Email is required",
//                     pattern: {
//                       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                       message: "Invalid email address"
//                     }
//                   })}
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
//                 )}
//               </div>

//               {/* Password */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Password *
//                 </label>
//                 <input
//                   type="password"
//                   className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.password ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="••••••"
//                   {...register("password", {
//                     required: "Password is required",
//                     minLength: {
//                       value: 6,
//                       message: "Password must be at least 6 characters"
//                     },
//                     pattern: {
//                       value: /^(?=.*[A-Za-z])(?=.*\d)/,
//                       message: "Password must contain at least one letter and one number"
//                     }
//                   })}
//                 />
//                 {errors.password && (
//                   <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
//                 )}
//               </div>
//             </div>

//             {/* Company Information */}
//             <div className="border-b border-gray-200 pb-4">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                 Company Information
//               </h3>

//               {/* Company Name */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Company Name *
//                 </label>
//                 <input
//                   type="text"
//                   className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.companyName ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="Tech Corp Solutions"
//                   {...register("companyName", { 
//                     required: "Company name is required",
//                     minLength: {
//                       value: 2,
//                       message: "Company name must be at least 2 characters"
//                     }
//                   })}
//                 />
//                 {errors.companyName && (
//                   <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>
//                 )}
//               </div>

//               {/* Company Logo */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Company Logo *
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
//                     errors.companyLogo ? "border-red-500" : "border-gray-300"
//                   }`}
//                   {...register("companyLogo", { 
//                     required: "Company logo is required"
//                   })}
//                 />
//                 {errors.companyLogo && (
//                   <p className="text-red-500 text-xs mt-1">{errors.companyLogo.message}</p>
//                 )}
//                 <p className="text-xs text-gray-500 mt-1">
//                   Recommended: Square image, max 2MB
//                 </p>
//               </div>
//             </div>

//             {/* Package Information */}
//             <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
//               <h3 className="font-semibold text-blue-900 mb-3">✨ Starter Package (Free)</h3>
//               <div className="space-y-2 text-sm text-blue-800">
//                 <div className="flex items-center">
//                   <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                   <span>Up to 5 Employees</span>
//                 </div>
//                 <div className="flex items-center">
//                   <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                   <span>Basic Asset Management</span>
//                 </div>
//                 <div className="flex items-center">
//                   <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                   <span>Email Support</span>
//                 </div>
//               </div>
//               <div className="mt-3 pt-3 border-t border-blue-200">
//                 <p className="text-sm font-medium text-blue-900">Price: <span className="text-2xl font-bold">$0</span> / month</p>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={loading}
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center">
//                   <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                   </svg>
//                   Creating Account...
//                 </div>
//               ) : (
//                 "Create HR Account"
//               )}
//             </button>

//             {/* Login Link */}
//             <p className="text-center text-sm text-gray-600 mt-4">
//               Already have an account?{" "}
//               <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">
//                 Sign In
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HrRegister;