
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const AddAsset = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [dbUser, setDbUser] = useState(null);
  const [companyName, setCompanyName] = useState("");

  const { register, handleSubmit, control, reset } = useForm();

  // GET USER FROM DB
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user?.email) return;
        const res = await axiosSecure.get(`/users/${user.email}`);
        setDbUser(res.data);
      } catch (error) {
        console.log(error);
        setDbUser(null);
      }
    };
    fetchUser();
  }, [user, axiosSecure]);

  // WATCH VALUES
  const quantity = Number(useWatch({ control, name: "quantity" }) || 0);
  const price = Number(useWatch({ control, name: "price" }) || 0);
  const totalPrice = quantity * price;

  // IMAGE UPLOAD
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;

      const res = await fetch(imageUploadUrl, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setImageUrl(data.data.url);
        Swal.fire({
          icon: "success",
          title: "Image Uploaded Successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Error", "Image upload failed", "error");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Image upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // SUBMIT
  const onSubmit = async (data) => {
    if (!imageUrl) {
      Swal.fire({
        icon: "error",
        title: "Image Required",
        text: "Please upload an image first",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const finalCompanyName =
      dbUser?.role === "admin"
        ? companyName?.trim()
        : dbUser?.companyName?.trim();

    if (!finalCompanyName) {
      Swal.fire({
        icon: "error",
        title: "Company Name Required",
        text: "Please enter company name",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const payload = {
      productName: data.assetName,
      productImage: imageUrl,
      productType: data.productType,
      productQuantity: Number(data.quantity),
      availableQuantity: Number(data.quantity),
      hrEmail: user?.email,
      ownerName: user?.displayName,
      phone: data.phone,
      price: Number(data.price),
      totalPrice,
      companyName: finalCompanyName,
      paymentStatus: "unpaid",
      deliveryStatus: "pending",
      createdAt: new Date(),
    };

    // Confirmation Alert
    const confirm = await Swal.fire({
      title: "Confirm Asset",
      html: `
        <div class="text-left">
          <p><strong>Product:</strong> ${payload.productName}</p>
          <p><strong>Type:</strong> ${payload.productType}</p>
          <p><strong>Quantity:</strong> ${payload.productQuantity}</p>
          <p><strong>Price:</strong> ${payload.price} ৳</p>
          <p><strong>Total:</strong> ${payload.totalPrice} ৳</p>
          <p><strong>Company:</strong> ${payload.companyName}</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Add Asset",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);

      const res = await axiosSecure.post("/assets", payload);

      if (res.data?.success || res.data?.insertedId) {
        await Swal.fire({
          icon: "success",
          title: "Asset Added Successfully!",
          text: `${payload.productName} has been added`,
          timer: 2000,
          showConfirmButton: false,
        });

        reset();
        setImageUrl("");
        setCompanyName("");
        navigate("/dashboard/assets-list");
      } else {
        throw new Error("Failed to add asset");
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Failed to Add Asset",
        text: error.response?.data?.message || "Something went wrong",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-base-100 shadow-xl rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Add New Asset</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-8">
          {/* LEFT SIDE */}
          <div className="space-y-5">
            <input
              placeholder="Product Name"
              {...register("assetName", { required: true })}
              className="input input-bordered w-full"
            />

            <select
              {...register("productType", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select Type</option>
              <option>Returnable</option>
              <option>Non-returnable</option>
            </select>

            <input
              type="number"
              placeholder="Quantity"
              {...register("quantity")}
              className="input input-bordered w-full"
            />

            <input
              type="number"
              placeholder="Price"
              {...register("price")}
              className="input input-bordered w-full"
            />

            <input
              type="file"
              onChange={handleImageUpload}
              className="file-input w-full"
            />

            {imageUrl && (
              <img src={imageUrl} alt="Preview" className="w-40 h-40 object-cover rounded" />
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-5">
            <input
              value={user?.displayName || ""}
              readOnly
              className="input input-bordered w-full"
            />

            <input
              value={user?.email || ""}
              readOnly
              className="input input-bordered w-full"
            />

            <input
              {...register("phone")}
              placeholder="Phone"
              className="input input-bordered w-full"
            />

            <div>
              <label className="font-semibold">Company Name</label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter Company Name"
                className="input input-bordered w-full"
                readOnly={dbUser?.role !== "admin"}
              />
            </div>

            {/* SUMMARY */}
            <div className="bg-base-200 p-4 rounded space-y-1">
              <p>Price: {price} ৳</p>
              <p>Quantity: {quantity}</p>
              <p className="font-bold text-green-600">Total: {totalPrice} ৳</p>
            </div>

            <button
              disabled={loading || !imageUrl}
              className="btn btn-primary w-full"
            >
              {loading ? "Adding..." : "Add Asset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAsset;

