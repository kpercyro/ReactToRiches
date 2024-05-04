import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Paper, Typography, Chip } from '@mui/material';
import Navigation from '../Navigation';

const Community = () => {
  const [communities, setCommunities] = useState([]);
  const [newCommunity, setNewCommunity] = useState({ name: '', description: '' });
  const [friends, setFriends] = useState([]);
  const [newFriend, setNewFriend] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Fetch communities and friends when the component mounts
    getCommunities();
    getFriends();
  }, []);

  const getCommunities = async () => {
    try {
      const response = await fetch('/api/getCommunities');
      const data = await response.json();

      if (response.status === 200) {
        setCommunities(data.communities);
      } else {
        console.error('Failed to fetch communities:', data.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const createCommunity = async () => {
    try {
      const response = await fetch('/api/createCommunity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCommunity),
      });

      const data = await response.json();

      if (response.status === 201) {
        // Community created successfully, update the list of communities
        getCommunities();
        // Clear the form
        setNewCommunity({ name: '', description: '' });
      } else {
        console.error('Failed to create community:', data.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

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

  const addFriend = async () => {
    try {
      const response = await fetch('/api/addFriend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newFriend, email: userEmail }),
      });

      const data = await response.json();

      if (response.status === 201) {
        // Friend added successfully, update the list of friends
        getFriends();
        // Clear the form
        setNewFriend('');
        setUserEmail('');
      } else {
        console.error('Failed to add friend:', data.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const deleteFriend = async (friendId) => {
    try {
      const response = await fetch(`/api/deleteFriend/${friendId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.status === 200) {
        // Friend deleted successfully, update the list of friends
        getFriends();
      } else {
        console.error('Failed to delete friend:', data.message);
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
            Communities
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Create New Community
            </Typography>
            <TextField
              label="Name"
              fullWidth
              value={newCommunity.name}
              onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={newCommunity.description}
              onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={createCommunity}>
              Create Community
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              All Communities
            </Typography>
            {communities.map((community) => (
              <Chip key={community.id} label={community.name} style={{ margin: '5px' }} />
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            Friends
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Paper  elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Add New Friend
            </Typography>
            <TextField
              label="Name"
              fullWidth
              value={newFriend}
              onChange={(e) => setNewFriend(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Email"
              fullWidth
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={addFriend}>
              Add Friend
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              All Friends
            </Typography>
            {friends.map((friend) => (
              <Chip
                key={friend.id}
                label={friend.name}
                style={{ margin: '5px' }}
                onDelete={() => deleteFriend(friend.id)}
              />
            ))}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Community;

