import {useEffect, useState} from 'react';
import {
  Avatar,
  Button,
  Chip,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Navigation from '../Navigation';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = () => {
    getPostsApi().then(res => {
      console.log('getPostsApi returned: ', res);
      setPosts(res.express);
    });
  };

  const getPostsApi = async () => {
    const url = '/api/getPosts';
    console.log(url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      if (posts && posts.length > 0) {
        try {
          const promises = posts.map(post => getAuthorApi(post.author_id));
          const usersResults = await Promise.all(promises);

          const tempUsers = usersResults.map(res => res.express[0]);
          setUsers(tempUsers);
        } catch (error) {
          console.error('Failed to load the user data: ', error);
        }
      }
    };

    fetchUsers();
  }, [posts]);

  const getAuthorApi = async id => {
    const url = '/api/getAuthor';

    const reqBody = JSON.stringify({
      id: id,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: reqBody,
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  const [tagArr, setTagArr] = useState([]);
  useEffect(() => {
    if (posts && posts.length > 0) {
      let tempTags = [];
      posts.forEach((post, index) => {
        tempTags[index] = post.tags.split(';').filter(tag => tag.trim() !== '');
      });
      setTagArr(tempTags);
    }
  }, [posts]);

  const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#1976d2',
      color: theme.palette.common.white,
      fontSize: 18,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 18,
    },
  }));

  const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  return (
    <>
      <Navigation />

      <Grid container align="center" rowSpacing={1.5}>
        <Grid item xs={6} marginY={2}>
          <Typography variant="h3" align="center">
            View all blog posts
          </Typography>
        </Grid>

        <Grid item xs={6} marginBottom={1} marginTop={3}>
          <Button
            data-testid="writepost-button"
            size="large"
            edge="start"
            color="primary"
            sx={{
              mr: 4,
              '&:hover': {backgroundColor: 'lightblue'},
              width: '250px',
            }}
            onClick={() => {
              window.open('/writeBlog', '_self');
            }}
            variant="contained"
          >
            Write new post
          </Button>

          <Button
            size="large"
            edge="start"
            color="primary"
            sx={{
              mr: 4,
              '&:hover': {backgroundColor: 'lightblue'},
              width: '250px',
            }}
            onClick={() => {
              window.open('/viewOwnBlogs', '_self');
            }}
            variant="contained"
          >
            View your posts
          </Button>
        </Grid>

        <Grid item xs={12} marginLeft={10} marginRight={10} marginTop={2}>
          <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}}>
              <TableHead>
                <TableRow>
                  <StyledTableCell sx={{width: '30%'}}>Title</StyledTableCell>
                  <StyledTableCell sx={{width: '10%'}}>Author</StyledTableCell>
                  <StyledTableCell sx={{width: '40%'}}>Preview</StyledTableCell>
                  <StyledTableCell sx={{width: '20%'}}>Tags</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.map((post, index) => {
                  const truncatedBody =
                    post.body.length > 200
                      ? post.body.substring(0, 195) + '...'
                      : post.body;

                  return (
                    <StyledTableRow
                      data-testid={`post-${post.author_id}-tablerow`}
                      key={post.id}
                      onClick={() =>
                        window.open(`/viewBlog/?id=${post.id}`, '_self')
                      }
                      sx={{
                        '&:last-child td, &:last-child th': {border: 0},
                        '&:hover': {backgroundColor: 'lightblue'},
                      }}
                    >
                      <StyledTableCell component="th" scope="row">
                        {post.title}
                      </StyledTableCell>
                      <StyledTableCell>
                        {users && users.length > 0 ? (
                          <Chip
                            avatar={<Avatar src={users[index].photo_url} />}
                            label={
                              users[index].first_name
                                ? users[index].first_name +
                                  ' ' +
                                  users[index].last_name
                                : 'loading...'
                            }
                          />
                        ) : (
                          <Chip avatar={<Avatar />} label="loading..." />
                        )}
                      </StyledTableCell>
                      <StyledTableCell>{truncatedBody}</StyledTableCell>
                      <StyledTableCell>
                        {tagArr && tagArr.length > 0 ? (
                          tagArr[index].map(tag => (
                            <Chip
                              color="primary"
                              key={tag + index}
                              label={tag}
                              sx={{margin: 1}}
                            />
                          ))
                        ) : (
                          <></>
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};
export default BlogList;
