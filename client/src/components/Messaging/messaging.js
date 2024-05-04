import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem } from '@mui/material'; // Add MenuItem
import Navigation from '../Navigation';
const Messaging = () => {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sentMessages, setSentMessages] = useState([]);

  useEffect(() => {
    // Fetch friends and sent messages when the component mounts
    getFriends();
    getSentMessages();
  }, []);

  const getFriends = async () => {
    try {
      const response = await fetch('/api/getFriends');
      const data = await response.json();

      if (response.status === 200) {
        setFriends(data.friends);
      } else {
        console.error('Failed to fetch friends:', data.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const getSentMessages = async () => {
    try {
      const response = await fetch('/api/getSentMessages');
      const data = await response.json();

      if (response.status === 200) {
        setSentMessages(data.messages);
      } else {
        console.error('Failed to fetch sent messages:', data.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const sendMessage = async () => {
    try {
      const response = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipientName: selectedFriend, messageText }),
      });

      const data = await response.json();

      if (response.status === 201) {
        // Message sent successfully, update the sent messages
        getSentMessages();
        // Clear the form
        setSelectedFriend('');
        setMessageText('');
      } else {
        console.error('Failed to send message:', data.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <>
      <Navigation />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            Send Message
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Select Friend
            </Typography>
            <TextField
              select
              label="Friend"
              fullWidth
              value={selectedFriend}
              onChange={(e) => setSelectedFriend(e.target.value)}
              margin="normal"
            >
              {friends.map((friend) => (
                <MenuItem key={friend.id} value={friend.name}>
                  {friend.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Message"
              fullWidth
              multiline
              rows={3}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={sendMessage}>
              Send Message
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Sent Messages
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Recipient</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Sent Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sentMessages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>{message.recipient_name}</TableCell>
                      <TableCell>{message.message_text}</TableCell>
                      <TableCell>{message.sent_time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Messaging;
