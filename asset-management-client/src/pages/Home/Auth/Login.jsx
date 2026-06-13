import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../../contexts/AuthContext";
import SocialLogin from "./SocialLogin/SocialLogin";
import { useForm } from "react-hook-form";

const Login = () => {
  const {register,handleSubmit,formState: { errors }} = useForm();
  const { signIn } = useContext(AuthContext);
   const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  console.log('in the location login page',location);

  const handleLogin = (data) => {
    signIn(data.email, data.password)
      .then(() => {
        toast.success("Login successful 🎉");
         navigate(from, { replace: true });
       navigate(location?.state || "/")
     
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">
          Please Login
        </h1>
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full"
              {...register("email", { required: "Email লাগবে" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full"
              {...register("password", { required: "Password লাগবে" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          <button type="submit" state={location.state} className="btn btn-primary w-full mt-2">
            Login
          </button>
        </form>

        <SocialLogin />

        <p className="text-center mt-4">
          New here?{" "}
          <Link
       
          to="/register" state={location.state} className="text-blue-600 underline">
             
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
