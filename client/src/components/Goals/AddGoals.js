import React, { useState } from 'react';
import Navigation from '../Navigation';
import { Link } from 'react-router-dom';
import { Button, Grid, TextField } from '@mui/material';
import { useSelector } from 'react-redux';

const BudgetEditor = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [targetAmountError, setTargetAmountError] = useState(false);
  const [targetDateError, setTargetDateError] = useState(false);

  const account = useSelector(state => state.account.value);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    setTitleError(false);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
    setDescriptionError(false);
  };

  const handleTargetAmountChange = (event) => {
    const value = event.target.value;
    if (!isNaN(value) && parseFloat(value) >= 0) {
      setTargetAmount(value);
      setTargetAmountError(false);
    } else {
      setTargetAmount('');
      setTargetAmountError(true);
    }
  };

  const handleTargetDateChange = (event) => {
    setTargetDate(event.target.value);
    setTargetDateError(false);
  };

  const addFinancialGoal = async () => {
    const url = '/api/addFinancialGoal';
    const reqBody = JSON.stringify({
      title: title,
      description: description,
      targetAmount: targetAmount,
      targetDate: targetDate,
      userid: account.id, // Add account.id as userid
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: reqBody,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add financial goal');
    }

    return await response.json();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !description || !targetAmount || !targetDate) {
      setTitleError(!title);
      setDescriptionError(!description);
      setTargetAmountError(!targetAmount);
      setTargetDateError(!targetDate);
      return;
    }
    try {
      await addFinancialGoal();
      setTitle('');
      setDescription('');
      setTargetAmount('');
      setTargetDate('');
      console.log('Financial goal added successfully!');
    } catch (error) {
      console.error('Failed to add financial goal:', error);
    }
  };

  return (
    <>
      <Navigation />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        <h1 style={{ margin: 0 }}>Add Financial Goal</h1>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <Link to="/goals" style={{ textDecoration: 'none' }}>
            <Button variant="contained">Return to Goals Home</Button>
          </Link>
        </div>
      </div>

      <div style={{ margin: '0 auto', maxWidth: 400, padding: '20px' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                variant="outlined"
                value={title}
                onChange={handleTitleChange}
                error={titleError}
                helperText={titleError ? 'Please enter a title' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                value={description}
                onChange={handleDescriptionChange}
                error={descriptionError}
                helperText={descriptionError ? 'Please enter a description' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Target Amount"
                variant="outlined"
                type="number"
                value={targetAmount}
                onChange={handleTargetAmountChange}
                error={targetAmountError}
                helperText={targetAmountError ? 'Please enter a non-negative number' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Target Date"
                variant="outlined"
                type="date"
                value={targetDate}
                onChange={handleTargetDateChange}
                error={targetDateError}
                helperText={targetDateError ? 'Please select a target date' : ''}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Add Financial Goal
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
};

export default BudgetEditor;
