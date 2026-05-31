// import React, { useState } from "react";
// import { useForm, useWatch } from "react-hook-form";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router";

// import useAxiosSecure from "../../hooks/useAxiosSecure";
// import useAuth from "../../hooks/useAuth";

// const AddAsset = () => {
//   const axiosSecure = useAxiosSecure();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     control,
//     reset,
//   } = useForm();

//   const [imageUrl, setImageUrl] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ================= WATCH =================

//   const quantity = Number(
//     useWatch({
//       control,
//       name: "quantity",
//     }) || 0
//   );

//   const price = Number(
//     useWatch({
//       control,
//       name: "price",
//     }) || 0
//   );

//   const totalPrice = quantity * price;

//   // ================= IMAGE UPLOAD =================

//   const handleImageUpload = async (e) => {
//     const file = e.target.files?.[0];

//     if (!file) return;

//     setLoading(true);

//     try {
//       const formData = new FormData();

//       formData.append("image", file);

//       const res = await fetch(
//         "https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY",
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         setImageUrl(data.data.url);
//       } else {
//         Swal.fire(
//           "Error",
//           "Image upload failed",
//           "error"
//         );
//       }
//     } catch (error) {
//       console.error(error);

//       Swal.fire(
//         "Error",
//         "Image upload failed",
//         "error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= SUBMIT =================

//   const onSubmit = async (data) => {
//     const payload = {
//       productName: data.assetName,

//       productImage: imageUrl,

//       productType: data.productType,

//       productQuantity: Number(data.quantity),

//       availableQuantity: Number(data.quantity),

//       hrEmail: user?.email,

//       companyName: user?.companyName || "Unknown Company",

//       ownerName: user?.displayName,

//       phone: data.phone,

//       price: Number(data.price),

//       totalPrice: totalPrice,

//       paymentStatus: "unpaid",

//       deliveryStatus: "pending",

//       createdAt: new Date(),
//     };

//     const confirm = await Swal.fire({
//       title: "Confirm Asset",
//       html: `
//         <b>Product:</b> ${payload.productName}<br/>
//         <b>Type:</b> ${payload.productType}<br/>
//         <b>Quantity:</b> ${payload.productQuantity}<br/>
//         <b>Total Price:</b> ${payload.totalPrice} ৳
//       `,
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonText: "Confirm",
//     });

//     if (!confirm.isConfirmed) return;

//     try {
//       setLoading(true);

//       const res = await axiosSecure.post(
//         "/assets",
//         payload
//       );

//       if (res.data?.insertedId) {
//         Swal.fire(
//           "Success",
//           "Asset added successfully",
//           "success"
//         );

//         reset();

//         setImageUrl("");

//       navigate("/dashboard/assets-list"); 
//       }
//     } catch (error) {
//       console.error(error);

//       Swal.fire(
//         "Error",
//         "Failed to add asset",
//         "error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">
//         ➕ Add Asset
//       </h1>

//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="grid md:grid-cols-2 gap-6"
//       >
//         {/* LEFT SIDE */}
//         <div className="space-y-4">

//           {/* PRODUCT NAME */}
//           <input
//             type="text"
//             placeholder="Product Name"
//             {...register("assetName", {
//               required: true,
//             })}
//             className="input input-bordered w-full"
//           />

//           {/* PRODUCT TYPE */}
//           <select
//             {...register("productType", {
//               required: true,
//             })}
//             className="select select-bordered w-full"
//           >
//             <option value="">
//               Select Product Type
//             </option>

//             <option value="Returnable">
//               Returnable
//             </option>

//             <option value="Non-returnable">
//               Non-returnable
//             </option>
//           </select>

//           {/* QUANTITY */}
//           <input
//             type="number"
//             placeholder="Quantity"
//             {...register("quantity", {
//               required: true,
//             })}
//             className="input input-bordered w-full"
//           />

//           {/* PRICE */}
//           <input
//             type="number"
//             placeholder="Unit Price"
//             {...register("price", {
//               required: true,
//             })}
//             className="input input-bordered w-full"
//           />

