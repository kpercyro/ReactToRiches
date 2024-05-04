import React, { useState } from 'react';
import { Button, Grid, TextField, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Navigation from '../Navigation';

const Stocks = () => {
  const [tickerSymbol, setTickerSymbol] = useState('');
  const [timeframe, setTimeframe] = useState('1day'); // Default timeframe
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);

  const handleTickerSymbolChange = (event) => {
    setTickerSymbol(event.target.value);
  };

  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
  };

  const handleSearchStock = async () => {
    try {
      
      const response = await fetch('/api/getStockData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol: tickerSymbol }),
      });

      if (!response.ok) {
        const data = await response.json();

        // Check if the error indicates API rate limit exceeded
        if (response.status === 429) {
          setError('API rate limit exceeded (25 calls/day). Please try again later.');
        } else {
          setError('Error fetching stock data');
        }

        setStockData(null);
        return;
      }

      const data = await response.json();
      setStockData(data.express);
      setError(null);
    } catch (error) {
      console.error(error);
      setStockData(null);
      setError('Error fetching stock data');
    }
  };

  return (
    <>
      <Navigation />

      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            Stock Prices
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Ticker Symbol"
            variant="outlined"
            value={tickerSymbol}
            onChange={handleTickerSymbolChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="timeframe-select">Timeframe</InputLabel>
            <Select
              value={timeframe}
              onChange={handleTimeframeChange}
              label="Timeframe"
              inputProps={{
                name: 'timeframe',
                id: 'timeframe-select',
              }}
            >
              <MenuItem value="1day">1 Day</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSearchStock}>
            Search Stock
          </Button>
        </Grid>
        {error && (
          <Grid item xs={12}>
            <Typography variant="body1" align="center" color="error">
              {error}
            </Typography>
          </Grid>
        )}
        {stockData && (
          <Grid item xs={12}>
            <Typography variant="h5" align="center" gutterBottom>
              Stock Information
            </Typography>
            <Typography align="center">
              Ticker Symbol: {stockData.symbol}
            </Typography>
            <Typography align="center">
              Latest Price: {stockData.latestPrice}
            </Typography>
            <Typography align="center">
              Open: {stockData.open}
            </Typography>
            <Typography align="center">
              High: {stockData.high}
            </Typography>
            <Typography align="center">
              Low: {stockData.low}
            </Typography>
            <Typography align="center">
              Close: {stockData.close}
            </Typography>
            <Typography align="center">
              Volume: {stockData.volume}
            </Typography>
            {/* Add more stock information properties here */}
            {/* Add visual representation here */}
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default Stocks;
