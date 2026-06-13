

import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  FaSearch, 
  FaFilter, 
  FaLaptop, 
  FaMobile, 
  FaDesktop, 
  FaPrint, 
  FaCamera,
  FaArrowLeft,
  FaArrowRight,
  FaSyncAlt,
  FaCheckCircle,
  FaClock,
  FaBoxOpen,
  FaBuilding,
  FaCalendarAlt,
  FaSpinner
} from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MyAssets = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // ================= FETCH ASSIGNED ASSETS =================
  const { 
    data: assets = [], 
    isLoading, 
    isError,
    refetch,
    error 
  } = useQuery({
    queryKey: ["my-assets"],
    queryFn: async () => {
      const res = await axiosSecure.get("/assigned-assets");
      console.log("Fetched assets:", res.data);
      return res.data || [];
    },
  });

  // ================= RETURN ASSET MUTATION =================
  const returnAsset = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/assigned-assets/return/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-assets"]);
      Swal.fire({
        icon: "success",
        title: "Asset Returned!",
        text: "Asset has been returned successfully",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (err) => {
      console.error("Return Error:", err);
      Swal.fire({
        icon: "error",
        title: "Return Failed",
        text: err.response?.data?.message || "Failed to return asset",
        confirmButtonColor: "#d33",
      });
    },
  });

  // ================= FILTERED ASSETS =================
  const filteredAssets = useMemo(() => {
    let result = [...assets];
    
    // Search filter
    if (search) {
      result = result.filter((item) =>
        item.assetName?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Type filter
    if (filter !== "all") {
      result = result.filter((item) =>
        item.assetType?.toLowerCase() === filter.toLowerCase()
      );
    }
    
    return result;
  }, [assets, search, filter]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAssets = filteredAssets.slice(startIndex, startIndex + itemsPerPage);

  // ================= HANDLE RETURN =================
  const handleReturn = async (id, assetName) => {
    const result = await Swal.fire({
      title: "Return Asset?",
      html: `
        <div class="text-left">
          <p><strong>Asset:</strong> ${assetName}</p>
          <p class="text-sm text-gray-500">Are you sure you want to return this asset?</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Return",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      returnAsset.mutate(id);
    }
  };

  // ================= GET ASSET ICON =================
  const getAssetIcon = (assetName) => {
    const name = assetName?.toLowerCase() || "";
    if (name.includes("laptop") || name.includes("computer")) return <FaDesktop className="text-blue-500" />;
    if (name.includes("mobile") || name.includes("phone")) return <FaMobile className="text-green-500" />;
    if (name.includes("printer")) return <FaPrint className="text-purple-500" />;
    if (name.includes("camera")) return <FaCamera className="text-yellow-500" />;
    return <FaLaptop className="text-gray-500" />;
  };

  // ================= FORMAT DATE =================
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // ================= LOADING STATE =================
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <FaSpinner className="animate-spin text-4xl text-primary mb-4" />
        <p className="text-gray-500">Loading your assets...</p>
      </div>
    );
  }

  // ================= ERROR STATE =================
  if (isError) {
    return (
      <div className="text-center mt-20">
        <div className="alert alert-error shadow-lg max-w-md mx-auto">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Failed to load assets! {error?.message}</span>
          </div>
        </div>
        <button className="btn btn-primary mt-4" onClick={() => refetch()}>
          <FaSyncAlt className="mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FaBoxOpen className="text-primary" />
              My Assets
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage all assets assigned to you
            </p>
          </div>
          
          <div className="badge badge-primary badge-lg px-4 py-4">
            Total Assets: {filteredAssets.length}
          </div>
        </div>
      </div>

      {/* FILTERS SECTION */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets by name..."
              className="input input-bordered w-full pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
            <select
              className="select select-bordered pl-10 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-primary"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Types</option>
              <option value="returnable">Returnable</option>
              <option value="non-returnable">Non-returnable</option>
            </select>
          </div>
        </div>
      </div>

      {/* ASSETS TABLE */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gradient-to-r from-primary to-primary-focus text-white">
              <tr>
                <th className="text-center">#</th>
                <th>Asset</th>
                <th>Type</th>
                <th>Company</th>
                <th>Status</th>
                <th>Assigned Date</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            
            <tbody>
              {paginatedAssets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <FaBoxOpen className="text-6xl text-gray-300" />
                      <h3 className="text-xl font-semibold text-gray-500">No Assets Found</h3>
                      <p className="text-gray-400">
                        {search || filter !== "all" 
                          ? "Try changing your search or filter criteria"
                          : "You don't have any assigned assets yet"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedAssets.map((asset, index) => (
                  <tr key={asset._id} className="hover:bg-gray-50 transition duration-150">
                    <td className="text-center font-semibold text-gray-500">
                      {startIndex + index + 1}
                    </td>
                    
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary/10 rounded-full w-10 h-10 flex items-center justify-center">
                            {getAssetIcon(asset.assetName)}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">{asset.assetName || "N/A"}</div>
                          <div className="text-xs text-gray-500">ID: {asset.assetId?.slice(-6) || "N/A"}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td>
                      <span className={`badge ${
                        asset.assetType === "Returnable" 
                          ? "badge-info bg-blue-100 text-blue-700 border-none" 
                          : "badge-secondary bg-purple-100 text-purple-700 border-none"
                      }`}>
                        {asset.assetType || "N/A"}
                      </span>
                    </td>
                    
                    <td>
                      <div className="flex items-center gap-2">
                        <FaBuilding className="text-gray-400 text-sm" />
                        <span>{asset.companyName || "N/A"}</span>
                      </div>
                    </td>
                    
                    <td>
                      <span className={`badge gap-1 px-3 py-2 ${
                        asset.returnStatus === "Returned"
                          ? "badge-success bg-green-100 text-green-700 border-none"
                          : "badge-warning bg-yellow-100 text-yellow-700 border-none"
                      }`}>
                        {asset.returnStatus === "Returned" ? (
                          <FaCheckCircle className="text-sm" />
                        ) : (
                          <FaClock className="text-sm" />
                        )}
                        {asset.returnStatus || "Assigned"}
                      </span>
                    </td>
                    
                    <td>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400 text-sm" />
                        <span className="text-sm">{formatDate(asset.assignmentDate)}</span>
                      </div>
                    </td>
                    
                    <td className="text-center">
                      {asset.assetType === "Returnable" && asset.returnStatus !== "Returned" ? (
                        <button
                          onClick={() => handleReturn(asset._id, asset.assetName)}
                          className="btn btn-sm btn-primary gap-2"
                          disabled={returnAsset.isPending}
                        >
                          {returnAsset.isPending ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaArrowLeft className="text-sm" />
                          )}
                          Return
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t bg-gray-50">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAssets.length)} of {filteredAssets.length} assets
            </div>
            <div className="join">
              <button
                className="join-item btn btn-sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <FaArrowLeft />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`join-item btn btn-sm ${currentPage === i + 1 ? "btn-active" : ""}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="join-item btn btn-sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* STATS SECTION */}
      {filteredAssets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Assets</p>
                <p className="text-2xl font-bold">{filteredAssets.length}</p>
              </div>
              <FaBoxOpen className="text-3xl text-primary/60" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Returnable Assets</p>
                <p className="text-2xl font-bold">
                  {filteredAssets.filter(a => a.assetType === "Returnable" && a.returnStatus !== "Returned").length}
                </p>
              </div>
              <FaArrowLeft className="text-3xl text-green-500/60" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Returned Assets</p>
                <p className="text-2xl font-bold">
                  {filteredAssets.filter(a => a.returnStatus === "Returned").length}
                </p>
              </div>
              <FaCheckCircle className="text-3xl text-blue-500/60" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAssets;
