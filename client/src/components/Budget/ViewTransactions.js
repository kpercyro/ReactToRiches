import React, { useState, useEffect } from 'react';
import Navigation from '../Navigation';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';

const ViewTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const account = useSelector(state => state.account.value);

    useEffect(() => {
        fetch('/api/getTransactions')
            .then(response => response.json())
            .then(data => {
                console.log("Transactions from API:", data);
                setTransactions(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleDelete = (id) => {
        console.log("Deleting transaction with ID:", id);
        if (!id) {
            console.error("Invalid ID:", id);
            return;
        }

        if (window.confirm("Are you sure you want to delete this transaction?")) {
            console.log("Confirmed deletion for ID:", id);
            fetch(`/api/deleteTransaction/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                console.log("Delete response:", data);
                if (data.success) {
                    console.log("Successfully deleted transaction with ID:", id);
                    setTransactions(transactions.filter(transaction => transaction.id !== id));
                } else {
                    console.error('Delete failed:', data.error);
                }
            })
            .catch(error => console.error('Error deleting:', error));
        } else {
            console.log("Deletion cancelled for ID:", id);
        }
    };

    const handleDeleteClick = (id) => {
        handleDelete(id);
    };

    const filterTransactions = () => {
        let filteredTransactions = []
        transactions.map(transaction => {
            if(transaction.userid === account.id) {
                filteredTransactions.push(transaction);
            }
        })
        return filteredTransactions;
    }

    return (
        <>
            <Navigation />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
                <h1 style={{ margin: 0 }}>All Transactions</h1>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <Link to="/budget" style={{ textDecoration: 'none' }}>
                        <Button variant="contained">Return to Budget home</Button>
                    </Link>
                    <Link to="/limits" style={{ textDecoration: 'none' }}>
                        <Button variant="contained">Set Budget Limits</Button>
                    </Link>
                    <Link to="/expenses" style={{ textDecoration: 'none' }}>
                        <Button variant="contained">Add Transactions & Savings</Button>
                    </Link>
                    <Link to="/categories" style={{ textDecoration: 'none' }}>
                        <Button variant="contained">View Categories</Button>
                    </Link>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <table style={{ width: '80%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ backgroundColor: '#1976d2', color: 'white', padding: '8px' }}>Amount</th>
                            <th style={{ backgroundColor: '#1976d2', color: 'white', padding: '8px' }}>Category</th>
                            <th style={{ backgroundColor: '#1976d2', color: 'white', padding: '8px' }}>Date</th>
                            <th style={{ backgroundColor: '#1976d2', color: 'white', padding: '8px' }}>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterTransactions().map(transaction => (
                            <tr key={transaction.id} style={{ borderBottom: '1px solid #ccc' }}>
                                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{transaction.amount}</td>
                                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{transaction.category}</td>
                                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{transaction.date}</td>
                                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                                    <button
                                        style={{
                                            backgroundColor: '#f44336',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => handleDeleteClick(transaction.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ViewTransactions;
