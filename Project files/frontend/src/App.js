import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { createContext, useEffect, useState } from "react";

// Common Modules
import Home from "./modules/common/Home";
import Login from "./modules/common/Login";
import Register from "./modules/common/Register";
import ForgotPassword from "./modules/common/ForgotPassword";
import AdminLogin from "./modules/common/AdminLogin";
import AdminRoute from "./modules/common/AdminRoute";

// Admin Modules
import AdminHome from "./modules/admin/AdminHome";
import AllUsers from "./modules/admin/AllUsers";
import AllBookings from "./modules/admin/AllBookings";
import AllProperty from "./modules/admin/AllProperty";

// User Modules
import OwnerHome from "./modules/user/Owner/OwnerHome";
import RenterHome from "./modules/user/renter/RenterHome";
import DeleteBooking from "./modules/user/renter/DeleteBooking";
import DeleteProperty from "./modules/user/Owner/DeleteProperty";


export const UserContext = createContext();

function App() {
  const date = new Date().getFullYear();
  const [userData, setUserData] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(null); // null = loading

  useEffect(() => {
    const loadUser = () => {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          setUserData(parsed);
          setUserLoggedIn(true);
        } else {
          setUserData(null);
          setUserLoggedIn(false);
        }
      } catch (err) {
        console.error("Failed to load user from localStorage:", err);
        setUserData(null);
        setUserLoggedIn(false);
      }
    };

    loadUser();
  }, []);

  if (userLoggedIn === null) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ userData, userLoggedIn, setUserData, setUserLoggedIn }}>
      <div className="App">
        <Router>
          <div className="content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/adminlogin" element={<AdminLogin />} />
              <Route path="/adminhome" element={<AdminHome />} />
              <Route path="/renter/delete-booking" element={<DeleteBooking />} />
              <Route path="/owner/delete-property" element={<DeleteProperty />} />


              {/* ✅ Nested Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminHome />
                  </AdminRoute>
                }
              >
                <Route index element={<AllUsers />} />
                <Route path="allusers" element={<AllUsers />} />
                <Route path="allbookings" element={<AllBookings />} />
                <Route path="allproperty" element={<AllProperty />} />
              </Route>

              {/* User Home Routes */}
              <Route path="/ownerhome" element={<OwnerHome />} />
              <Route path="/renterhome" element={<RenterHome />} />
            </Routes>
          </div>

          {/* Footer */}
          <footer className="bg-light text-center text-lg-start">
            <div className="text-center p-3">
              © {date} Copyright: RentEase
            </div>
          </footer>
        </Router>
      </div>
    </UserContext.Provider>
  );
}

export default App;
