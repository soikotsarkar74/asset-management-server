import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUser, FaEnvelope, FaImage, FaBriefcase, FaPhone, FaVenusMars, FaBuilding } from "react-icons/fa";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const RegisterEmployee = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const employeeData = {
        name: data.name,
        email: data.email,
        photo: data.photo,
        designation: data.designation,
        phone: data.phone,
        gender: data.gender,
        companyName: data.companyName,  
        role: "employee",
        createdAt: new Date()
      };

      const res = await axiosSecure.post("/employees", employeeData);

      if (res.data.insertedId) {
        toast.success("Employee registered successfully 🎉");
        reset();
      } else if (res.data.message === "Employee already exists") {
        toast.error("Employee with this email already exists ❌");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to register employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Register Employee</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <div className="flex items-center border rounded-lg px-3">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Enter full name"
                className="w-full p-2 outline-none"
                {...register("name", { required: true })}
              />
            </div>
            {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <div className="flex items-center border rounded-lg px-3">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="Enter email"
                className="w-full p-2 outline-none"
                {...register("email", { required: true })}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
          </div>

          {/* Photo URL */}
          <div>
            <label className="block mb-1 font-medium">Photo URL</label>
            <div className="flex items-center border rounded-lg px-3">
              <FaImage className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Enter photo URL"
                className="w-full p-2 outline-none"
                {...register("photo", { required: true })}
              />
            </div>
            {errors.photo && <p className="text-red-500 text-sm">Photo URL is required</p>}
          </div>

          {/* Designation */}
          <div>
            <label className="block mb-1 font-medium">Designation</label>
            <div className="flex items-center border rounded-lg px-3">
              <FaBriefcase className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Enter designation"
                className="w-full p-2 outline-none"
                {...register("designation", { required: true })}
              />
            </div>
            {errors.designation && <p className="text-red-500 text-sm">Designation is required</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <div className="flex items-center border rounded-lg px-3">
              <FaPhone className="text-gray-400 mr-2" />
              <input
                type="tel"
                placeholder="Enter phone number"
                className="w-full p-2 outline-none"
                {...register("phone", { required: true })}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-sm">Phone number is required</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-1 font-medium">Gender</label>
            <div className="flex items-center border rounded-lg px-3">
              <FaVenusMars className="text-gray-400 mr-2" />
              <select
                className="w-full p-2 outline-none"
                {...register("gender", { required: true })}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            {errors.gender && <p className="text-red-500 text-sm">Gender is required</p>}
          </div>

          {/* Company Name ✅ NEW */}
          <div>
            <label className="block mb-1 font-medium">Company Name</label>
            <div className="flex items-center border rounded-lg px-3">
              <FaBuilding className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Enter company name"
                className="w-full p-2 outline-none"
                {...register("companyName", { required: true })}
              />
            </div>
            {errors.companyName && (
              <p className="text-red-500 text-sm">Company name is required</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Registering..." : "Register Employee"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterEmployee;
