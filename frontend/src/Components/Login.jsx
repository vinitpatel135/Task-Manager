import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import api from '../Common/Api';
import { useNavigate } from 'react-router-dom';

const Login = ({Auth}) => {
  const [userData, setuserData] = useState({
    email:"",
    password:""
  })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.login({...userData})
      console.log('Login Successful', response.data);
      if(response.data.message === "Success"){
        localStorage.setItem("token", JSON.stringify(response.data.token))
        navigate("/home")
      }
    } catch (error) {
      console.error('Login Failed', error);
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
      <Typography variant="h4" gutterBottom>Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userData.email}
          onChange={(e) => setuserData({ ...userData ,email: e.target.value})}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userData.password}
          onChange={(e) => setuserData({ ...userData ,password: e.target.value})}
        />
        <Button type="submit" variant="contained" color="primary" className='mt-3' fullWidth>
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;
