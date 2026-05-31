import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const UpdateAsset = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
  } = useForm();

  // ================= LOAD SINGLE ASSET =================
  const { data: asset, isLoading } = useQuery({
    queryKey: ["asset", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/assets/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // ================= SET DEFAULT VALUES =================
  useEffect(() => {
    if (asset) {
      setValue("productName", asset.productName);
      setValue("productImage", asset.productImage);
      setValue("productType", asset.productType);
      setValue("productQuantity", asset.productQuantity);
    }
  }, [asset, setValue]);

  // ================= UPDATE MUTATION =================
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      return await axiosSecure.patch(`/assets/${id}`, data);
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Updated Successfully",
      });

      navigate("/dashboard/assets-list");
    },
  });

  // ================= SUBMIT =================
  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-base-100 shadow rounded-xl">

      <h2 className="text-2xl font-bold mb-5">
        Update Asset
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* NAME */}
        <input
          {...register("productName", { required: true })}
          className="input input-bordered w-full"
          placeholder="Product Name"
        />

        {/* IMAGE */}
        <input
          {...register("productImage", { required: true })}
          className="input input-bordered w-full"
          placeholder="Image URL"
        />

        {/* TYPE */}
        <select
          {...register("productType")}
          className="select select-bordered w-full"
        >
          <option value="Returnable">Returnable</option>
          <option value="Non-returnable">Non-returnable</option>
        </select>

        {/* QUANTITY */}
        <input
          type="number"
          {...register("productQuantity", { required: true })}
          className="input input-bordered w-full"
          placeholder="Quantity"
        />

        {/* BUTTON */}
        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          Update Asset
        </button>

      </form>

    </div>
  );
};

export default UpdateAsset;