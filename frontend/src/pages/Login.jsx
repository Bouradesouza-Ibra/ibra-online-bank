import { useState } from "react";
import axios from "axios";

function Login() {
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

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://ibra-online-bank-api.onrender.com/api/auth/login",
        formData
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login successful");

      window.location.href = "/#/dashboard";
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-overlay">
        <form className="auth-form" onSubmit={handleLogin}>
          <h1>Welcome Back</h1>

          <p>Login to your online banking account</p>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;