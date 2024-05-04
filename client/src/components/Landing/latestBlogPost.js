import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Typography, Paper, Grid } from '@mui/material';


const LatestBlogPost = () => {
  const [lastPost, setLastPost] = useState(null);

  useEffect(() => {
    fetchLastPost();
  }, []);

  const fetchLastPost = async () => {
    try {
      const url = '/api/getLastPost';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch last post');
      }

      const body = await response.json();

      if (body && body.express && body.express.length > 0) {
        setLastPost(body.express[0]); // First element since we are only expecting one post
      } else {
        throw new Error('Last post not found');
      }
    } catch (error) {
      console.error('Error fetching last post:', error.message);
    }
  };

  const StyledTableCell = TableCell;
  const StyledTableRow = TableRow;

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px' }}>
        <h2 style={{ margin: 0 }}>Latest Blog Post</h2>
      </div>

      <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
        <Grid item xs={10}>
          {lastPost ? (
            <Table component={Paper} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
              <TableHead>
                <StyledTableRow style={{ borderBottom: '2px solid #333' }}>
                  <StyledTableCell>Title</StyledTableCell>
                  <StyledTableCell>Body</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                <StyledTableRow style={{ borderBottom: '1px solid #ccc' }}>
                  <StyledTableCell>{lastPost.title}</StyledTableCell>
                  <StyledTableCell>{lastPost.body}</StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <p>No latest blog post available.</p>
            </div>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default LatestBlogPost;
