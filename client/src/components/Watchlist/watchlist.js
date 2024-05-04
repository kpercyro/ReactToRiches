import React, { useState, useEffect } from 'react';
import { Button, Grid, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Navigation from '../Navigation';

const Watchlist = () => {
  const [stockName, setStockName] = useState('');
  const [watchlist, setWatchlist] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const response = await fetch('/api/getWatchlist');
      if (!response.ok) {
        throw new Error('Failed to fetch watchlist');
      }
      const data = await response.json();
      // Ensure data.watchlist is not null before setting watchlist
      setWatchlist(data.watchlist || []);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      setError('Failed to fetch watchlist. Please try again.');
    }
  };

  const handleStockNameChange = (event) => {
    setStockName(event.target.value);
  };

  const handleAddToFavorites = async () => {
    if (stockName.trim() === '') {
      return;
    }
  
    // Check if watchlist is null
    if (watchlist === null) {
      return;
    }
  
    if (watchlist.some(stock => stock.name.toLowerCase() === stockName.toLowerCase())) {
      setError('Stock already exists in the watchlist.');
      return;
    }
  
    const response = await fetch('/api/addToWatchlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stockName: stockName,
      }),
    });
  
    if (!response.ok) {
      console.error('Failed to add stock to watchlist');
      setError('Failed to add stock to watchlist. Please try again.');
      return;
    }
  
    fetchWatchlist();
    setStockName('');
  };

  const handleDeleteFromFavorites = async (stockNameToDelete) => {
    try {
      const response = await fetch('/api/deleteFromWatchlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stockName: stockNameToDelete,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete stock from watchlist');
      }
      setWatchlist(watchlist.filter(stock => stock.name !== stockNameToDelete));
    } catch (error) {
      console.error('Error deleting stock from watchlist:', error);
      setError('Failed to delete stock from watchlist. Please try again.');
    }
  };

  return (
    <>
      <Navigation />
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            Stock Watchlist
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Stock Name"
            variant="outlined"
            value={stockName}
            onChange={handleStockNameChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleAddToFavorites}>
            Add to Favorites
          </Button>
        </Grid>
        <Grid item xs={12}>
          {error && <Typography variant="body1" color="error" align="center" gutterBottom>{error}</Typography>}
          <Typography variant="h5" align="center" gutterBottom>
            Your Watchlist
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Stock Name</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {watchlist.map((stock, index) => (
                  <TableRow key={index}>
                    <TableCell>{stock.name}</TableCell> {/* Access 'name' property */}
                    <TableCell>
                      <Button variant="outlined" color="secondary" onClick={() => handleDeleteFromFavorites(stock.name)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default Watchlist;
