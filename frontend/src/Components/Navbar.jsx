import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = ({ Auth, handleLogout }) => {
  return (
    <AppBar position="static">
      <Toolbar className="container">
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Task Manager
        </Typography>
        
        {Auth && Auth._id ? (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
