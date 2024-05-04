import React, { useState, useEffect } from 'react';
import Navigation from '../Navigation';
import { Link } from 'react-router-dom';
import { Button, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useSelector } from 'react-redux';

const GoalsLand = () => {
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [status, setStatus] = useState('');
  const account = useSelector(state => state.account.value);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/getGoals');
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error.message);
    }
  };

  const handleDelete = (goalId) => {
    console.log('Deleting goal with ID:', goalId);
    if (!goalId) {
      console.error('Invalid ID:', goalId);
      return;
    }

    if (window.confirm('Are you sure you want to delete this goal?')) {
      console.log('Confirmed deletion for ID:', goalId);
      fetch(`/api/deleteGoal/${goalId}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Delete response:', data);
          if (data.success) {
            console.log('Successfully deleted goal with ID:', goalId);
            setGoals(goals.filter((goal) => goal.id !== goalId));
          } else {
            console.error('Delete failed:', data.error);
          }
        })
        .catch((error) => console.error('Error deleting:', error));
    } else {
      console.log('Deletion cancelled for ID:', goalId);
    }
  };

  //Used so filter goals before rendering on page
  const filterGoals = () => {
    let filteredGoals = []
    goals.map(goal => {
      if(goal.userid === account.id) {
        filteredGoals.push(goal);
      }
    })
    return filteredGoals;
  }

  const handleOpenUpdateForm = (goal) => {
    setSelectedGoal(goal);
    setStatus(goal.status);
  };

  const handleCloseUpdateForm = () => {
    setSelectedGoal(null);
    setStatus('');
  };

  const handleStatusChange = async () => {
    if (!selectedGoal || !status) {
      console.error('Invalid selected goal or status:', selectedGoal, status);
      return;
    }

    const url = `/api/updateStatus/${selectedGoal.id}`;
    const reqBody = JSON.stringify({ status });

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: reqBody,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update status');
      }

      const updatedGoal = { ...selectedGoal, status };
      setGoals(goals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal)));
      handleCloseUpdateForm();
    } catch (error) {
      console.error('Error updating status:', error.message);
    }
  };

  const handleDeleteClick = (goalId) => {
    handleDelete(goalId);
  };

  return (
    <>
      <Navigation />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        <h1 style={{ margin: 0 }}>Financial Goals</h1>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <Link to="/addGoals" style={{ textDecoration: 'none' }}>
            <Button variant="contained">Add a Financial Goal</Button>
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <table style={{ width: '80%', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #333' }}>
              <th>Title</th>
              <th>Description</th>
              <th>Target Amount</th>
              <th>Target Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filterGoals().map((goal) => (
              <tr key={goal.id} style={{ borderBottom: '1px solid #ccc' }}>
                <td style={{ padding: '8px' }}>{goal.title}</td>
                <td style={{ padding: '8px' }}>{goal.description}</td>
                <td style={{ padding: '8px' }}>{goal.targetAmount}</td>
                <td style={{ padding: '8px' }}>{new Date(goal.targetDate).toLocaleDateString()}</td>
                <td style={{ padding: '8px' }}>{goal.status}</td>
                <td style={{ padding: '8px' }}>
                  <Button onClick={() => handleOpenUpdateForm(goal)}>Update Status</Button>
                  <Button onClick={() => handleDeleteClick(goal.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={selectedGoal !== null} onClose={handleCloseUpdateForm}>
        <DialogTitle>Update Status</DialogTitle>
        <DialogContent>
          <Select
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ marginBottom: '10px' }}
          >
            <MenuItem value="Not started">Not started</MenuItem>
            <MenuItem value="In progress">In progress</MenuItem>
            <MenuItem value="Complete">Complete</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateForm}>Cancel</Button>
          <Button onClick={handleStatusChange} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GoalsLand;
