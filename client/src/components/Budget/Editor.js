import React, { useState, useEffect } from 'react';
import Navigation from '../Navigation';
import { Link } from 'react-router-dom';
import { Button, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

const BudgetEditor = () => {
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionCategory, setTransactionCategory] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [categories, setCategories] = useState([]);
  
  const [savingAmount, setSavingAmount] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [savingDate, setSavingDate] = useState('');
  const [goals, setGoals] = useState([]);

  const account = useSelector(state => state.account.value);

  const [transactionAmountError, setTransactionAmountError] = useState(false);
  const [transactionCategoryError, setTransactionCategoryError] = useState(false);
  const [savingAmountError, setSavingAmountError] = useState(false);
  const [selectedGoalError, setSelectedGoalError] = useState(false);
  const [transactionDateError, setTransactionDateError] = useState(false);
  const [savingDateError, setSavingDateError] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/getCategories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        // Filter categories based on userid = account.id
        const filteredCategories = data.filter(cat => cat.userid === account.id);
        setCategories(filteredCategories);
      } catch (error) {
        console.error('Error fetching categories:', error.message);
      }
    };
    fetchCategories();
  }, [account.id]);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch('/api/getGoals');
        if (!response.ok) {
          throw new Error('Failed to fetch goals');
        }
        const data = await response.json();
        // Filter goals based on userid = account.id
        const filteredGoals = data.filter(goal => goal.userid === account.id);
        setGoals(filteredGoals);
      } catch (error) {
        console.error('Error fetching goals:', error.message);
      }
    };
    fetchGoals();
  }, [account.id]);

  const handleTransactionAmountChange = (event) => {
    const value = event.target.value;
    if (!isNaN(value) && parseFloat(value) >= 0) {
      setTransactionAmount(value);
      setTransactionAmountError(false);
    } else {
      setTransactionAmount('');
      setTransactionAmountError(true);
    }
  };

  const handleTransactionCategoryChange = (event) => {
    setTransactionCategory(event.target.value);
    setTransactionCategoryError(false);
  };

  const handleSavingAmountChange = (event) => {
    const value = event.target.value;
    if (!isNaN(value) && parseFloat(value) >= 0) {
      setSavingAmount(value);
      setSavingAmountError(false);
    } else {
      setSavingAmount('');
      setSavingAmountError(true);
    }
  };

  const handleSelectedGoalChange = (event) => {
    setSelectedGoal(event.target.value);
    setSelectedGoalError(false);
  };

  const handleTransactionDateChange = (event) => {
    setTransactionDate(event.target.value);
    setTransactionDateError(false);
  };

  const handleSavingDateChange = (event) => {
    setSavingDate(event.target.value);
    setSavingDateError(false);
  };

  const writeBudgetEntry = async (amount, category, date, userid) => {
    const url = '/api/writeBudgetEntry';
    const reqBody = JSON.stringify({
      amount: amount,
      category: category,
      date: date,
      userid: userid, 
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
      throw new Error(error.message || 'Failed to submit budget entry');
    }

    return await response.json();
  };

  const handleSubmitTransaction = async (event) => {
    event.preventDefault(); // Prevent form submission
    if (!transactionAmount || !transactionCategory || !transactionDate) {
      setTransactionAmountError(!transactionAmount);
      setTransactionCategoryError(!transactionCategory);
      setTransactionDateError(!transactionDate);
      return;
    }
    try {
      const res = await writeBudgetEntry(transactionAmount, transactionCategory, transactionDate, account.id); // Pass account.id as userid
      console.log('writeBudgetEntry returned:', res);
      setTransactionAmount('');
      setTransactionCategory('');
      setTransactionDate('');

      // Fetch updated categories after adding a new one
      const updatedCategories = await fetchUpdatedCategories();
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Failed to save budget entry:', error);
    }
  };

  const handleSubmitSaving = async (event) => {
    event.preventDefault(); // Prevent form submission
    if (!savingAmount || !selectedGoal || !savingDate) {
      setSavingAmountError(!savingAmount);
      setSelectedGoalError(!selectedGoal);
      setSavingDateError(!savingDate);
      return;
    }
    try {
      // Handle saving entry submission
    } catch (error) {
      console.error('Failed to save budget entry:', error);
    }
  };

  const fetchUpdatedCategories = async () => {
    try {
      const response = await fetch('/api/getCategories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      return [];
    }
  };

  return (
    <>
      <Navigation />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        <h1 style={{ margin: 0 }}>Add Transactions and Savings</h1>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <Link to="/budget" style={{ textDecoration: 'none' }}>
            <Button variant="contained">Return to Budget Home</Button>
          </Link>
          <Link to="/limits" style={{ textDecoration: 'none' }}>
            <Button variant="contained">Set Budget Limits</Button>
          </Link>
          <Link to="/viewTransactions" style={{ textDecoration: 'none' }}>
            <Button variant="contained">View Transactions & Savings</Button>
          </Link>
          <Link to="/categories" style={{ textDecoration: 'none' }}>
            <Button variant="contained">View Categories</Button>
          </Link>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ margin: '0 auto', maxWidth: 400, padding: '2px', width: '50%' }}>
          <Typography variant="h4" gutterBottom style={{ marginTop: '20px', textAlign: 'center' }}>
            Add Transaction
          </Typography>
          <form onSubmit={handleSubmitTransaction}>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amount"
                  variant="outlined"
                  type="number"
                  value={transactionAmount}
                  onChange={handleTransactionAmountChange}
                  error={transactionAmountError}
                  helperText={transactionAmountError ? 'Please enter a non-negative number' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  variant="outlined"
                  value={transactionCategory}
                  onChange={handleTransactionCategoryChange}
                  error={transactionCategoryError}
                  helperText={transactionCategoryError ? 'Please select a category' : ''}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.category_name} value={cat.category_name}>
                      {cat.category_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date"
                  variant="outlined"
                  type="date"
                  value={transactionDate}
                  onChange={handleTransactionDateChange}
                  error={transactionDateError}
                  helperText={transactionDateError ? 'Please select a date' : ''}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} style={{ textAlign: 'right' }}>
                <Button type="submit" variant="contained" color="primary">
                  Submit Transaction
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
        
        <div style={{ margin: '0 auto', maxWidth: 400, padding: '2px', width: '50%' }}>
          <Typography variant="h4" gutterBottom style={{ marginTop: '20px', textAlign: 'center' }}>
            Add Savings
          </Typography>
          <form onSubmit={handleSubmitSaving}>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amount"
                  variant="outlined"
                  type="number"
                  value={savingAmount}
                  onChange={handleSavingAmountChange}
                  error={savingAmountError}
                  helperText={savingAmountError ? 'Please enter a non-negative number' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Towards"
                  variant="outlined"
                  value={selectedGoal}
                  onChange={handleSelectedGoalChange}
                  error={selectedGoalError}
                  helperText={selectedGoalError ? 'Please select a goal' : ''}
                >
                  {goals.map((goal) => (
                    <MenuItem key={goal.title} value={goal.title}>
                      {goal.title}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date"
                  variant="outlined"
                  type="date"
                  value={savingDate}
                  onChange={handleSavingDateChange}
                  error={savingDateError}
                  helperText={savingDateError ? 'Please select a date' : ''}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} style={{ textAlign: 'right' }}>
                <Button type="submit" variant="contained" color="primary">
                  Submit Saving
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>
    </>
  );
};

export default BudgetEditor;