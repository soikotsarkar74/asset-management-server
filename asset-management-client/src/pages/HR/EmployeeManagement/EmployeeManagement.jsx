import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  FaEdit,
  FaTrash,
  FaUserShield,
  FaUser,
  FaSpinner,
  FaSearch,
} from "react-icons/fa";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const  EmployeeManagement = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  // GET USERS
  const {
    data: users = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users", debouncedSearch],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users?searchText=${debouncedSearch}`
      );
      return res.data;
    },
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  // MAKE ADMIN
  const makeAdminMutation = useMutation({
    mutationFn: async (user) => {
      const res = await axiosSecure.patch(`/users/${user._id}/role`, {
        role: "admin",
      });
      if (!res.data.modifiedCount) throw new Error("Failed to update role");
      return res.data;
    },
    onSuccess: (data, user) => {
      toast.success(`${user.displayName || user.email} is now an admin! 🎉`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error, user) => {
      toast.error(`Failed to make ${user.displayName || user.email} admin`);
    },
  });

  const removeAdminMutation = useMutation({
    mutationFn: async (user) => {
      const res = await axiosSecure.patch(`/users/${user._id}/role`, {
        role: "user",
      });
      if (!res.data.modifiedCount) throw new Error("Failed to update role");
      return res.data;
    },
    onSuccess: (data, user) => {
      toast.success(
        `Admin removed from ${user.displayName || user.email}`
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error, user) => {
      toast.error(
        `Failed to remove admin from ${user.displayName || user.email}`
      );
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      const res = await axiosSecure.delete(`/users/${userId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Delete failed");
    },
  });

  const handleEditUser = (user) => {
    toast.info(`Edit user: ${user.displayName || user.email}`, {
      duration: 2000,
    });

    // You can open modal here later
  };

  // DELETE CONFIRM
  const handleDeleteUser = (user) => {
    Swal.fire({
      title: "Delete User?",
      text: `Delete ${user.displayName || user.email}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUserMutation.mutate(user._id);
      }
    });
  };

  // MAKE ADMIN CONFIRM
  const handleMakeAdmin = (user) => {
    Swal.fire({
      title: "Make Admin?",
      text: `Make ${user.displayName || user.email} admin?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        makeAdminMutation.mutate(user);
      }
    });
  };

  // REMOVE ADMIN CONFIRM
  const handleRemoveAdmin = (user) => {
    Swal.fire({
      title: "Remove Admin?",
      text: `Remove admin from ${user.displayName || user.email}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        removeAdminMutation.mutate(user);
      }
    });
  };

  // LOADING
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <FaSpinner className="animate-spin text-4xl" />
      </div>
    );
  }

  // ERROR
  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error.message}</p>
        <button onClick={() => refetch()} className="btn btn-primary mt-3">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-base-100 rounded-xl">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">User Management</h2>

        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            className="input input-bordered pl-10"
            placeholder="Search users..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
              <th>Admin</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>

                <td>{user.displayName || "No Name"}</td>

                <td>{user.email}</td>

                <td>
                  {user.role === "admin" ? (
                    <span className="text-green-600 font-bold">Admin</span>
                  ) : (
                    "User"
                  )}
                </td>

                <td className="flex gap-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="btn btn-xs btn-info"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="btn btn-xs btn-error"
                  >
                    <FaTrash />
                  </button>
                </td>

                <td>
                  {user.role === "admin" ? (
                    <button
                      onClick={() => handleRemoveAdmin(user)}
                      className="btn btn-xs btn-warning"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMakeAdmin(user)}
                      className="btn btn-xs btn-success"
                    >
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center py-10">No users found</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;


