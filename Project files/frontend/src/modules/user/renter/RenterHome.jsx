import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav, Row, Col, Button } from 'react-bootstrap';
import { UserContext } from '../../../App';
import AllPropertiesCards from '../AllPropertiesCards';
import AllProperty from './AllProperties';


const RenterHome = () => {
  const { userData, userLoggedIn } = useContext(UserContext);
  const [tab, setTab] = useState("properties");

  useEffect(() => {
    console.log("USER CONTEXT:", userData, userLoggedIn);
  }, [userData, userLoggedIn]);

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (!userData) {
    return (
      <div style={{ padding: "2rem", fontFamily: "Arial" }}>
        <h4>Loading renter dashboard...</h4>
      </div>
    );
  }

  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand><h2>RentEase</h2></Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" navbarScroll />
            <Nav>
              <h5 className='mx-3'>Hi {userData.name}</h5>
              <Link onClick={handleLogOut} to="/">Log Out</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col md={2} style={{ background: "#f8f9fa", minHeight: "100vh", paddingTop: "1rem" }}>
            <Button variant="light" className="w-100 mb-2" onClick={() => setTab("properties")}>
              All Properties
            </Button>
            <Button variant="light" className="w-100 mb-2" onClick={() => setTab("bookings")}>
              Booking History
            </Button>
            <Button variant="light" className="w-100 mb-2" onClick={() => setTab("transactions")}>
              Transactions
            </Button>
          </Col>

          {/* Main Content */}
          <Col md={10} style={{ padding: "2rem" }}>
            {tab === "properties" && (
              <AllPropertiesCards loggedIn={userLoggedIn} />
            )}

            {tab === "bookings" && (
              <AllProperty renterId={userData._id} />
            )}

           
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RenterHome;
