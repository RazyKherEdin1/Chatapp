import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCallback } from "react";
import { url } from "../../../hooks/const";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import ws from '../../../hooks/useWebSocket'
import './index.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const current_user_id = localStorage.getItem('user') 
 
  const [users,setUsers] = useState([])
  const [userDetails,setUserDetails] = useState({"username":null})

  useEffect(() => {
    fetchMessages();
  }, []);
  
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${url}messages`);
      setMessages(response.data.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const DeleteMessage = async (message_id) => {
    try {
      await axios.delete(`${url}message/${message_id}`);
      ws.send("");
    } catch (error) {
      alert("Something went wrong while deleting.");
    }
  }
  const getCurrentUserDetails = useCallback(async () => {
    try {
      const response = await axios.get(
        `${url}user/${current_user_id}`
      );
      setUserDetails({
        username: response.data.user.username,
      });
    } catch (error) {
      console.log(error);
    }
  }, [current_user_id]);


 const getAllUsers = async()=>{
  try {
    
    const response = await axios.get(`${url}get_all_users/`);
   
    setUsers(response.data.users)
  } catch (error) {
    console.log(error)
  }
 }

  useEffect(()=>{
    getAllUsers()
  },[])

  const sendMessage = () => {
    ws.send(newMessage);
   
    setNewMessage('')
  };

  useEffect(() => {
    getCurrentUserDetails();
  }, [getCurrentUserDetails]);

  
  useEffect(()=>{
    ws.onmessage = (e) => {
      const parse = JSON.parse(e.data)
      if(parse.message == "" || parse.type_offline){
       getAllUsers()
      }
      fetchMessages()
    };
  },[ws])
  
  return (
    <Container>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Box className='group-users-box'>
              <h4>Group Users</h4>
              <List>
                {users.map((data, index) => {
                  if (data.id !== current_user_id) {
                    return (
                      <React.Fragment key={index}>
                        <ListItem className='group-users-list-item'>
                          <Box className='group-users-list-box' style={{ backgroundColor: data.online ? 'green' : 'red'}}></Box>
                          <ListItemText primary={data.username} />
                        </ListItem>
                        <Divider sx={{ bgcolor: 'gray' }} />
                      </React.Fragment>
                    );
                  }
                  return null;
                })}
              </List>
            </Box>
          </Grid>

          <Grid item xs={8}>
            <Box className='chat-box'>
              <Box className='chat-box-massages'>
                {messages.map((message, index) => (
                  <Box key={index} className="mb-2">
                    <strong>
                      {message.sender_id == current_user_id ||
                      message.sender === "You"
                        ? "You"
                        : message.sender}
                      :
                    </strong>{" "}
                    {message.content}{" "}
                    {message.sender_id == current_user_id ? (
                      <Button
                        className="btn btn-danger delete-maseeage-button"
                        onClick={() => DeleteMessage(message.id)}
                      >
                        Delete
                      </Button>
                  ) : null}
                  
                </Box>
                ))}
              </Box>

              <Box className='input-maseeage-box'>
                <TextField
                  size="small"
                  fullWidth
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  sx={{ mr: 2 }}
                />
                <Button variant="contained" endIcon={<SendIcon />} sx={{ background: '#FFA836' }} onClick={sendMessage}>
                  Send
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box>
              <h4 style={{ textAlign: 'center' }}>{userDetails.username}</h4>
              <Button variant="contained" color="error" fullWidth onClick={() => {
                localStorage.removeItem('user');
                window.location = '/'; //login page
              }}>
                Logout
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Chat;
