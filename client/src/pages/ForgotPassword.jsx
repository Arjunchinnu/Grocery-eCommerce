import React, { useState } from "react";
import { useAppContext } from "../context/AppContent";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const { axios, navigate } = useAppContext();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Email is required");
    }

    try {
      setLoading(true);

      const { data } = await axios.post("/api/auth/forgot-password", {
        email,
      });

      toast.success(data.message || "Reset link sent to your email");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60">
      <form
        onSubmit={submitHandler}
        className="flex flex-col gap-5 p-8 w-[340px] bg-white rounded-2xl shadow-2xl"
      >
        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold">
            Forgot <span className="text-primary">Password</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter your email to receive reset link
          </p>
        </div>

        {/* Input */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-md p-3 outline-none focus:ring-2 focus:ring-primary transition"
          required
        />

        {/* Button */}
        <button
          disabled={loading}
          className={`py-2 rounded-md text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary-dull"
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* Back */}
        <p
          onClick={() => navigate("/")}
          className="text-sm text-center text-primary cursor-pointer hover:underline"
        >
          Back to Login
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
