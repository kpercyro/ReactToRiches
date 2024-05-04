import {
  Alert,
  Button,
  Collapse,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import {useContext, useState} from 'react';
import {useDispatch} from 'react-redux';
import {FirebaseContext} from '../Firebase';
import {addAccount} from '../Account/accountSlice';

const Login = () => {
  const firebase = useContext(FirebaseContext);

  const [email, setEmail] = useState('');
  const updateEmail = event => {
    setEmail(event.target.value);
  };
  const [emptyEmailError, setEmptyEmailError] = useState(false);

  const [password, setPassword] = useState('');
  const updatePassword = event => {
    setPassword(event.target.value);
  };
  const [emptyPasswordError, setEmptyPasswordError] = useState(false);

  const submit = () => {
    if (!email) {
      setEmptyEmailError(true);
    }
    if (!password) {
      setEmptyPasswordError(true);
    }
    if (email && password) {
      firebase
        .doSignInWithEmailAndPassword(email, password)

        .then(() => {
          getAccountApi().then(res => {
            console.log('getAccountApi returned: ', res.express);
            if (
              Object.keys(res.express) &&
              Object.keys(res.express).length > 0
            ) {
              dispatch(addAccount(res.express[0]));
            } else {
              setNoAccountFound(true);
              setEmail('');
              setPassword('');
            }
          });
        })

        .catch(error => {
          setNoAccountFound(true);
          console.log(error);
        });
    }
  };

  const dispatch = useDispatch();
  const [noAccountFound, setNoAccountFound] = useState(false);

  const getAccountApi = async () => {
    const url = '/api/getAccount';

    const reqBody = JSON.stringify({
      email: email,
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
      <Grid container rowSpacing={1.5} align="center">
        <Grid item xs={12} marginX={2} marginTop={5} marginBottom={2}>
          <Typography variant="h3">Sign-in to your account</Typography>
        </Grid>

        <Grid item xs={12} marginBottom={2}>
          {emptyEmailError ? (
            <Grid item xs={4}>
              <TextField
                error
                fullWidth
                helperText="Error: enter your email"
                inputProps={{maxLength: 20}}
                label="Enter your email"
                onChange={updateEmail}
                onClick={() => {
                  setEmptyEmailError(false);
                  setNoAccountFound(false);
                }}
                placeholder="Email"
                value={email}
              />
            </Grid>
          ) : (
            <Grid item xs={4}>
              <TextField
                data-testid="email-textfield"
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
          {emptyPasswordError ? (
            <Grid item xs={4}>
              <TextField
                error
                fullWidth
                helperText="Error: enter your password"
                inputProps={{maxLength: 30}}
                label="Enter your password"
                onChange={updatePassword}
                onClick={() => {
                  setEmptyPasswordError(false);
                  setNoAccountFound(false);
                }}
                placeholder="Password"
                value={password}
              />
            </Grid>
          ) : (
            <Grid item xs={4}>
              <TextField
                data-testid="password-textfield"
                fullWidth
                inputProps={{maxLength: 30}}
                label="Enter your password"
                onChange={updatePassword}
                placeholder="Password"
                value={password}
              />
            </Grid>
          )}
        </Grid>

        <Grid item xs={12}>
          <Button
            data-testid="submit-button"
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
            onClick={() => window.open('/signUp', '_self')}
            variant="contained"
          >
            Create Account
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Collapse in={noAccountFound}>
            <Alert
              onClose={() => {
                setNoAccountFound(false);
              }}
              variant="filled"
              severity="error"
              sx={{width: 250, marginTop: 2}}
            >
              Credentials did not match any existing accounts
            </Alert>
          </Collapse>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
