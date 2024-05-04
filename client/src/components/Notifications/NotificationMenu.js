import {
  Button,
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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import Navigation from '../Navigation/index.js';
import {useSelector} from 'react-redux';
import {useEffect, useRef, useState} from 'react';

const NotificationMenu = () => {
  const account = useSelector(state => state.account.value);

  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);

  const getNotificationsApi = async () => {
    const url = '/api/getNotifications';

    const reqBody = JSON.stringify({
      userId: account.id,
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

  const getMessagesApi = async () => {
    const url = '/api/getMessages';

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

  const [desktopAccess, setDesktopAccess] = useState(false);
  const lastAlertTimeRef = useRef(Date.now());
  useEffect(() => {
    const checkNotifications = () => {
      getNotificationsApi().then(notiRes => {
        console.log('getNotificationsApi returned: ', notiRes);
        setNotifications(notiRes.express[0]);

        getMessagesApi().then(msgRes => {
          console.log('getMessagesApi returned: ', msgRes);

          let tempMessages = msgRes.express;
          tempMessages.forEach((msg, index) => {
            const date = new Date(msg.time);

            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');

            let newMsg = msg;
            newMsg.time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            tempMessages[index] = newMsg;
          });

          tempMessages.sort((a, b) => {
            const dateA = new Date(a.time);
            const dateB = new Date(b.time);
            return dateB - dateA;
          });

          let filteredMessages = tempMessages.filter(msg => {
            const messageTime = new Date(msg.time);
            const isTypeEnabled = notiRes.express[0][msg.type + 's'] === 1;
            const isAfterLastClear =
              !notiRes.express[0].last_clear ||
              messageTime >= new Date(notiRes.express[0].last_clear);
            return isTypeEnabled && isAfterLastClear;
          });
          setMessages(filteredMessages);

          const newMessagesForAlerts = filteredMessages.filter(msg => {
            const messageTime = new Date(msg.time).getTime();
            return messageTime > lastAlertTimeRef.current;
          });
          lastAlertTimeRef.current = Date.now();

          if (
            Notification.permission === 'granted' &&
            newMessagesForAlerts.length > 0
          ) {
            newMessagesForAlerts.forEach(message => {
              new Notification(message.message);
            });
          }
        });
      });

      if (Notification.permission === 'granted') {
        setDesktopAccess(true);
      } else {
        setDesktopAccess(false);
      }
    };

    checkNotifications();
    const intervalId = setInterval(checkNotifications, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const requestNotifications = () => {
    if (
      Notification.permission !== 'granted' &&
      Notification.permission !== 'denied'
    ) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setDesktopAccess(true);
          const notification = new Notification(
            'Desktop notifications enabled',
          );
        }
      });
    } else if (Notification.permission === 'denied') {
      console.log('denied');
    }
  };

  const [initTypes, setInitTypes] = useState([]);
  const [types, setTypes] = useState([]);
  const handleChange = (event, newTypes) => {
    setTypes(newTypes);
  };
  useEffect(() => {
    if (notifications && Object.keys(notifications).length > 0) {
      let tempTypes = [];
      if (notifications.posts) {
        tempTypes.push('posts');
      }
      if (notifications.comments) {
        tempTypes.push('comments');
      }
      if (notifications.reactions) {
        tempTypes.push('reactions');
      }
      if (notifications.videos) {
        tempTypes.push('videos');
      }
      setTypes(tempTypes);
      setInitTypes(tempTypes);
    }
  }, [notifications]);

  const updateNotifications = async lastClear => {
    const url = '/api/updateNotifications';

    const posts = types.includes('posts') ? 1 : 0;
    const comments = types.includes('comments') ? 1 : 0;
    const reactions = types.includes('reactions') ? 1 : 0;
    const videos = types.includes('videos') ? 1 : 0;

    let time;
    if (lastClear) {
      time = lastClear;
    } else if (notifications.last_clear) {
      const now = new Date(notifications.last_clear);

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } else {
      time = null;
    }

    const reqBody = JSON.stringify({
      user_id: account.id,
      posts: posts,
      comments: comments,
      reactions: reactions,
      videos: videos,
      last_clear: time,
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
    window.location.reload();
  };

  const clear = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    updateNotifications(
      `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
    );
  };

  const arrCompare = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false;
    }

    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();

    for (let i = 0; i < sortedArr1.length; i++) {
      if (sortedArr1[i] !== sortedArr2[i]) {
        return false;
      }
    }

    return true;
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

      <Grid container align="center" justifyContent={'center'} rowSpacing={1.5}>
        <Grid item xs={12} marginTop={4}>
          <Typography variant="h4">
            {'Desktop notifications access: '}
            <span style={{color: desktopAccess ? 'green' : 'red'}}>
              {desktopAccess ? 'Granted' : 'Denied'}
            </span>
          </Typography>
        </Grid>

        {desktopAccess ? (
          <></>
        ) : (
          <Grid item xs={12} margin={1}>
            <Button
              size="large"
              edge="start"
              color="primary"
              sx={{
                '&:hover': {backgroundColor: 'lightblue'},
              }}
              onClick={() => requestNotifications()}
              variant="contained"
            >
              Request notification access
            </Button>
          </Grid>
        )}

        <Grid item xs={12} marginTop={1}>
          <Typography variant="h5">
            Select the notification types you wish to recieve below:
          </Typography>
        </Grid>

        <Grid item xs={12} margin={1}>
          <ToggleButtonGroup
            color="primary"
            value={types}
            onChange={handleChange}
          >
            <ToggleButton value="posts">New blog posts</ToggleButton>
            <ToggleButton value="comments">New comments</ToggleButton>
            <ToggleButton value="reactions">New reactions</ToggleButton>
            <ToggleButton value="videos">New videos</ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        <Grid item xs={12} margin={1}>
          {arrCompare(types, initTypes) ? (
            <Button
              size="large"
              edge="start"
              color="primary"
              disabled
              sx={{
                '&:hover': {backgroundColor: 'lightblue'},
              }}
              variant="contained"
            >
              Save
            </Button>
          ) : (
            <Button
              size="large"
              edge="start"
              color="primary"
              sx={{
                '&:hover': {backgroundColor: 'lightblue'},
              }}
              onClick={() => updateNotifications()}
              variant="contained"
            >
              Save
            </Button>
          )}
        </Grid>

        <Grid item xs={12} align="left" marginLeft={10}>
          <Typography variant="h4">Notifications</Typography>

          <Button
            size="large"
            edge="start"
            color="primary"
            sx={{
              '&:hover': {backgroundColor: 'lightblue'},
            }}
            onClick={() => clear()}
            variant="contained"
          >
            Clear all
          </Button>
        </Grid>

        <Grid item xs={12} marginLeft={10} marginRight={10}>
          <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}}>
              <TableHead>
                <TableRow>
                  <StyledTableCell sx={{width: '15%'}}>Time</StyledTableCell>
                  <StyledTableCell sx={{width: '15%'}}>Type</StyledTableCell>
                  <StyledTableCell sx={{width: '70%'}}>Message</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {messages.map((message, index) => {
                  const truncatedMessage =
                    message.message.length > 500
                      ? message.message.substring(0, 495) + '...'
                      : message.message;

                  return (
                    <StyledTableRow
                      key={message.time + index}
                      sx={{
                        '&:last-child td, &:last-child th': {border: 0},
                        '&:hover': {backgroundColor: 'lightblue'},
                      }}
                    >
                      <StyledTableCell component="th" scope="row">
                        {message.time}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {message.type}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {truncatedMessage}
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

export default NotificationMenu;
