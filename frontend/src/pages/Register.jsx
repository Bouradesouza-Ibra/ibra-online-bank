import { useState } from "react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5050/api/auth/register",
        formData
      );

      alert("Registration successful");

      window.location.href = "/login";

    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="register-page">
      <div className="register-overlay">
        <form
          className="register-form"
          onSubmit={handleRegister}
        >
          <h1>Create Account</h1>

          <p>
            Open your secure online banking account
          </p>

          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;