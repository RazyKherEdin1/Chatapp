import React, { useState } from 'react';
import { url } from '../../hooks/const';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';

import myHandleSubmit from "../../hooks/handleSubmit";

import './register.css'


const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [email,setEmail] = useState('')
  const [confirmPassword,setConfirmPassword] = useState('')
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(username == ""){
      setMessage("You must enter username")
      return false
    }
    else if(email == ""){
      setMessage("You must enter email")
      return false
    }
    else if(!(/(?=.{8,})/.test(password))){
      setMessage("You must enter password between 8-15 characters")
      return false
    }
    else if(confirmPassword != password){
      return false
    }
    try {
      const response = await myHandleSubmit(`${url}register`, {
        username,
        password,
        email
      });
     
      setMessage(response.data.message);
    } catch (error) {
    
      setMessage(error.response.data.detail);
    }
  };

  
  return (
    <Container className='center'>
      <Box className='register-box'>
        
      <h2 className='headline'>User Registration</h2>
        {message && (
          <Box className="alert alert-warning mt-4" role="alert">
            {message}
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <List>
            <ListItem>
              <TextField 
                label="Username"
                variant="standard"
                type="text"
                className="form-control text-field-style"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </ListItem>
            
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

            <ListItem>
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

            <ListItem>
              <TextField 
                label="Confirm Password"
                variant="standard"
                type="password"
                className="form-control text-field-style"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </ListItem>
          </List>

          {password !== confirmPassword && confirmPassword.length > 0 && (
            <Box className="text-danger">Passwords do not match</Box>
          )}
          <br />
          <Button type="submit" className="btn btn-warning btn-block" sx={{ background: '#FFA836', color: 'white' }}>Register</Button>
        </form>
        
        <br />
        <Link to={'/'}>Already have an account? Login</Link>
        <br />
        <br />
      </Box>
     
    </Container>
  
  );
};

export default Register;
