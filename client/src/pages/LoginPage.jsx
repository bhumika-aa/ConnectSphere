import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const navigate = useNavigate();
  const { login, token } = useAuth();

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.message);

        return;
      }

      login(
        data.user,
        data.token
      );

      navigate("/");

    } catch (error) {

      console.log(error);
      alert("Something went wrong");
    }
  };

  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-[#fdf2f8] flex justify-center items-center px-4">

      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-pink-100">

        <h2 className="text-4xl font-bold text-center text-pink-600 mb-8">
          Welcome Back
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border border-pink-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            className="border border-pink-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <button
            type="submit"
            className="bg-pink-500 text-white py-4 rounded-2xl font-semibold hover:bg-pink-600 transition"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default LoginPage;