import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

const TopGoal = () => {
  const [goals, setGoals] = useState([]);
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

  const filterGoals = () => {
    let filteredGoals = [];
    let closestGoal = null;
    let closestDifference = Infinity;
  
    goals.forEach(goal => {
      if (goal.userid === account.id && goal.status !== "Complete") {
        const targetDate = new Date(goal.targetDate);
        const currentDate = new Date();
        const difference = Math.abs(targetDate - currentDate);
  
        if (difference < closestDifference) {
          closestDifference = difference;
          closestGoal = goal;
        }
      }
    });
  
    if (closestGoal) {
      filteredGoals.push(closestGoal);
    }
  
    return filteredGoals;
  };

  // Check if there are no goals to render
  if (goals.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>You have no current or upcoming goals. Please visit the goals page.</p>
      </div>
    );
  }
  
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px' }}>
        <h2 style={{ margin: 0 }}>Top Financial Goal</h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Table style={{ width: '90%', borderCollapse: 'collapse', textAlign: 'center' }}>
          <TableHead>
            <TableRow style={{ borderBottom: '2px solid #333' }}>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Target Amount</TableCell>
              <TableCell>Target Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterGoals().map((goal) => (
              <TableRow key={goal.id} style={{ borderBottom: '1px solid #ccc' }}>
                <TableCell style={{ padding: '2px' }}>{goal.title}</TableCell>
                <TableCell style={{ padding: '2px' }}>{goal.description}</TableCell>
                <TableCell style={{ padding: '2px' }}>{goal.targetAmount}</TableCell>
                <TableCell style={{ padding: '2px' }}>{new Date(goal.targetDate).toLocaleDateString()}</TableCell>
                <TableCell style={{ padding: '2px' }}>{goal.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default TopGoal;
