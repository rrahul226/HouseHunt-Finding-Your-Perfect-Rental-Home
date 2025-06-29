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
import axios from 'axios';
import { message } from 'antd';

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    type: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data?.email || !data?.password) {
      return alert("Please fill all fields");
    }

    try {
      const res = await axios.post("http://localhost:8001/api/user/login", data);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        message.success("Login success successfully");

        const isLoggedIn = res.data.user;

        switch (isLoggedIn.type) {
          case "Admin":
            navigate("/adminhome");
            break;
          case "Renter":
            navigate("/renterhome");
            break;
          case "Owner":
            navigate("/ownerhome");
            break;
          default:
            navigate("/login");
            break;
        }

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("Waiting for admin approval.");
      } else if (error.response && error.response.status === 401) {
        alert("User doesn't exist");
      } else {
        message.error("Invalid credentials or server error");
      }
      navigate("/login");
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
            Sign In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={data.email}
              onChange={handleChange}
              autoComplete="email"
              autoFocus
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
            <Box mt={2}>
              <Button
                type="submit"
                variant="contained"
                style={{ width: '200px' }}
              >
                Sign In
              </Button>
            </Box>
            <Grid container>
              <Grid item>
                Forgot password?
                <Link style={{ color: "red" }} to={'/forgotpassword'}>
                  {" Click here"}
                </Link>
              </Grid>
              <Grid item style={{ marginLeft: 10 }}>
                Don’t have an account?
                <Link style={{ color: "blue" }} to={'/register'}>
                  {" Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
