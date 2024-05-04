import React, { useState, useEffect } from 'react';
import Navigation from '../Navigation';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell } from 'recharts';
import { useSelector } from 'react-redux';

const BudgetLand = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [chartData2, setChartData2] = useState([]);
  const [colorsMap, setColorsMap] = useState({});
  const [comparisonMessage, setComparisonMessage] = useState('');
  const COLORS1 = ['#125393', '#1976d2', '#5e9fe0', '#125393', '#1976d2', '#5e9fe0'];
  const COLORS2 = ['#125393', '#1976d2', '#5e9fe0', '#125393', '#1976d2', '#5e9fe0'];
  const account = useSelector(state => state.account.value);

  useEffect(() => {
    fetchCategoryData();
    fetchBudgetData();
  }, []);

  const fetchCategoryData = async () => {
    try {
      const response = await fetch(`/api/getCategories?userid=${account.id}`);
      const data = await response.json();
      setCategoryData(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBudgetData = async () => {
    try {
      const response = await fetch(`/api/getTransactions?userid=${account.id}`);
      const data = await response.json();
      setChartData2(data);
    } catch (error) {
      console.error('Error fetching budget data:', error);
    }
  };

  const mapColors = (data, baseColors) => {
    const colorMap = {};
    data.forEach((item, index) => {
      if (!colorMap[item.name]) {
        colorMap[item.name] = baseColors[index % baseColors.length];
      }
    });
    return colorMap;
  };

  const filterData = () => {
    let filteredData = []
    chartData2.forEach(entry => {
      if (entry.userid === account.id) {
        filteredData.push(entry);
      }
    })
    return filteredData;
  }

  const filterCategories = () => {
    return categoryData.filter(category => category.userid === account.id);
  }

  useEffect(() => {
    const consistentColors1 = mapColors(
      filterCategories().map(category => ({
        name: category.category_name,
        value: category.category_limit,
      })),
      COLORS1
    );
    const consistentColors2 = mapColors(
      filterData().map(item => ({
        name: item.category,
        value: item.amount,
      })),
      COLORS2
    );

    setColorsMap(consistentColors1);
  }, [categoryData, chartData2]);

  const calculateCategorySums = (data) => {
    const categorySums = {};
    data.forEach(item => {
      const { category, amount } = item;
      if (categorySums[category]) {
        categorySums[category] += amount;
      } else {
        categorySums[category] = amount;
      }
    });
    return categorySums;
  };

  const categorySums = calculateCategorySums(filterData());

  const handleCategoryClick = (categoryName) => {
    const categoryLimit = categoryData.find(item => item.category_name === categoryName)?.category_limit;
    if (categorySums[categoryName] > categoryLimit) {
      setComparisonMessage(`Actual spending for ${categoryName} is greater than the budgeted limit.`);
    } else {
      setComparisonMessage(`Actual spending for ${categoryName} is within the budgeted limit.`);
    }
  };

  // Custom Legend Component
  const CustomLegend = ({ colorsMap }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gridGap: '10px', alignItems: 'flex-start' }}>
      {Object.keys(colorsMap).map((category, index) => (
        <div key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', cursor: 'pointer' }} onClick={() => handleCategoryClick(category)}>
          <div style={{ width: '10px', height: '10px', backgroundColor: colorsMap[category], marginRight: '5px' }}></div>
          <span>{category}</span>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Navigation />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        <h1 style={{ margin: 0 }}>Budget</h1>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <Link to="/expenses" style={{ textDecoration: 'none' }}>
            <Button variant="contained">Add Transactions & Savings</Button>
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
      <div style={{ textAlign: 'center', marginTop: '10px', color: comparisonMessage.includes('within') ? 'green' : 'red' }}>{comparisonMessage}</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', margin: '10px auto' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CustomLegend colorsMap={colorsMap} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2>Budgeted Spending</h2>
          <PieChart width={250} height={250}>
            <Pie
              data={filterCategories().map(category => ({
                name: category.category_name,
                value: category.category_limit,
              }))}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {filterCategories().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colorsMap[entry.category_name]} />
              ))}
            </Pie>
          </PieChart>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2>Actual Spending</h2>
          <PieChart width={250} height={250}>
            <Pie
              data={Object.keys(categorySums).map(category => ({
                name: category,
                value: categorySums[category],
              }))}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#82ca9d"
              label
            >
              {Object.keys(categorySums).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colorsMap[entry]} />
              ))}
            </Pie>
          </PieChart>
        </div>
      </div>
    </>
  );
};

export default BudgetLand;
