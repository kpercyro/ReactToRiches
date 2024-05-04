import {useState} from 'react';
import {Button, Chip, Grid, TextField, Typography} from '@mui/material';
import Navigation from '../Navigation';
import {useSelector} from 'react-redux';

const WriteBlog = () => {
  const account = useSelector(state => state.account.value);

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
        createMessageApi().then(res => {
          console.log('createMessageApi returned: ', res);
          window.open('/blogList', '_self');
        });
      });
    }
  };

  const submitBlogApi = async () => {
    const url = '/api/writeBlog';

    let tags = '';
    if (budgetingSelected) {
      tags += 'Budgeting;';
    }
    if (successStorySelected) {
      tags += 'Success Story;';
    }

    const reqBody = JSON.stringify({
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

  const createMessageApi = async () => {
    const url = '/api/createMessage';

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const datetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const message = `${account.first_name} ${account.last_name} wrote a new post`;

    const reqBody = JSON.stringify({
      time: datetime,
      type: 'post',
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
        <Grid item xs={12} margin={1}>
          <Typography variant="h3" align="center">
            Write a new blog post
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
              data-testid="title-textfield"
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
              data-testid="body-textfield"
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
                data-testid="successstory-chip"
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
            data-testid="submit-button"
            size="large"
            edge="start"
            color="primary"
            sx={{
              mr: 4,
              '&:hover': {backgroundColor: 'lightblue'},
              width: '120px',
            }}
            onClick={() => submit()}
            variant="contained"
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
export default WriteBlog;
