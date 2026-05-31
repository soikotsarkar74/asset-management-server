// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Link, useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import useAuth from "../../../hooks/useAuth";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";


// const JoinHR = () => {
//   const { createUser, updateUserProfile } = useAuth();
//   const axiosSecure = useAxiosSecure();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);

//       // create firebase user
//       const result = await createUser(data.email, data.password);

//       // update profile
//       await updateUserProfile(data.name, data.companyLogo);

//       // HR user object
//       const hrData = {
//         name: data.name,
//         email: data.email,
//         companyName: data.companyName,
//         companyLogo: data.companyLogo,
//         dateOfBirth: data.dateOfBirth,
//         role: "hr",
//         packageLimit: 5,
//         currentEmployees: 0,
//         subscription: "basic",
//         createdAt: new Date(),
//       };

//       // save in database
//       await axiosSecure.post("/users", hrData);

//       Swal.fire({
//         icon: "success",
//         title: "HR Registration Successful",
//         showConfirmButton: false,
//         timer: 1500,
//       });

//       reset();
//       navigate("/dashboard");

//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: error.message,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-base-200 py-10 px-4">

//       <div className="card w-full max-w-2xl bg-base-100 shadow-xl">

//         <div className="card-body">

//           <h2 className="text-3xl font-bold text-center mb-6">
//             Join as HR Manager
//           </h2>

//           <form onSubmit={handleSubmit(onSubmit)}>

//             {/* Full Name */}
//             <div className="form-control mb-4">
//               <label className="label">
//                 <span className="label-text">Full Name</span>
//               </label>

//               <input
//                 type="text"
//                 placeholder="Enter your full name"
//                 className="input input-bordered"
//                 {...register("name", {
//                   required: "Name is required",
//                 })}
//               />

//               {errors.name && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.name.message}
//                 </p>
//               )}
//             </div>

//             {/* Company Name */}
//             <div className="form-control mb-4">
//               <label className="label">
//                 <span className="label-text">Company Name</span>
//               </label>

//               <input
//                 type="text"
//                 placeholder="Company name"
//                 className="input input-bordered"
//                 {...register("companyName", {
//                   required: "Company name is required",
//                 })}
//               />

//               {errors.companyName && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.companyName.message}
//                 </p>
//               )}
//             </div>

//             {/* Company Logo */}
//             <div className="form-control mb-4">
//               <label className="label">
//                 <span className="label-text">Company Logo URL</span>
//               </label>

//               <input
//                 type="text"
//                 placeholder="https://example.com/logo.png"
//                 className="input input-bordered"
//                 {...register("companyLogo", {
//                   required: "Company logo is required",
//                 })}
//               />

//               {errors.companyLogo && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.companyLogo.message}
//                 </p>
//               )}
//             </div>

//             {/* Date of Birth */}
//             <div className="form-control mb-4">
//               <label className="label">
//                 <span className="label-text">Date of Birth</span>
//               </label>

//               <input
//                 type="date"
//                 className="input input-bordered"
//                 {...register("dateOfBirth", {
//                   required: "Date of birth is required",
//                 })}
//               />

//               {errors.dateOfBirth && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.dateOfBirth.message}
//                 </p>
//               )}
//             </div>

//             {/* Email */}
//             <div className="form-control mb-4">
//               <label className="label">
//                 <span className="label-text">Email</span>
//               </label>

//               <input
//                 type="email"
//                 placeholder="example@email.com"
//                 className="input input-bordered"
//                 {...register("email", {
//                   required: "Email is required",
//                 })}
//               />

//               {errors.email && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>

//             {/* Password */}
//             <div className="form-control mb-6">
//               <label className="label">
//                 <span className="label-text">Password</span>
//               </label>

//               <input
//                 type="password"
//                 placeholder="Minimum 6 characters"
//                 className="input input-bordered"
//                 {...register("password", {
//                   required: "Password is required",
//                   minLength: {
//                     value: 6,
//                     message: "Password must be at least 6 characters",
//                   },
//                 })}
//               />

//               {errors.password && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="btn btn-primary w-full"
//             >
//               {loading ? "Registering..." : "Join as HR"}
//             </button>

//           </form>

//           <p className="text-center mt-5">
//             Already have an account?{" "}
//             <Link to="/login" className="text-primary font-semibold">
//               Login
//             </Link>
//           </p>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default JoinHR;


import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const JoinHR = () => {
  const { register, handleSubmit } = useForm();
  const { registerUser, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleJoinHr = async (data) => {
    setLoading(true);

    try {
      // 1️⃣ Firebase create user
      const result = await registerUser(data.email, data.password);
      const user = result.user;

      // 2️⃣ token
      const token = await user.getIdToken(true);

      // 3️⃣ upload image
      const formData = new FormData();
      formData.append("image", data.photo[0]);

      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
        formData
      );

      const photoURL = imgRes.data.data.url;

      // 4️⃣ update firebase profile
      await updateUserProfile({
        displayName: data.name,
        photoURL,
      });

      // 5️⃣ HR user object
      const hrUser = {
        email: data.email,
        displayName: data.name,
        photoURL,
        uid: user.uid,
        role: "hr",
        company: data.company || "",
        createdAt: new Date().toISOString(),
      };

      // 6️⃣ save to DB (secure)
      await axiosSecure.post("/users", hrUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 7️⃣ redirect
      navigate(location.state?.from?.pathname || "/dashboard", {
        replace: true,
      });

    } catch (error) {
      console.log(error);

      if (error.code === "auth/email-already-in-use") {
        alert("এই email আগে থেকেই ব্যবহার করা হয়েছে");
      } else {
        alert("HR create failed");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(handleJoinHr)}
        className="p-6 shadow-xl rounded-lg w-96 space-y-3"
      >

        <h2 className="text-xl font-bold text-center">Join as HR</h2>

        <input
          {...register("name", { required: true })}
          placeholder="Full Name"
          className="input input-bordered w-full"
        />

        <input
          {...register("company")}
          placeholder="Company Name"
          className="input input-bordered w-full"
        />

        <input
          type="file"
          {...register("photo", { required: true })}
          className="file-input file-input-bordered w-full"
        />

        <input
          type="email"
          {...register("email", { required: true })}
          placeholder="Email"
          className="input input-bordered w-full"
        />

        <input
          type="password"
          {...register("password", { required: true, minLength: 6 })}
          placeholder="Password"
          className="input input-bordered w-full"
        />

        <button
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Creating..." : "Join HR"}
        </button>

      </form>
    </div>
  );
};

export default JoinHR;