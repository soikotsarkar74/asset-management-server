

import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { AuthContext } from "../../../contexts/AuthContext";

const AssetsList = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  // ================= GET ASSETS =================
  const {
    data: assets = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["assets", user?.email],
    enabled: !!user?.email,

    queryFn: async () => {
      const res = await axiosSecure.get("/assets");

      // backend response: { success, data }
      return res.data.data || [];
    },
  });

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Asset?",
      text: "This asset will be permanently removed",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/assets/${id}`);

      if (res.data.deletedCount > 0) {
        Swal.fire("Deleted!", "Asset deleted successfully", "success");
        refetch();
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // ================= LOADING =================
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-5">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Assets List</h2>
          <p className="text-gray-500">
            Total Assets: {assets.length}
          </p>
        </div>

        <Link to="/dashboard/add-asset">
          <button className="btn btn-primary">
            Add Asset
          </button>
        </Link>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
        <table className="table table-zebra">

          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Type</th>
              <th>Total Qty</th>
              <th>Available</th>
              <th>Status</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6">
                  No assets found
                </td>
              </tr>
            ) : (
              assets.map((asset, index) => (
                <tr key={asset._id}>

                  <td>{index + 1}</td>

                  <td className="font-semibold">
                    {asset.productName}
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        asset.productType === "Returnable"
                          ? "badge-success"
                          : "badge-info"
                      }`}
                    >
                      {asset.productType}
                    </span>
                  </td>

                  <td>{asset.productQuantity}</td>

                  <td>{asset.availableQuantity}</td>

                  <td>
                    {asset.availableQuantity > 0 ? (
                      <span className="badge badge-success">
                        Available
                      </span>
                    ) : (
                      <span className="badge badge-error">
                        Stock Out
                      </span>
                    )}
                  </td>

                  <td>
                    {asset.createdAt
                      ? new Date(asset.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td>
                    <div className="flex gap-2">

                      <Link to={`/dashboard/update-asset/${asset._id}`}>
                        <button className="btn btn-sm btn-warning">
                          Update
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDelete(asset._id)}
                        className="btn btn-sm btn-error"
                      >
                        Delete
                      </button>

                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AssetsList;