import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const UpdatePackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [form, setForm] = useState({
    name: "",
    price: "",
    employeeLimit: "",
    features: "",
  });

  // ================= LOAD DATA =================
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await axiosSecure.get(`/packages`);
        const pkg = res.data.find((p) => p._id === id);

        if (pkg) {
          setForm({
            name: pkg.name,
            price: pkg.price,
            employeeLimit: pkg.employeeLimit,
            features: pkg.features.join(", "),
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPackage();
  }, [id]);

  // ================= HANDLE UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: form.name,
        price: form.price,
        employeeLimit: form.employeeLimit,
        features: form.features.split(",").map((f) => f.trim()),
      };

      const res = await axiosSecure.patch(
        `/packages/${id}`,
        payload
      );

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Package Updated!",
        });

        navigate("/dashboard/packages");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message,
      });
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Update Package
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input input-bordered w-full"
          placeholder="Package Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="number"
          className="input input-bordered w-full"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <input
          type="number"
          className="input input-bordered w-full"
          placeholder="Employee Limit"
          value={form.employeeLimit}
          onChange={(e) =>
            setForm({
              ...form,
              employeeLimit: e.target.value,
            })
          }
        />

        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Features (comma separated)"
          value={form.features}
          onChange={(e) =>
            setForm({
              ...form,
              features: e.target.value,
            })
          }
        />

        <button className="btn btn-primary w-full">
          Update Package
        </button>
      </form>
    </div>
  );
};

export default UpdatePackage;