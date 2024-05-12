import React, { useState } from 'react';
import { url } from '../../hooks/const';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';

import myHandleSubmit from "../../hooks/handleSubmit";

import './login.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  


  const handleSubmit = async (e) => {
    try {
      e.preventDefault(); // Prevent default form submission
      const data = await myHandleSubmit(`${url}login`, { email, password });

      if (data.status === 200) {
        localStorage.setItem('user', data.data.user);
        window.location = '/chat';
      }
    } catch (error) {
      setMessage(error.detail || 'An error occurred during login.');
    }
  };
  

  return (
    <Container className='center'>
      <Box className="login-box" >

        <h2 className='headline'>Login</h2>
        
        {message && (
          <Box className="alert alert-warning mt-3" role="alert">
            {message}
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <List>
            <ListItem>
              <TextField
                label="Email"
                variant="standard"
                type="email"
                className="form-control text-field-style"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </ListItem>

            <ListItem className="form-group">
              <TextField
                label="Password"
                variant="standard"
                type="password"
                className="form-control text-field-style"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </ListItem>

            <br />
            <Button type="submit" className="btn btn-warning btn-block" sx={{ background: '#FFA836', color: 'white' }}>Login</Button>
          </List>
        </form>

        <br />
        <div>
          <b>Don't have an account?</b> <Link to={'/register'}>Register</Link>
        </div>
        <br />
        <br />
      </Box>

    </Container>

  
  

  );
};

export default Login;