//           {/* IMAGE */}
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageUpload}
//             className="file-input file-input-bordered w-full"
//           />

//           {/* IMAGE PREVIEW */}
//           {imageUrl && (
//             <img
//               src={imageUrl}
//               alt="Preview"
//               className="w-40 h-40 object-cover rounded-lg border"
//             />
//           )}
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="space-y-4">

//           {/* OWNER NAME */}
//           <input
//             defaultValue={user?.displayName}
//             readOnly
//             className="input input-bordered w-full"
//           />

//           {/* EMAIL */}
//           <input
//             defaultValue={user?.email}
//             readOnly
//             className="input input-bordered w-full"
//           />

//           {/* PHONE */}
//           <input
//             type="text"
//             placeholder="Phone Number"
//             {...register("phone", {
//               required: true,
//             })}
//             className="input input-bordered w-full"
//           />

//           {/* PRICE BOX */}
//           <div className="bg-gray-100 rounded-lg p-4 space-y-2">
//             <p>
//               <span className="font-semibold">
//                 Unit Price:
//               </span>{" "}
//               {price} ৳
//             </p>

//             <p>
//               <span className="font-semibold">
//                 Quantity:
//               </span>{" "}
//               {quantity}
//             </p>

//             <p className="text-xl font-bold text-green-600">
//               Total Price: {totalPrice} ৳
//             </p>
//           </div>

