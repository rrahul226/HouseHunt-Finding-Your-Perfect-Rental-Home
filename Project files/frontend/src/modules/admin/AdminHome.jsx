import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import AllUsers from './AllUsers';
import AllProperty from './AllProperty';
import AllBookings from './AllBookings';
import { FaBars } from 'react-icons/fa';
import '@fortawesome/fontawesome-free/css/all.min.css'; 

const AdminHome = () => {
  const user = useContext(UserContext);
  const [activeComponent, setActiveComponent] = useState('users');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? '200px' : '60px',
          background: '#f5f5f5',
          minHeight: '100vh',
          transition: 'width 0.3s',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div style={{ padding: '10px', cursor: 'pointer' }} onClick={toggleSidebar}>
            <FaBars size={24} />
          </div>
          {sidebarOpen && (
            <div style={{ padding: '10px' }}>
              <h4>Dashboard</h4>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li style={{ margin: '10px 0', cursor: 'pointer' }} onClick={() => setActiveComponent('users')}>
                  All Users
                </li>
                <li style={{ margin: '10px 0', cursor: 'pointer' }} onClick={() => setActiveComponent('properties')}>
                  All Properties
                </li>
                <li style={{ margin: '10px 0', cursor: 'pointer' }} onClick={() => setActiveComponent('bookings')}>
                  All Bookings
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Logout Button */}
        {sidebarOpen && (
          <div style={{ padding: '20px' }}>
            <button
              onClick={handleLogOut}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flexGrow: 1 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px'
        }}>
          <h2>RentEase</h2>
          <div>
            <span style={{
              marginRight: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              Hi Admin.. {user.userData.name}  <i className="far fa-user"> </i>
            </span>
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          {activeComponent === 'users' && <AllUsers />}
          {activeComponent === 'properties' && <AllProperty />}
          {activeComponent === 'bookings' && <AllBookings />}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
