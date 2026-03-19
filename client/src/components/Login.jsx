// import React, { useState } from "react";
// import { useAppContext } from "../context/AppContent";
// const Login = () => {
//   const [state, setState] = useState("login");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const { setShowUserLogin, setUser, axios } = useAppContext();

//   const onSubmitHandler = async (e) => {
//     try {
//       e.preventDefault();
//       const { data } = await axios.post(`/api/user/${state}`, {
//         name,
//         email,
//         password,
//       });
//       if (data.success) {
//         setUser(data.user);
//         localStorage.setItem("user", JSON.stringify(data.user));
//       } else {
//         console.log("Login failed", data.message);
//         return;
//       }

//       setShowUserLogin(false);
//     } catch (err) {
//       console.log("Login error", err);
//     }
//   };
//   return (
//     <div
//       onClick={() => setShowUserLogin(false)}
//       className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50"
//     >
//       <form
//         onSubmit={onSubmitHandler}
//         onClick={(e) => e.stopPropagation()}
//         className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
//       >
//         <p className="text-2xl font-medium m-auto">
//           <span className="text-primary">User</span>{" "}
//           {state === "login" ? "Login" : "Sign Up"}
//         </p>
//         {state === "register" && (
//           <div className="w-full">
//             <p>Name</p>
//             <input
//               onChange={(e) => setName(e.target.value)}
//               value={name}
//               placeholder="type here"
//               className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
//               type="text"
//               required
//             />
//           </div>
//         )}
//         <div className="w-full ">
//           <p>Email</p>
//           <input
//             onChange={(e) => setEmail(e.target.value)}
//             value={email}
//             placeholder="type here"
//             className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
//             type="email"
//             required
//           />
//         </div>
//         <div className="w-full ">
//           <p>Password</p>
//           <input
//             onChange={(e) => setPassword(e.target.value)}
//             value={password}
//             placeholder="type here"
//             className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
//             type="password"
//             required
//           />
//         </div>
//         {state === "register" ? (
//           <p>
//             Already have account?{" "}
//             <span
//               onClick={() => setState("login")}
//               className="text-primary cursor-pointer"
//             >
//               click here
//             </span>
//           </p>
//         ) : (
//           <p>
//             Create an account?{" "}
//             <span
//               onClick={() => setState("register")}
//               className="text-primary cursor-pointer"
//             >
//               click here
//             </span>
//           </p>
//         )}
//         <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
//           {state === "register" ? "Create Account" : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { useAppContext } from "../context/AppContent";
import toast from "react-hot-toast";

const Login = () => {
  const { setShowUserLogin, setUser, axios, navigate } = useAppContext();

  const [state, setState] = useState("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const payload =
        state === "register"
          ? form
          : { email: form.email, password: form.password };

      const { data } = await axios.post(`/api/user/${state}`, payload);

      if (!data.success) {
        toast.error(data.message || "Login failed");
      }

      // Save token properly
      localStorage.setItem("userToken", data.token);
      navigate("/");
      setUser(data.user);

      toast.success("Success");
      setShowUserLogin(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Network error");
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 p-8 w-80 bg-white rounded-lg shadow-xl"
      >
        <p className="text-2xl font-medium text-center">
          <span className="text-primary">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && (
          <input
            name="name"
            type="text"
            placeholder="Enter name"
            value={form.name}
            onChange={handleChange}
            className="border rounded p-2 outline-primary"
            required
          />
        )}

        <input
          name="email"
          type="email"
          placeholder="Enter email"
          value={form.email}
          onChange={handleChange}
          className="border rounded p-2 outline-primary"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
          className="border rounded p-2 outline-primary"
          required
        />

        <p className="text-sm text-right">
          <a
            href="/forgot-password"
            className=" hover:underline hover:text-primary"
          >
            Forgot Password?
          </a>
        </p>

        <button className="bg-primary hover:bg-primary-dull transition-all text-white py-2 rounded-md cursor-pointer">
          {state === "register" ? "Create Account" : "Login"}
        </button>

        <p className="text-sm text-center p-0 m-0">
          {state === "register"
            ? "Already have account?"
            : "Create an account?"}{" "}
          <span
            onClick={() => setState(state === "login" ? "register" : "login")}
            className="text-primary cursor-pointer"
          >
            click here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
