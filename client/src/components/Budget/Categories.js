import React, { useState, useEffect } from 'react';
import Navigation from '../Navigation';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import CategoryForm from './CategoryForm';
import { useSelector } from 'react-redux';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const account = useSelector(state => state.account.value);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/getCategories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

  const handleDelete = (category_id) => {
    console.log("Deleting category with ID:", category_id);
    if (!category_id) {
      console.error("Invalid ID:", category_id);
      return;
    }

    if (window.confirm("Are you sure you want to delete this category?")) {
      console.log("Confirmed deletion for ID:", category_id);
      fetch(`/api/deleteCategory/${category_id}`, {
        method: 'DELETE'
      })
        .then(response => response.json())
        .then(data => {
          console.log("Delete response:", data);
          if (data.success) {
            console.log("Successfully deleted category with ID:", category_id);
            setCategories(categories.filter(category => category.category_id !== category_id));
          } else {
            console.error('Delete failed:', data.error);
          }
        })
        .catch(error => console.error('Error deleting:', error));
    } else {
      console.log("Deletion cancelled for ID:", category_id);
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

  const handleDeleteClick = (category_id) => {
    handleDelete(category_id);
  };

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <>
      <Navigation />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        <h1 style={{ margin: 0 }}>All Categories</h1>
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
          <Link to="/expenses" style={{ textDecoration: 'none' }}>
            <Button variant="contained">Add Transactions & Savings</Button>
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <table style={{ width: '50%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ backgroundColor: '#1976d2', color: 'white', padding: '8px' }}>Category Name</th>
              <th style={{ backgroundColor: '#1976d2', color: 'white', padding: '8px' }}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filterCategories().map(category => (
              <tr key={category.category_id}>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{category.category_name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                  <button
                    style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleDeleteClick(category.category_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button variant="contained" onClick={handleToggleForm}>
          {showForm ? 'Hide Category Form' : 'Add New Category'}
        </Button>
      </div>

      {showForm && <CategoryForm onClose={handleToggleForm} />}
    </>
  );
};

export default Categories;
