import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav, Row, Col, Button } from 'react-bootstrap';
import { UserContext } from '../../../App';
import AddProperty from './AddProperty';
import AllProperties from './AllProperties';
import AllBookings from './AllBookings';
import TransactionHistory from '../../common/TransactionHistory'; // ✅ Already Imported

const OwnerHome = () => {
  const user = useContext(UserContext);
  const [tab, setTab] = useState("add");

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (!user) {
    return null;
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
              <h5 className='mx-3'>Hi {user.userData.name}</h5>
              <Link onClick={handleLogOut} to="/">Log Out</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid>
        <Row>
          {/* ✅ Sidebar */}
          <Col md={2} style={{ background: "#f8f9fa", minHeight: "100vh", paddingTop: "1rem" }}>
            <Button variant="light" className="w-100 mb-2" onClick={() => setTab("add")}>
              Add Property
            </Button>
            <Button variant="light" className="w-100 mb-2" onClick={() => setTab("properties")}>
              All Properties
            </Button>
            <Button variant="light" className="w-100 mb-2" onClick={() => setTab("bookings")}>
              All Bookings
            </Button>
           
          </Col>

          {/* ✅ Main Content */}
          <Col md={10} style={{ padding: "2rem" }}>
            {tab === "add" && <AddProperty />}
            {tab === "properties" && <AllProperties />}
            {tab === "bookings" && <AllBookings />}
            {tab === "transactions" && (
              <TransactionHistory userId={user.userData._id} />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OwnerHome;
