import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, Modal, Fade } from '@mui/material';
import Navigation from '../Navigation';

const CreditScore = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    income: '',
    employmentStatus: '',
    monthlyExpenses: '',
    savings: '',
    debt: '',
  });
  const [creditScores, setCreditScores] = useState([]);
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchCreditScores = async () => {
      try {
        const response = await fetch('/api/getCreditScores');
        if (!response.ok) {
          throw new Error('Failed to fetch credit scores');
        }
        const data = await response.json();
        setCreditScores(data);
      } catch (error) {
        console.error('Error fetching credit scores:', error);
        // Handle error (e.g., display error message to the user)
      }
    };

    fetchCreditScores();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const roughCreditScore = calculateCreditScore(formData);
    const newCreditScoreEntry = {
      date: new Date().toLocaleDateString(),
      roughCreditScore: roughCreditScore,
      ...formData,
    };

    try {
      const response = await fetch('/api/addCreditScore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCreditScoreEntry),
      });

      if (!response.ok) {
        throw new Error('Failed to add credit score');
      }

      // If the credit score is successfully added to the database,
      // update the local state to display it in the table
      setCreditScores([...creditScores, newCreditScoreEntry]);
      setFormData({
        name: '',
        age: '',
        income: '',
        employmentStatus: '',
        monthlyExpenses: '',
        savings: '',
        debt: '',
      });
    } catch (error) {
      console.error('Error adding credit score:', error);
      // Handle error (e.g., display error message to the user)
    }
  };

  const calculateCreditScore = (data) => {
    let creditScore = 0;
    if (parseInt(data.age) >= 18) {
      creditScore += parseInt(data.age) - 18;
    }
    if (parseInt(data.income) >= 20000 && parseInt(data.income) < 50000) {
      creditScore += 50;
    } else if (parseInt(data.income) >= 50000) {
      creditScore += 100;
    }
    if (data.employmentStatus === 'employed') {
      creditScore += 50;
    }
    creditScore += parseInt(data.monthlyExpenses) / 100;
    creditScore += parseInt(data.savings) / 500;
    creditScore -= parseInt(data.debt) / 1000;

    return creditScore;
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Navigation />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            Credit Score Creator
            <Button onClick={handleOpen} style={{ marginLeft: '10px' }} size="small" variant="outlined">More Info</Button>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Yearly Income"
                    name="income"
                    type="number"
                    value={formData.income}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    select
                    label="Employment Status"
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="employed">Employed</MenuItem>
                    <MenuItem value="unemployed">Unemployed</MenuItem>
                    <MenuItem value="self-employed">Self-Employed</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Monthly Expenses"
                    name="monthlyExpenses"
                    type="number"
                    value={formData.monthlyExpenses}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Total Savings"
                    name="savings"
                    type="number"
                    value={formData.savings}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Total Debt"
                    name="debt"
                    type="number"
                    value={formData.debt}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Credit Score History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Rough Credit Score</TableCell> {/* Changed from Credit Score to Rough Credit Score */}
                    <TableCell>Name</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell>Income</TableCell>
                    <TableCell>Employment Status</TableCell>
                    <TableCell>Monthly Expenses</TableCell>
                    <TableCell>Savings</TableCell>
                    <TableCell>Debt</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {creditScores.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.roughCreditScore}</TableCell> {/* Changed from creditScore to roughCreditScore */}
                      <TableCell>{entry.name}</TableCell>
                      <TableCell>{entry.age}</TableCell>
                      <TableCell>{entry.income}</TableCell>
                      <TableCell>{entry.employmentStatus}</TableCell>
                      <TableCell>{entry.monthlyExpenses}</TableCell>
                      <TableCell>{entry.savings}</TableCell>
                      <TableCell>{entry.debt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* More Info Modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slotProps={{ backdrop: {} }}
      >
        <Fade in={open}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', maxWidth: '500px', margin: 'auto', marginTop: '100px' }}>
            <Typography variant="h5" id="transition-modal-title" gutterBottom>
              Credit Score Information
            </Typography>
            <Typography id="transition-modal-description" gutterBottom>
              A credit score is a numerical expression based on a level analysis of a person's credit files, to represent the creditworthiness of an individual. It is primarily based on credit report information typically sourced from credit bureaus.
            </Typography>
            <Typography variant="body2" gutterBottom>
              Here's a rough calculation of the credit score:
            </Typography>
            <Typography variant="body2">
              Age: (Age - 18) +<br />
              Income: 50 if income between 20,000 and 50,000, 100 if income {'>'}= 50,000 +<br />
              Employment Status: 50 if employed +<br />
              Monthly Expenses (divided by 100) +<br />
              Savings (divided by 500) -<br />
              Debt (divided by 1000)
            </Typography>
            <Button onClick={handleClose} style={{ marginTop: '20px' }} variant="contained" color="primary">Close</Button>
          </div>
        </Fade>
      </Modal>
    </>
  );
};

export default CreditScore;
