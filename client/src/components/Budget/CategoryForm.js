import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Grid,
  TextField,
  Typography,
} from '@mui/material';

const CategoryForm = ({ onClose }) => {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');
  const account = useSelector(state => state.account.value);

  const writeCategoryEntry = async (categoryName, userid) => {
    const url = '/api/writeCategoryEntry';
    const reqBody = JSON.stringify({
      category_name: categoryName,
      userid: userid, // Pass account.id as userid
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
      throw new Error(error.message || 'Failed to submit category entry');
    }

    return await response.json();
  };

  const checkCategoryExists = async (categoryName) => {
    const url = `/api/categories?name=${encodeURIComponent(categoryName)}`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to check category existence');
    }

    const data = await response.json();
    return data.exists;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!categoryName) {
      setError('Please enter a category name');
      return;
    }

    try {
      const categoryExists = await checkCategoryExists(categoryName);
      if (categoryExists) {
        setError('Category already exists');
        return;
      }

      const res = await writeCategoryEntry(categoryName, account.id); // Pass account.id
      console.log('writeCategoryEntry returned:', res);
      setCategoryName('');
      onClose();
      setTimeout(() => window.location.reload(), [1000]);
    } catch (error) {
      console.error('Failed to save category entry:', error);
      setError('Failed to save category entry');
    }
  };

  return (
    <div>
      <h3>Add New Category</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Category Name:
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </label>
        <button type="submit">Add</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CategoryForm;
