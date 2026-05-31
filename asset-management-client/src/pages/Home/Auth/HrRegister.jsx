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
      // =========================
      // FIREBASE REGISTER
      // =========================
      const result = await registerUser(
        data.email,
        data.password
      );

      // =========================
      // IMAGE UPLOAD
      // =========================
      let logoURL = "";

      if (data.companyLogo?.[0]) {
        const formData = new FormData();

        formData.append("image", data.companyLogo[0]);

        const imageAPI = `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_image_host_key
        }`;

        const imageRes = await axios.post(
          imageAPI,
          formData
        );

        logoURL = imageRes.data.data.url;
      }

      // =========================
      // UPDATE FIREBASE PROFILE
      // =========================
      await updateUserProfile({
        displayName: data.hrName,
        photoURL: logoURL,
      });

      // =========================
      // GET TOKEN
      // =========================
      const token = await result.user.getIdToken();

      // =========================
      // COMPANY DATA
      // =========================
      const companyInfo = {
        companyName: data.companyName,

        companyLogo: logoURL,

        companyEmail: data.email,

        hrName: data.hrName,

        hrEmail: data.email,

        package: {
          packageName: "Starter",

          employeeLimit: 5,

          price: 0,
        },

        currentEmployees: 0,

        createdAt: new Date().toISOString(),
      };

      // =========================
      // USER DATA
      // =========================
      const userInfo = {
        uid: result.user.uid,

        name: data.hrName,

        email: data.email,

        photoURL: logoURL,

        role: "hr",

        companyName: data.companyName,

        companyLogo: logoURL,

        companyId: null,

        status: "active",

        createdAt: new Date().toISOString(),
      };

      // =========================
      // SAVE COMPANY
      // =========================
      const companyRes = await axios.post(
        "http://localhost:5000/companies",
        companyInfo,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      // =========================
      // ADD COMPANY ID TO USER
      // =========================
      userInfo.companyId =
        companyRes.data.insertedId;

      // =========================
      // SAVE USER
      // =========================
      await axios.post(
        "http://localhost:5000/users",
        userInfo,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      reset();

      navigate(
        location.state?.from?.pathname || "/",
        {
          replace: true,
        }
      );
    } catch (error) {
      console.log(error);

      if (
        error.message.includes(
          "email-already-in-use"
        )
      ) {
        setServerError(
          "This email is already registered."
        );
      } else {
        setServerError(
          error.message || "Registration Failed"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-base-100 shadow-2xl rounded-2xl p-6 md:p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">
            HR Registration
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Create company and manage employees
          </p>
        </div>

        {serverError && (
          <div className="alert alert-error mb-4 text-sm">
            {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(
            handleHRRegistration
          )}
          className="space-y-4"
        >
          {/* HR NAME */}
          <div>
            <label className="label">
              <span className="label-text">
                HR Name
              </span>
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
              <p className="text-red-500 text-xs mt-1">
                {errors.hrName.message}
              </p>
            )}
          </div>

          {/* COMPANY NAME */}
          <div>
            <label className="label">
              <span className="label-text">
                Company Name
              </span>
            </label>

            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Tech Corp"
              {...register("companyName", {
                required:
                  "Company name is required",
              })}
            />

            {errors.companyName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.companyName.message}
              </p>
            )}
          </div>

          {/* COMPANY LOGO */}
          <div>
            <label className="label">
              <span className="label-text">
                Company Logo
              </span>
            </label>

            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              {...register("companyLogo", {
                required:
                  "Company logo is required",
              })}
            />

            {errors.companyLogo && (
              <p className="text-red-500 text-xs mt-1">
                {errors.companyLogo.message}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="label">
              <span className="label-text">
                Email
              </span>
            </label>

            <input
              type="email"
              className="input input-bordered w-full"
              placeholder="hr@company.com"
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
              <span className="label-text">
                Password
              </span>
            </label>

            <input
              type="password"
              className="input input-bordered w-full"
              placeholder="******"
              {...register("password", {
                required: "Password is required",

                minLength: {
                  value: 6,
                  message:
                    "Minimum 6 characters",
                },
              })}
            />

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* PACKAGE INFO */}
          <div className="bg-base-200 rounded-xl p-4">
            <h3 className="font-bold mb-2">
              Default Package
            </h3>

            <p className="text-sm">
              Package: Starter
            </p>

            <p className="text-sm">
              Employee Limit: 5
            </p>

            <p className="text-sm">
              Price: $0
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
            <Link
              to="/login"
              className="text-primary font-semibold"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default HrRegister;