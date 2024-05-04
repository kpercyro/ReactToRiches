import {useState} from 'react';
import {Button, Grid, TextField, Typography} from '@mui/material';
import Navigation from '../Navigation';
import {useSelector} from 'react-redux';

const PostVideo = () => {
  const account = useSelector(state => state.account.value);

  const [title, setTitle] = useState('');
  const updateTitle = event => {
    setTitle(event.target.value);
  };
  const [emptyTitleError, setEmptyTitleError] = useState(false);

  const [url, setUrl] = useState('');
  const updateUrl = event => {
    setUrl(event.target.value);
  };
  const [emptyUrlError, setEmptyUrlError] = useState(false);

  const submit = () => {
    if (!title) {
      setEmptyTitleError(true);
    }
    if (!url) {
      setEmptyUrlError(true);
    }
    if (title && url) {
      submitVideoApi().then(res => {
        console.log('submitVideoApi returned: ', res);
        createMessageApi().then(res => {
          console.log('createMessageApi returned: ', res);
          window.open('/videos', '_self');
        });
      });
    }
  };

  const submitVideoApi = async () => {
    const apiUrl = '/api/postVideo';

    const reqBody = JSON.stringify({
      userId: account.id,
      title: title,
      url: url,
    });

    const response = await fetch(apiUrl, {
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

    const message = `${account.first_name} ${account.last_name} shared a new video`;

    const reqBody = JSON.stringify({
      time: datetime,
      type: 'video',
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
            Share a new video
          </Typography>
        </Grid>

        {emptyTitleError ? (
          <Grid item xs={12} marginX={3}>
            <TextField
              error
              fullWidth
              helperText="Error: enter your video title"
              inputProps={{maxLength: 255}}
              label="Paste or type the video title"
              onChange={updateTitle}
              onClick={() => setEmptyTitleError(false)}
              placeholder="This can be the original video title, or your own"
              value={title}
            />
          </Grid>
        ) : (
          <Grid item xs={12} marginX={3}>
            <TextField
              fullWidth
              inputProps={{maxLength: 255}}
              label="Paste or type the video title"
              onChange={updateTitle}
              placeholder="This can be the original video title, or your own"
              value={title}
            />
          </Grid>
        )}

        {emptyUrlError ? (
          <Grid item xs={12} marginX={3}>
            <TextField
              error
              fullWidth
              helperText="Error: enter your video's URL"
              inputProps={{maxLength: 2048}}
              label="Paste the video URL"
              multiline
              onChange={updateUrl}
              onClick={() => setEmptyUrlError(false)}
              placeholder="Paste YouTube links only"
              value={url}
            />
          </Grid>
        ) : (
          <Grid item xs={12} marginX={3}>
            <TextField
              fullWidth
              inputProps={{maxLength: 2048}}
              label="Paste the video URL"
              multiline
              onChange={updateUrl}
              placeholder="Paste YouTube links only"
              value={url}
            />
          </Grid>
        )}

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
              width: '120px',
            }}
            onClick={() => submit()}
            variant="contained"
          >
            Share
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
export default PostVideo;
