import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContent";
import toast from "react-hot-toast";

const PasswordReset = () => {
  const { token } = useParams();
  const { axios, navigate } = useAppContext();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    // ✅ Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const { data } = await axios.post(`/api/auth/reset-password/${token}`, {
        password,
      });

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success("Password reset successful");

      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Network error");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <form
        onSubmit={submitHandler}
        className="flex flex-col gap-4 p-8 w-80 bg-white rounded-lg shadow-xl"
      >
        <p className="text-2xl font-medium text-center">
          <span className="text-primary">Reset</span> Password
        </p>

        {/* New Password */}
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded p-2 outline-primary"
          required
        />

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border rounded p-2 outline-primary"
          required
        />

        <button className="bg-primary hover:bg-primary-dull transition-all text-white py-2 rounded-md cursor-pointer">
          Reset Password
        </button>

        <p
          onClick={() => navigate("/")}
          className="text-sm text-center text-primary cursor-pointer"
        >
          Back to Login
        </p>
      </form>
    </div>
  );
};

export default PasswordReset;
