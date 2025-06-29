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
import FinalizePayment from './FinalizePayment';

const AllProperty = ({ renterId }) => {
  const [allProperties, setAllProperties] = useState([]);
  const [openPaymentFor, setOpenPaymentFor] = useState(null);

  // ✅ Fetch all renter bookings
  useEffect(() => {
    const getAllBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8001/api/user/renter-bookings/${renterId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );

        if (response.data.success) {
          setAllProperties(response.data.data);
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        console.error("Error loading renter bookings:", error);
        message.error("Failed to fetch bookings");
      }
    };

    if (renterId) getAllBookings();
  }, [renterId]);

  // ✅ Handle booking deletion
  

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="bookings table">
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Property ID</TableCell>
              <TableCell align="center">Tenant Name</TableCell>
              <TableCell align="center">Phone</TableCell>
              <TableCell align="center">Booking Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {allProperties.map((booking) => (
              <React.Fragment key={booking._id}>
                <TableRow>
                  <TableCell>{booking._id}</TableCell>
                  <TableCell>{booking.propertyId?._id || booking.propertyId || "N/A"}</TableCell>
                  <TableCell align="center">{booking.userName}</TableCell>
                  <TableCell align="center">{booking.phone}</TableCell>
                  <TableCell align="center">{booking.bookingStatus}</TableCell>
                  <TableCell align="center">
                    {["Approved", "booked"].includes(booking.bookingStatus) && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          setOpenPaymentFor(openPaymentFor === booking._id ? null : booking._id)
                        }
                      >
                        PAY
                      </Button>
                    )}
                    
                  </TableCell>
                </TableRow>

                {/* Payment Row */}
                {openPaymentFor === booking._id && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <FinalizePayment booking={booking} />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AllProperty;
