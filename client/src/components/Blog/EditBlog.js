import {useEffect, useState} from 'react';
import {Button, Chip, Grid, TextField, Typography} from '@mui/material';
import queryString from 'query-string';
import Navigation from '../Navigation';
import {useSelector} from 'react-redux';

const EditBlog = () => {
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

  const [tagArr, setTagArr] = useState([]);
  useEffect(() => {
    if (post && post.tags) {
      setTagArr(post.tags.split(';').filter(tag => tag.trim() !== ''));
      setTitle(post.title);
      setBody(post.body);
    } else if (post) {
      setTitle(post.title);
      setBody(post.body);
    }
  }, [post]);

  useEffect(() => {
    if (tagArr && tagArr.length > 0) {
      if (tagArr.includes('Budgeting')) {
        setBudgetingSelected(true);
      }
      if (tagArr.includes('Success Story')) {
        setSuccessStorySelected(true);
      }
    }
  }, [tagArr]);

  const [title, setTitle] = useState('');
  const updateTitle = event => {
    setTitle(event.target.value);
  };
  const [emptyTitleError, setEmptyTitleError] = useState(false);

  const [body, setBody] = useState('');
  const updateBody = event => {
    setBody(event.target.value);
  };
  const [emptyBodyError, setEmptyBodyError] = useState(false);

  const [budgetingSelected, setBudgetingSelected] = useState(false);
  const [successStorySelected, setSuccessStorySelected] = useState(false);

  const submit = () => {
    if (!title) {
      setEmptyTitleError(true);
    }
    if (!body) {
      setEmptyBodyError(true);
    }
    if (title && body) {
      submitBlogApi().then(res => {
        console.log('submitBlogApi returned: ', res);
        window.history.back();
      });
    }
  };
  const submitBlogApi = async () => {
    const url = '/api/editBlog';

    let tags = '';
    if (budgetingSelected) {
      tags += 'Budgeting;';
    }
    if (successStorySelected) {
      tags += 'Success Story;';
    }

    const reqBody = JSON.stringify({
      id: postId,
      authorId: account.id,
      title: title,
      body: body,
      tags: tags,
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

  const deleteBlog = () => {
    deleteBlogApi().then(res => {
      console.log('deleteBlogApi returned: ', res);
      window.history.go(-2);
    });
  };
  const deleteBlogApi = async () => {
    const url = '/api/deleteBlog';

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

    const resBody = await response.json();
    if (response.status !== 200) throw Error(resBody.message);
    return resBody;
  };

  return (
    <>
      <Navigation />

      <Grid container align="center" rowSpacing={1.5}>
        <Grid item xs={12} margin={1}>
          <Typography variant="h3" align="center">
            Edit blog post
          </Typography>
        </Grid>

        {emptyTitleError ? (
          <Grid item xs={12} marginX={3}>
            <TextField
              error
              fullWidth
              helperText="Error: enter your post title"
              inputProps={{maxLength: 50}}
              label="Enter a title for your post"
              onChange={updateTitle}
              onClick={() => setEmptyTitleError(false)}
              placeholder="You may use up to 50 characters"
              value={title}
            />
          </Grid>
        ) : (
          <Grid item xs={12} marginX={3}>
            <TextField
              fullWidth
              inputProps={{maxLength: 50}}
              label="Enter a title for your post"
              onChange={updateTitle}
              placeholder="You may use up to 50 characters"
              value={title}
            />
          </Grid>
        )}

        {emptyBodyError ? (
          <Grid item xs={12} marginX={3}>
            <TextField
              error
              fullWidth
              helperText="Error: enter your post body"
              inputProps={{maxLength: 5000}}
              label="Write your blog post"
              minRows={20}
              multiline
              onChange={updateBody}
              onClick={() => setEmptyBodyError(false)}
              placeholder="You may use up to 5000 characters"
              value={body}
            />
          </Grid>
        ) : (
          <Grid item xs={12} marginX={3}>
            <TextField
              fullWidth
              inputProps={{maxLength: 5000}}
              label="Write your blog post"
              minRows={20}
              multiline
              onChange={updateBody}
              placeholder="You may use up to 5000 characters"
              value={body}
            />
          </Grid>
        )}

        <Grid
          item
          marginLeft={3}
          sx={{display: 'flex', justifyContent: 'flex-start'}}
          xs={12}
        >
          <Grid item sx={{display: 'flex', justifyContent: 'flex-start'}}>
            {budgetingSelected ? (
              <Chip
                color="primary"
                label="Budgeting"
                onClick={() => setBudgetingSelected(false)}
              />
            ) : (
              <Chip
                label="Budgeting"
                onClick={() => setBudgetingSelected(true)}
                variant="outlined"
              />
            )}
          </Grid>

          <Grid
            item
            marginLeft={1}
            sx={{display: 'flex', justifyContent: 'flex-start'}}
          >
            {successStorySelected ? (
              <Chip
                color="primary"
                label="Success Story"
                onClick={() => setSuccessStorySelected(false)}
              />
            ) : (
              <Chip
                label="Success Story"
                onClick={() => setSuccessStorySelected(true)}
                variant="outlined"
              />
            )}
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          marginBottom={5}
          marginX={3}
          sx={{display: 'flex', justifyContent: 'flex-start'}}
        >
          <Button
            size="large"
            edge="start"
            color="primary"
            sx={{
              mr: 4,
              '&:hover': {backgroundColor: 'lightblue'},
              width: '170px',
            }}
            onClick={() => {
              deleteBlog();
            }}
            variant="contained"
          >
            Delete blog
          </Button>

          <Button
            size="large"
            edge="start"
            color="primary"
            sx={{
              mr: 4,
              '&:hover': {backgroundColor: 'lightblue'},
              width: '170px',
            }}
            onClick={() => {
              submit();
            }}
            variant="contained"
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
export default EditBlog;
