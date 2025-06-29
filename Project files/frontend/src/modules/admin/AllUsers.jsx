import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

const AllUsers = () => {
  const [allUser, setAllUser] = useState([]);

  // 🔁 Fetch user list when component mounts
  useEffect(() => {
    getAllUser();
  }, []);

  // ✅ API to get all users
  const getAllUser = async () => {
    try {
      const response = await axios.get('http://localhost:8001/api/admin/getallusers', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      console.log("✅ Raw user response from backend:", response.data);

      if (response.data.success) {
        setAllUser(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      message.error("Error loading users.");
    }
  };

  // ✅ New granted status toggle using isApproved logic
  const toggleGrantedStatus = async (user) => {
    try {
      const newStatus = !user.granted;

      console.log("SENDING TO /handlestatus:", {
        userId: user._id,
        status: newStatus,
      });

      const res = await axios.post("http://localhost:8001/api/admin/handlestatus", {
        userId: user._id,
        status: newStatus,
      });

      console.log("✅ Status updated:", res.data);
      message.success("Status updated successfully");
      getAllUser(); // refresh data
    } catch (err) {
      console.error("❌ Error updating granted status:", err);
      message.error("Failed to update status");
    }
  };

  const handleStatus = async (userid, status) => {
    try {
      const res = await axios.post('http://localhost:8001/api/admin/handlestatus', { userid, status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      if (res.data.success) {
        getAllUser();
      }
    } catch (error) {
      console.error("❌ Error updating granted status:", error);
    }
  };

  const toggleApproval = async (id) => {
    try {
      await axios.patch(`http://localhost:8001/api/admin/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      getAllUser();
    } catch (error) {
      console.error("❌ Error toggling approval:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8001/api/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      getAllUser();
    } catch (error) {
      console.error("❌ Error deleting user:", error);
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="all users table">
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Granted (Old Logic)</TableCell>
              <TableCell align="center">isApproved (New)</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allUser.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user._id}</TableCell>
                <TableCell align="center">{user.name}</TableCell>
                <TableCell align="center">{user.email}</TableCell>
                <TableCell align="center">{user.type}</TableCell>
                <TableCell align="center">{user.granted || '-'}</TableCell>
                <TableCell align="center">{user.isApproved ? '✅' : '❌'}</TableCell>
                <TableCell align="center">
                  {/* ✅ Removed GRANT (OLD) button */}
                  {user.type === 'Owner' && user.granted === 'granted' && (
                    <Button
                      onClick={() => handleStatus(user._id, 'ungranted')}
                      size="small"
                      variant="outlined"
                      color="error"
                    >
                      Ungrant (Old)
                    </Button>
                  )}
                  <Button
                    onClick={() => toggleGrantedStatus(user)} // ✅ New usage
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ mb: 0.5 }}
                  >
                    Toggle Granted
                  </Button>
                  <Button
                    onClick={() => toggleApproval(user._id)}
                    size="small"
                    variant="contained"
                    sx={{ mx: 1, backgroundColor: user.isApproved ? '#FFA726' : '#66BB6A' }}
                  >
                    {user.isApproved ? "Unapprove" : "Approve"}
                  </Button>
                  <Button
                    onClick={() => deleteUser(user._id)}
                    size="small"
                    variant="contained"
                    color="error"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AllUsers;
