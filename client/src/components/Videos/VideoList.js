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

const Videos = () => {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    getVideos();
  }, []);

  const getVideos = () => {
    getVideosApi().then(res => {
      console.log('getVideossApi returned: ', res);
      setVideos(res.express);
    });
  };

  const getVideosApi = async () => {
    const url = '/api/getVideos';
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
      if (videos && videos.length > 0) {
        try {
          const promises = videos.map(video => getPosterApi(video.user_id));
          const usersResults = await Promise.all(promises);

          const tempUsers = usersResults.map(res => res.express[0]);
          setUsers(tempUsers);
        } catch (error) {
          console.error('Failed to load the user data: ', error);
        }
      }
    };

    fetchUsers();
  }, [videos]);

  const getPosterApi = async id => {
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

  const getVideoId = url => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };

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
            View all shared videos
          </Typography>
        </Grid>

        <Grid item xs={6} marginBottom={1} marginTop={3}>
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
              window.open('/postVideo', '_self');
            }}
            variant="contained"
          >
            Post a new video
          </Button>
        </Grid>

        <Grid item xs={12} marginLeft={10} marginRight={10} marginTop={2}>
          <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}}>
              <TableHead>
                <TableRow>
                  <StyledTableCell sx={{width: '60%'}}>Title</StyledTableCell>
                  <StyledTableCell sx={{width: '25%'}}>Video</StyledTableCell>
                  <StyledTableCell sx={{width: '15%'}}>Poster</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {videos.map((video, index) => (
                  <StyledTableRow
                    key={video.video_id}
                    sx={{
                      '&:last-child td, &:last-child th': {border: 0},
                      '&:hover': {backgroundColor: 'lightblue'},
                    }}
                  >
                    <StyledTableCell component="th" scope="row">
                      {video.title}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      <iframe
                        width="560"
                        height="315"
                        src={`//www.youtube.com/embed/${getVideoId(video.url)}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
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
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};
export default Videos;
