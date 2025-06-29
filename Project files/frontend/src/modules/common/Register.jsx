import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from 'react-bootstrap';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { message } from 'antd';

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    type: ""
  });

  const [loading, setLoading] = useState(false); // ⏳ Spinner

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data?.name || !data?.email || !data?.password || !data?.type) {
      return alert("Please fill all fields");
    }

    setLoading(true); // ⏳ Spinner starts
    try {
      const res = await axios.post("http://localhost:8001/api/user/register", data);

      setLoading(false); // ⏹️ Spinner stops

      if (res.data.success) {
        message.success(res.data.message || "Registered successfully");

        // ✅ Show alert if it's Owner
        if (data.type === "Owner") {
          alert("Waiting for admin approval.");
        }

        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      message.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand><h2>RentEase</h2></Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll />
            <Nav>
              <Link to={'/'}>Home</Link>
              <Link to={'/login'}>Login</Link>
              <Link to={'/register'}>Register</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container component="main">
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              fullWidth
              id="name"
              label="Renter Full Name/Owner Name"
              name="name"
              value={data.name}
              onChange={handleChange}
              autoComplete="name"
              autoFocus
            />
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={data.email}
              onChange={handleChange}
              autoComplete="email"
            />
            <TextField
              margin="normal"
              fullWidth
              name="password"
              value={data.password}
              onChange={handleChange}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <InputLabel id="user-type-label">User Type</InputLabel>
            <Select
              labelId="user-type-label"
              id="type"
              name="type"
              value={data.type}
              label="type"
              onChange={handleChange}
              style={{ width: '200px' }}
            >
              <MenuItem value={'Select User'} disabled>Select User</MenuItem>
              <MenuItem value={'Renter'}>Renter</MenuItem>
              <MenuItem value={"Owner"}>Owner</MenuItem>
            </Select>
            <Box mt={2}>
              <Button
                type="submit"
                variant="contained"
                style={{ width: '200px' }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
              </Button>
            </Box>
            <Grid container>
              <Grid item>Have an account?
                <Link style={{ color: "blue" }} to={'/login'} variant="body2">
                  {" Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Register;
