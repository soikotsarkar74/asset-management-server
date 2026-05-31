import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const RequestAsset = () => {
  const axiosSecure = useAxiosSecure();

  const [selectedAsset, setSelectedAsset] = useState("");
  const [note, setNote] = useState("");

  // ================= GET ALL AVAILABLE ASSETS =================
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const res = await axiosSecure.get("/assets");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // ================= HANDLE REQUEST =================
  const handleRequest = async (e) => {
    e.preventDefault();

    if (!selectedAsset) {
      return Swal.fire({
        icon: "warning",
        title: "Select Asset",
        text: "Please select an asset first",
      });
    }

    try {
      const res = await axiosSecure.post("/requests", {
        assetId: selectedAsset,
        note,
      });

      if (res.data?.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Request Sent!",
          text: "Your asset request has been submitted",
          timer: 1500,
          showConfirmButton: false,
        });

        setSelectedAsset("");
        setNote("");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  };

  // ================= LOADING =================
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">

      <h2 className="text-2xl font-bold mb-6">
        📦 Request Asset
      </h2>

      <form
        onSubmit={handleRequest}
        className="space-y-4 bg-base-100 p-6 rounded-xl shadow"
      >

        {/* SELECT ASSET */}
        <div>
          <label className="label font-semibold">
            Select Asset
          </label>

          <select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">-- Choose Asset --</option>

            {assets.map((asset) => (
              <option key={asset._id} value={asset._id}>
                {asset.name} ({asset.type})
              </option>
            ))}
          </select>
        </div>

        {/* NOTE */}
        <div>
          <label className="label font-semibold">
            Note (Optional)
          </label>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="textarea textarea-bordered w-full"
            placeholder="Why do you need this asset?"
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          Submit Request
        </button>

      </form>
    </div>
  );
};

export default RequestAsset;