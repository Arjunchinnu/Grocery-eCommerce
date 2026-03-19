import React, { useState } from "react";
import { useAppContext } from "../context/AppContent";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const { axios, navigate } = useAppContext();

  const [email, setEmail] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/auth/forgot-password", {
        email,
      });

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
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
          <span className="text-primary">Forgot</span> Password
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded p-2 outline-primary"
          required
        />

        <button className="bg-primary hover:bg-primary-dull transition-all text-white py-2 rounded-md cursor-pointer">
          Send Reset Link
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

export default ForgotPassword;
