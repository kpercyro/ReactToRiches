import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../Navigation';
import { Button, Grid, MenuItem, TextField } from '@mui/material';
import { useSelector } from 'react-redux';

const Limits = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [limitValue, setLimitValue] = useState('');
  const [categoryError, setCategoryError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiResponse, setApiResponse] = useState(null);
  const account = useSelector(state => state.account.value);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/getCategories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error.message);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleLimitChange = (event) => {
    setLimitValue(event.target.value);
  };

  const updateCategoryLimit = async (category, limitValue) => {
    try {
      const url = '/api/updateCategoryLimit';
      const reqBody = JSON.stringify({ category, limitValue });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: reqBody,
      });

      if (!response.ok) {
        throw new Error('Failed to update category limit');
      }

      const data = await response.json();
      setApiResponse(data); // Set API response
    } catch (error) {
      throw new Error(error.message || 'Failed to update category limit');
    }
  };

  const handleSubmit = async () => {
    if (!category || !limitValue) {
      setCategoryError(true);
      return;
    }
    setCategoryError(false);

    try {
      await updateCategoryLimit(category, limitValue);
      setCategory('');
      setLimitValue('');
    } catch (error) {
      console.error('Failed to update category limit:', error);
    }
  };

  const filterCategories = () => {
    let filteredCategories = []
    categories.map(category => {
      if (category.userid === account.id) {
        filteredCategories.push(category);
      }
    })
    return filteredCategories;
  }

  return (
    <>
      <Navigation />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        <h1 style={{ margin: 0 }}>Budget Limits</h1>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <Link to="/budget" style={{ textDecoration: 'none' }}>
            <Button variant="contained">Return to budget home</Button>
          </Link>
          <Link to="/expenses" style={{ textDecoration: 'none' }}>
            <Button variant="contained">Add Transactions and Savings</Button>
          </Link>
          <Link to="/viewTransactions" style={{ textDecoration: 'none' }}>
            <Button variant="contained">View Transactions & Savings</Button>
          </Link>
          <Link to="/categories" style={{ textDecoration: 'none' }}>
            <Button variant="contained">View Categories</Button>
          </Link>
        </div>
      </div>
     
      <Grid container spacing={2} alignItems="center" justifyContent="center" style={{ width: '80%', margin: '0 auto' }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            label="Category"
            variant="outlined"
            value={category}
            onChange={handleCategoryChange}
            error={categoryError}
            helperText={categoryError ? 'Please select a category' : ''}
          >
            {loading ? (
              <MenuItem disabled>Loading...</MenuItem>
            ) : (
              filterCategories().map((cat) => (
                <MenuItem key={cat.category_name} value={cat.category_name}>
                  {cat.category_name}
                </MenuItem>
              ))
            )}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Category Limit"
            variant="outlined"
            type="number"
            value={limitValue}
            onChange={handleLimitChange}
            placeholder="Enter category limit"
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Update Category Limit
          </Button>
        </Grid>
        
      </Grid>
    </>
  );
};

export default Limits;
