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
  TextField,
  Typography,
} from '@mui/material';
import MoodIcon from '@mui/icons-material/Mood';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import queryString from 'query-string';
import Navigation from '../Navigation';
import {useSelector} from 'react-redux';

const ViewBlog = () => {
  const account = useSelector(state => state.account.value);
  const postId = queryString.parse(window.location.search).id;

  const [post, setPost] = useState({});
  useEffect(() => {
    getPost();
  }, []);

  const getPost = () => {
    getPostApi().then(res => {
      console.log('getPostApi returned: ', res);
      setPost(res.express[0]);
    });
  };

  const getPostApi = async () => {
    const url = '/api/getPostById';

    const reqBody = JSON.stringify({
      id: postId,
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

  const [author, setAuthor] = useState({});

  const getAuthor = () => {
    getAuthorApi(post.author_id).then(res => {
      console.log('getAuthorApi returned: ', res);
      setAuthor(res.express[0]);
    });
  };

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
    if (post && post.tags) {
      setTagArr(post.tags.split(';').filter(tag => tag.trim() !== ''));
    }
    if (post && post.author_id) {
      getReactions();
      getAuthor();
    }
  }, [post]);

  const [reactions, setReactions] = useState([]);

  const getReactions = () => {
    getReactionsApi().then(res => {
      console.log('getReactionsApi returned: ', res);
      setReactions(res.express);
    });
  };

  const getReactionsApi = async () => {
    const url = '/api/getReactions';

    const reqBody = JSON.stringify({
      post_id: postId,
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

  const [ownReactions, setOwnReactions] = useState([0, 0, 0, 0]);
  const [reactionCount, setReactionCount] = useState([0, 0, 0, 0]);
  useEffect(() => {
    if (reactions && reactions.length > 0) {
      let tempCount = [0, 0, 0, 0];
      let tempOwnReactions = [0, 0, 0, 0];

      reactions.forEach(row => {
        if (row.Mood) {
          tempCount[0] += 1;
          if (row.author_id === account.id) {
            tempOwnReactions[0] = 1;
          }
        }
        if (row.SentimentVeryDissatisfied) {
          tempCount[1] += 1;
          if (row.author_id === account.id) {
            tempOwnReactions[1] = 1;
          }
        }
        if (row.ThumbUp) {
          tempCount[2] += 1;
          if (row.author_id === account.id) {
            tempOwnReactions[2] = 1;
          }
        }
        if (row.AttachMoney) {
          tempCount[3] += 1;
          if (row.author_id === account.id) {
            tempOwnReactions[3] = 1;
          }
        }
      });

      setReactionCount(tempCount);
      setOwnReactions(tempOwnReactions);
    }
  }, [reactions]);

  const [comments, setComments] = useState([]);
  useEffect(() => {
    getComments();
  }, []);

  const getComments = () => {
    getCommentsApi().then(res => {
      console.log('getCommentsApi returned: ', res);
      setComments(res.express);
    });
  };

  const getCommentsApi = async () => {
    const url = '/api/getComments';
    const reqBody = JSON.stringify({
      postId: postId,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: reqBody,
    });

    const resBody = await response.json();
    if (response.status !== 200) throw Error(resBody.message);
    return resBody;
  };

  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      if (comments && comments.length > 0) {
        try {
          const promises = comments.map(comment =>
            getAuthorApi(comment.author_id),
          );
          const usersResults = await Promise.all(promises);

          const tempUsers = usersResults.map(res => res.express[0]);
          setUsers(tempUsers);
        } catch (error) {
          console.error('Failed to load the user data: ', error);
        }
      }
    };

    fetchUsers();
  }, [comments]);

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

  const toggleReaction = element => {
    let tempOwnReactions = [0, 0, 0, 0];
    for (const i in ownReactions) {
      if (ownReactions[i]) {
        tempOwnReactions[i] = 1;
      }
    }

    if (ownReactions[element]) {
      tempOwnReactions[element] = 0;
    } else {
      tempOwnReactions[element] = 1;
    }

    setOwnReactions(tempOwnReactions);
    updateReactionsApi(tempOwnReactions).then(res => {
      console.log('updateReactionsApi returned: ', res);
      getReactionsApi().then(res => {
        console.log('getReactionsApi returned: ', res);
        setReactions(res.express);
        createMessageApi('reaction').then(res => {
          console.log('createMessageApi returned: ', res);
        });
      });
    });
  };

  const updateReactionsApi = async reactionsArr => {
    const url = '/api/updateReactions';
    const reqBody = JSON.stringify({
      Mood: reactionsArr[0],
      SentimentVeryDissatisfied: reactionsArr[1],
      ThumbUp: reactionsArr[2],
      AttachMoney: reactionsArr[3],
      author_id: account.id,
      post_id: postId,
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

  const [writingComment, setWritingComment] = useState(false);
  const [body, setBody] = useState('');
  const updateBody = event => {
    setBody(event.target.value);
  };
  const [emptyBodyError, setEmptyBodyError] = useState(false);

  const submit = () => {
    if (!body) {
      setEmptyBodyError(true);
    } else {
      submitCommentApi().then(res => {
        console.log('submitCommentApi returned: ', res);
        createMessageApi('comment').then(res => {
          console.log('createMessageApi returned: ', res);
          window.location.reload();
        });
      });
    }
  };

  const submitCommentApi = async () => {
    const url = '/api/writeComment';

    const reqBody = JSON.stringify({
      authorId: account.id,
      postId: postId,
      body: body,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: reqBody,
    });

    const resBody = await response.json();
    if (response.status !== 200) throw Error(resBody.message);
    return resBody;
  };

  const createMessageApi = async type => {
    const url = '/api/createMessage';

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const datetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const message = `${account.first_name} ${account.last_name} added a new ${type}`;

    const reqBody = JSON.stringify({
      time: datetime,
      type: type,
      message: message,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: reqBody,
    });

    const resBody = await response.json();
    if (response.status !== 200) throw Error(resBody.message);
    return resBody;
  };

  return (
    <>
      <Navigation />

      <Grid container align="center" rowSpacing={1.5}>
        <Grid item xs={12} marginBottom={1} marginTop={3}>
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
              window.open('/blogList', '_self');
            }}
            variant="contained"
          >
            Return to all posts
          </Button>

          {post.author_id === account.id ? (
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
                window.open(`/editBlog/?id=${post.id}`, '_self');
              }}
              variant="contained"
            >
              Edit post
            </Button>
          ) : (
            <></>
          )}
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h3" align="center" marginX={10}>
            {post.title ? post.title : 'loading...'}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Chip
            avatar={<Avatar src={author.photo_url} />}
            label={
              author.first_name
                ? author.first_name + ' ' + author.last_name
                : 'loading...'
            }
          />
        </Grid>

        <Grid item xs={12}>
          {tagArr.map(tag => (
            <Chip
              color="primary"
              key={tag}
              label={tag}
              sx={{marginLeft: 1}}
              variant="outlined"
            />
          ))}
        </Grid>

        <Grid item xs={12}>
          <Chip
            avatar={<MoodIcon />}
            color={ownReactions[0] ? 'success' : 'info'}
            label={reactionCount[0] ? reactionCount[0] : 0}
            onClick={() => toggleReaction(0)}
            sx={{marginRight: 1}}
            variant={ownReactions[0] ? 'filled' : 'outlined'}
          />
          <Chip
            avatar={<SentimentVeryDissatisfiedIcon />}
            color={ownReactions[1] ? 'success' : 'info'}
            label={reactionCount[1] ? reactionCount[1] : 0}
            onClick={() => toggleReaction(1)}
            sx={{marginRight: 1}}
            variant={ownReactions[1] ? 'filled' : 'outlined'}
          />
          <Chip
            avatar={<ThumbUpIcon />}
            color={ownReactions[2] ? 'success' : 'info'}
            label={reactionCount[2] ? reactionCount[2] : 0}
            onClick={() => toggleReaction(2)}
            sx={{marginRight: 1}}
            variant={ownReactions[2] ? 'filled' : 'outlined'}
          />
          <Chip
            avatar={<AttachMoneyIcon />}
            color={ownReactions[3] ? 'success' : 'info'}
            label={reactionCount[3] ? reactionCount[3] : 0}
            onClick={() => toggleReaction(3)}
            variant={ownReactions[3] ? 'filled' : 'outlined'}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" align="left" marginX={10} marginBottom={5}>
            {post.body ? post.body : 'loading...'}
          </Typography>
        </Grid>

        <Grid container marginBottom={2} marginX={10}>
          {writingComment ? (
            <>
              <Grid item xs={12}>
                {emptyBodyError ? (
                  <TextField
                    error
                    fullWidth
                    helperText="Error: write your comment"
                    inputProps={{maxLength: 1000}}
                    label="Write your comment post"
                    minRows={3}
                    multiline
                    onChange={updateBody}
                    onClick={() => setEmptyBodyError(false)}
                    placeholder="You may use up to 1000 characters"
                    value={body}
                  />
                ) : (
                  <TextField
                    data-testid="writecomment-textfield"
                    fullWidth
                    inputProps={{maxLength: 1000}}
                    label="Write your comment post"
                    minRows={3}
                    multiline
                    onChange={updateBody}
                    placeholder="You may use up to 1000 characters"
                    value={body}
                  />
                )}
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  marginTop: 2,
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
              >
                <Button
                  data-testid="submit-button"
                  size="large"
                  edge="start"
                  color="primary"
                  sx={{
                    mr: 4,
                    '&:hover': {backgroundColor: 'lightblue'},
                    width: '200px',
                  }}
                  onClick={() => submit()}
                  variant="contained"
                >
                  Submit
                </Button>
              </Grid>
            </>
          ) : (
            <Button
              data-testid="addcomment-button"
              size="large"
              edge="start"
              color="primary"
              sx={{
                mr: 4,
                '&:hover': {backgroundColor: 'lightblue'},
                width: '200px',
              }}
              onClick={() => setWritingComment(true)}
              variant="contained"
            >
              Add comment
            </Button>
          )}
        </Grid>

        <Grid item xs={12} marginLeft={10} marginRight={10} marginTop={2}>
          <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}}>
              <TableHead>
                <TableRow>
                  <StyledTableCell sx={{width: '20%'}}>Author</StyledTableCell>
                  <StyledTableCell sx={{width: '80%'}}>Preview</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {comments.map((comment, index) => {
                  return (
                    <StyledTableRow
                      key={comment.id}
                      sx={{
                        '&:last-child td, &:last-child th': {border: 0},
                        '&:hover': {backgroundColor: 'lightblue'},
                      }}
                    >
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
                      <StyledTableCell>{comment.body}</StyledTableCell>
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
export default ViewBlog;
