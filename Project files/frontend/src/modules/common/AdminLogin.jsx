import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./adminlogin.css";
import { UserContext } from "../../App";
import axios from "axios";
import { message } from "antd";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { setUserData, setUserLoggedIn } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8001/api/admin/login", {
        email,
        password,
      });

      const data = response.data;

      if (response.status === 200 && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user || { role: "admin" }));
        setUserData(data.user || { role: "admin" });
        setUserLoggedIn(true);
        message.success("Login successful ✅");

        // ✅ Final redirection to admin dashboard
        navigate("/adminhome");
      } else {
        setError(data.message || "Login failed");
        message.error(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network or server error");
      message.error("Admin not found");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2>Admin Login</h2>
        <p>Sign in with your admin credentials</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
