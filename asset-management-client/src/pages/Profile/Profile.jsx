import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const Profile = () => {
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    dateOfBirth: "",
    profileImage: "",
  });

  const [preview, setPreview] = useState("");

  // GET PROFILE
  useEffect(() => {
    axiosSecure.get("/users/profile")
      .then((res) => {
        const data = res.data;

        setForm({
          name: data.name || "",
          dateOfBirth: data.dateOfBirth || "",
          profileImage: data.profileImage || "",
        });

        setPreview(data.profileImage || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [axiosSecure]);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "profileImage") {
      setPreview(value);
    }
  };

  // UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosSecure.patch("/users/profile", form);

      if (res.data.success) {
        Swal.fire("Success", "Profile updated!", "success");
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || err.message,
        "error"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">

      <h2 className="text-2xl font-bold mb-6 text-center">
        My Profile
      </h2>

      {/* IMAGE */}
      <div className="flex justify-center mb-6">
        <img
          src={
            preview ||
            "https://i.ibb.co/2kR8QzG/default-avatar.png"
          }
          className="w-28 h-28 rounded-full object-cover border-4"
        />
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="input input-bordered w-full"
        />

        <input
          type="date"
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={handleChange}
          className="input input-bordered w-full"
        />

        <input
          type="text"
          name="profileImage"
          value={form.profileImage}
          onChange={handleChange}
          placeholder="Profile Image URL"
          className="input input-bordered w-full"
        />

        <button className="btn btn-primary w-full">
          Update Profile
        </button>

      </form>
    </div>
  );
};

export default Profile;