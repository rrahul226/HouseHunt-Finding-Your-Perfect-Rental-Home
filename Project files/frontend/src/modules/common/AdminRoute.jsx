// src/modules/common/AdminRoute.jsx

import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../../App";

const AdminRoute = ({ children }) => {
  const { userData } = useContext(UserContext);

  // ✅ Safely get user from localStorage
  let storedUser = null;
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      storedUser = JSON.parse(raw);
    }
  } catch (err) {
    console.error("Invalid user in localStorage", err);
  }

  const user = userData || storedUser;

  // ❌ Not logged in or not admin
  if (!user || user.role !== "Admin") {
    return <Navigate to="/adminlogin" />;
  }

  // ✅ Authorized: render nested routes or children
  return children ? children : <Outlet />;
};

export default AdminRoute;
