import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import api from '../Common/Api';
import { useNavigate } from 'react-router-dom';

const Register = ({Auth}) => {
  const [userData, setuserData] = useState({
    fullName: "",
    email: "",
    password: ""
  })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.register({ ...userData })
      console.log('Registration Successful', response.data);
      if (response.data.message === "Success") {
        navigate("/")
      }
    } catch (error) {
      console.error('Registration Failed', error);
    }
  };
  useEffect(() => {
    if (Auth) {
      navigate("/home")
    }
    // eslint-disable-next-line
  }, [Auth])
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Register</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userData.fullName}
          onChange={(e) => setuserData({ ...userData, fullName: e.target.value })}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userData.email}
          onChange={(e) => setuserData({ ...userData, email: e.target.value })}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userData.password}
          onChange={(e) => setuserData({ ...userData, password: e.target.value })}
        />
        <Button type="submit" variant="contained" color="primary" className='mt-3' fullWidth>
          Register
        </Button>
      </form>
    </Container>
  );
};

export default Register;
