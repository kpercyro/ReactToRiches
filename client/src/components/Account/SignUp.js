import {
  Alert,
  Button,
  Collapse,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import {useContext, useEffect, useState} from 'react';
import {FirebaseContext} from '../Firebase';

const SignUp = () => {
  const firebase = useContext(FirebaseContext);

  const [accounts, setAccounts] = useState();
  useEffect(() => {
    getAllAccountsApi().then(res => {
      console.log('getAccountApi returned: ', res.express);
      setAccounts(res.express);
    });
  }, []);
  const getAllAccountsApi = async () => {
    const url = '/api/getAllAccounts';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const resBody = await response.json();
    if (response.status !== 200) throw Error(resBody.message);
    return resBody;
  };

  const [email, setEmail] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const updateEmail = event => {
    const value = event.target.value;
    if (!accounts.some(user => user.email === value)) {
      setEmailExists(false);
      setEmail(value);
    } else {
      setEmailExists(true);
    }
  };
  const [emptyEmailError, setEmptyEmailError] = useState(false);
  const [emailRegexError, setEmailRegexError] = useState(false);

  const [password, setPassword] = useState('');
  const updatePassword = event => {
    setPassword(event.target.value);
  };
  const [emptyPasswordError, setEmptyPasswordError] = useState(false);
  const [shortPasswordError, setShortPasswordError] = useState(false);

  const [firstName, setFirstName] = useState('');
  const updateFirstName = event => {
    setFirstName(event.target.value);
  };
  const [emptyFirstNameError, setEmptyFirstNameError] = useState(false);

  const [lastName, setLastName] = useState('');
  const updateLastName = event => {
    setLastName(event.target.value);
  };
  const [emptyLastNameError, setEmptyLastNameError] = useState(false);

  const [photo, setPhoto] = useState('');
  const updatePhoto = event => {
    setPhoto(event.target.value);
  };

  const submit = () => {
    if (!email) {
      setEmptyEmailError(true);
    }
    const emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9._]+\.[a-zA-Z]+$/;
    if (!emailRegex.test(email)) {
      setEmailRegexError(true);
    }
    if (!password) {
      setEmptyPasswordError(true);
    } else if (password.length < 8) {
      setShortPasswordError(true);
    }
    if (!firstName) {
      setEmptyFirstNameError(true);
    }
    if (!lastName) {
      setEmptyLastNameError(true);
    }

    if (
      email &&
      emailRegex.test(email) &&
      password &&
      password.length >= 8 &&
      firstName &&
      lastName
    ) {
      firebase
        .doCreateUserWithEmailAndPassword(email, password)

        .then(() => {
          addAccountApi().then(createRes => {
            console.log('addAccountApi returned: ', createRes);
            createNotifications(createRes.express.insertId).then(notiRes => {
              console.log('createNotifications returned: ', notiRes);
              window.open('/', '_self');
            });
          });
        })

        .catch(error => {
          console.log(error);
        });
    }
  };

  const addAccountApi = async () => {
    const url = '/api/addAccount';

    const reqBody = JSON.stringify({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      photo: photo,
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

  const createNotifications = async id => {
    const url = '/api/updateNotifications';

    const reqBody = JSON.stringify({
      user_id: id,
      posts: 0,
      comments: 0,
      reactions: 0,
      videos: 0,
      last_clear: null,
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

  return (
    <>
      <Grid container rowSpacing={1.5} align="center">
        <Grid item xs={12} marginX={2} marginTop={5} marginBottom={2}>
          <Typography variant="h3">Sign-up with a new account</Typography>
        </Grid>

        <Grid item xs={12} marginBottom={2}>
          {emptyEmailError ? (
            <Grid item xs={4}>
              <TextField
                error
                fullWidth
                helperText="Error: enter your email"
                inputProps={{maxLength: 100}}
                label="Enter your email"
                onChange={updateEmail}
                onClick={() => {
                  setEmptyEmailError(false);
                }}
                placeholder="Email"
                value={email}
              />
            </Grid>
          ) : emailRegexError ? (
            <Grid item xs={4}>
              <TextField
                error
                fullWidth
                helperText="Error: invalid format"
                inputProps={{maxLength: 100}}
                label="Enter your email in a proper format"
                onChange={updateEmail}
                onClick={() => {
                  setEmailRegexError(false);
                }}
                placeholder="Email"
                value={email}
              />
            </Grid>
          ) : (
            <Grid item xs={4}>
              <TextField
                fullWidth
                inputProps={{maxLength: 100}}
                label="Enter your email"
                onChange={updateEmail}
                placeholder="Email"
                value={email}
              />
            </Grid>
          )}
        </Grid>

        <Grid item xs={12} marginBottom={2}>
          {emptyPasswordError || shortPasswordError ? (
            <Grid item xs={4}>
              <TextField
                error
                fullWidth
                helperText="Error: enter a password of at least 8 characters"
                inputProps={{maxLength: 30}}
                label="Enter a password of at least 8 characters"
                onChange={updatePassword}
                onClick={() => {
                  setEmptyPasswordError(false);
                  setShortPasswordError(false);
                }}
                placeholder="Password"
                value={password}
              />
            </Grid>
          ) : (
            <Grid item xs={4}>
              <TextField
                fullWidth
                inputProps={{maxLength: 30}}
                label="Enter a password of at least 8 characters"
                onChange={updatePassword}
                placeholder="Password"
                value={password}
              />
            </Grid>
          )}
        </Grid>

        <Grid item xs={12} marginBottom={2}>
          {emptyFirstNameError ? (
            <Grid item xs={4}>
              <TextField
                error
                fullWidth
                helperText="Error: enter your first name"
                inputProps={{maxLength: 50}}
                label="Enter your first name"
                onChange={updateFirstName}
                onClick={() => {
                  setEmptyFirstNameError(false);
                }}
                placeholder="First name"
                value={firstName}
              />
            </Grid>
          ) : (
            <Grid item xs={4}>
              <TextField
                fullWidth
                inputProps={{maxLength: 50}}
                label="Enter your first name"
                onChange={updateFirstName}
                placeholder="First name"
                value={firstName}
              />
            </Grid>
          )}
        </Grid>

        <Grid item xs={12} marginBottom={2}>
          {emptyLastNameError ? (
            <Grid item xs={4}>
              <TextField
                error
                fullWidth
                helperText="Error: enter your last name"
                inputProps={{maxLength: 50}}
                label="Enter your last name"
                onChange={updateLastName}
                onClick={() => {
                  setEmptyLastNameError(false);
                }}
                placeholder="Last name"
                value={lastName}
              />
            </Grid>
          ) : (
            <Grid item xs={4}>
              <TextField
                fullWidth
                inputProps={{maxLength: 50}}
                label="Enter your last name"
                onChange={updateLastName}
                placeholder="Last name"
                value={lastName}
              />
            </Grid>
          )}
        </Grid>

        <Grid item xs={12} marginBottom={2}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Enter a publicly accessible photo URL"
              onChange={updatePhoto}
              placeholder="Photo URL"
              value={photo}
            />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Button
            size="large"
            edge="start"
            color="primary"
            sx={{
              marginRight: 1,
              '&:hover': {backgroundColor: 'lightblue'},
              width: '200px',
            }}
            onClick={() => submit()}
            variant="contained"
          >
            Submit
          </Button>

          <Button
            size="large"
            edge="start"
            color="primary"
            sx={{
              marginLeft: 1,
              '&:hover': {backgroundColor: 'lightblue'},
              width: '200px',
            }}
            onClick={() => window.open('/', '_self')}
            variant="contained"
          >
            Sign-in instead
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Collapse in={emailExists}>
            <Alert
              onClose={() => {
                setEmailExists(false);
              }}
              variant="filled"
              severity="error"
              sx={{width: 250, marginTop: 2}}
            >
              Email already used
            </Alert>
          </Collapse>
        </Grid>
      </Grid>
    </>
  );
};

export default SignUp;
