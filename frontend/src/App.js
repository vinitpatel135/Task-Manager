import React, { useState } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Register from './Components/Register';
import Login from './Components/Login';
import TaskList from './Screens/Task/TaskList';
import constents from './Common/constents';

function App() {
  const [Auth, setAuth] = useState(constents.getUserDetails())

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setAuth(null);
    window.location.href = '/login'; 
  };

  return (
    <BrowserRouter>
      <Navbar Auth={Auth} handleLogout={handleLogout} />
      <div className="container mt-5">
        <Routes>
          <Route path="/home" element={<TaskList Auth={Auth} />} />
          <Route path="/" element={<Login Auth={Auth} />} />
          <Route path="/register" element={<Register Auth={Auth} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