//           {/* SUBMIT BUTTON */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="btn bg-green-500 hover:bg-green-600 text-white w-full"
//           >
//             {loading
//               ? "Loading..."
//               : "Add Asset"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddAsset;







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

  const {
    register,
    handleSubmit,
    control,
    reset,
  } = useForm();

  // ======================================================
  // GET LOGGED IN USER FROM DATABASE
  // ======================================================

  // useEffect(() => {

  //   if (user?.email) {

  //     axiosSecure
  //       .get(`/users/${user.email}`)
  //       .then((res) => {
  //         setDbUser(res.data);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }

  // }, [user, axiosSecure]);

  useEffect(() => {
  const fetchUser = async () => {
    try {
      if (!user?.email) return;

      console.log("Fetching user:", user.email);

      const res = await axiosSecure.get(
        `/users/${user.email}`
      );

      console.log("DB USER RESPONSE:", res.data);

      setDbUser(res.data);
    } catch (error) {
      console.log("USER FETCH ERROR:", error);

      setDbUser({
       // companyName: "Unknown Company",
       companyName:'',
      });
    }
  };

  fetchUser();
}, [user, axiosSecure]);

  // ======================================================
  // WATCH
  // ======================================================

  const quantity = Number(
    useWatch({
      control,
      name: "quantity",
    }) || 0
  );

  const price = Number(
    useWatch({
      control,
      name: "price",
    }) || 0
  );

  const totalPrice = quantity * price;

  // ======================================================
  // IMAGE UPLOAD
  // ======================================================

  const handleImageUpload = async (e) => {

    const file = e.target.files?.[0];

    if (!file) return;

    setLoading(true);

    try {

      const formData = new FormData();

      formData.append("image", file);

      const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_image_host_key
      }`;

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

        Swal.fire(
          "Error",
          "Image upload failed",
          "error"
        );
      }

    } catch (error) {

      console.log(error);

      Swal.fire(
        "Error",
        "Image upload failed",
        "error"
      );

    } finally {

      setLoading(false);
    }
  };

  // ======================================================
  // SUBMIT
  // ======================================================

  const onSubmit = async (data) => {

    if (!imageUrl) {

      return Swal.fire(
        "Error",
        "Please upload an image first",
        "error"
      );
    }

    const payload = {

      productName: data.assetName,

      productImage: imageUrl,

      productType: data.productType,

      productQuantity: Number(data.quantity),

      availableQuantity: Number(data.quantity),

      hrEmail: user?.email,

      companyName:
        dbUser?.companyName || "Unknown Company",

      ownerName:
        user?.displayName || "Unknown",

      phone: data.phone,

      price: Number(data.price),

      totalPrice,

      paymentStatus: "unpaid",

      deliveryStatus: "pending",

      createdAt: new Date(),
    };

    const confirm = await Swal.fire({
      title: "Confirm Asset",
      html: `
        <b>Product:</b> ${payload.productName}<br/>
        <b>Type:</b> ${payload.productType}<br/>
        <b>Quantity:</b> ${payload.productQuantity}<br/>
        <b>Total Price:</b> ${payload.totalPrice} ৳
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm",
    });

    if (!confirm.isConfirmed) return;

    try {

      setLoading(true);

      const res = await axiosSecure.post(
        "/assets",
        payload
      );

      if (res.data?.insertedId) {

        Swal.fire({
          icon: "success",
          title: "Asset Added Successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        reset();

        setImageUrl("");

        navigate("/dashboard/assets-list");
      }

    } catch (error) {

      console.log(error);

      Swal.fire(
        "Error",
        "Failed to add asset",
        "error"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="max-w-6xl mx-auto p-6">

      <div className="bg-base-100 shadow-xl rounded-2xl p-6">

        <h1 className="text-3xl font-bold mb-8 text-center">
          Add New Asset
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid md:grid-cols-2 gap-8"
        >

          {/* LEFT SIDE */}

          <div className="space-y-5">

            <div>
              <label className="font-semibold">
                Product Name
              </label>

              <input
                type="text"
                placeholder="Enter Product Name"
                {...register("assetName", {
                  required: true,
                })}
                className="input input-bordered w-full mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">
                Product Type
              </label>

              <select
                {...register("productType", {
                  required: true,
                })}
                className="select select-bordered w-full mt-2"
              >
                <option value="">
                  Select Type
                </option>

                <option value="Returnable">
                  Returnable
                </option>

                <option value="Non-returnable">
                  Non-returnable
                </option>
              </select>
            </div>

            <div>
              <label className="font-semibold">
                Quantity
              </label>

              <input
                type="number"
                placeholder="Enter Quantity"
                {...register("quantity", {
                  required: true,
                })}
                className="input input-bordered w-full mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">
                Unit Price
              </label>

              <input
                type="number"
                placeholder="Enter Unit Price"
                {...register("price", {
                  required: true,
                })}
                className="input input-bordered w-full mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">
                Upload Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input file-input-bordered w-full mt-2"
              />
            </div>

            {imageUrl && (
              <div>

                <p className="font-semibold mb-2">
                  Image Preview
                </p>

                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded-xl border"
                />
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}

          <div className="space-y-5">

            <div>
              <label className="font-semibold">
                HR Name
              </label>

              <input
                defaultValue={user?.displayName}
                readOnly
                className="input input-bordered w-full mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">
                HR Email
              </label>

              <input
                defaultValue={user?.email}
                readOnly
                className="input input-bordered w-full mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">
                Phone Number
              </label>

              <input
                type="text"
                placeholder="Enter Phone Number"
                {...register("phone", {
                  required: true,
                })}
                className="input input-bordered w-full mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">
                Company Name
              </label>

              <input
                value={
                  dbUser?.companyName ||
                  "Loading..."
                }
                readOnly
                className="input input-bordered w-full mt-2"
              />
            </div>

            <div className="bg-base-200 rounded-xl p-5 space-y-3">

              <h2 className="text-xl font-bold">
                Price Summary
              </h2>

              <p>
                <span className="font-semibold">
                  Unit Price:
                </span>{" "}
                {price} ৳
              </p>

              <p>
                <span className="font-semibold">
                  Quantity:
                </span>{" "}
                {quantity}
              </p>

              <p className="text-2xl font-bold text-green-600">
                Total: {totalPrice} ৳
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !imageUrl}
              className="btn btn-primary w-full"
            >
              {loading
                ? "Loading..."
                : "Add Asset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAsset;