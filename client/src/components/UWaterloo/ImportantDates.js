import {
  Alert,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import Navigation from '../Navigation/index.js';
import {useDispatch, useSelector} from 'react-redux';
import {addApiKey} from '../Account/accountSlice.js';
import {useState} from 'react';

const ImportantDates = () => {
  const dispatch = useDispatch();
  const account = useSelector(state => state.account.value);

  const register = async () => {
    const url = '/api/registerEmailApi';

    const reqBody = JSON.stringify({
      email: account.email,
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

    console.log(resBody);
    handleRegistrationResponse(resBody);
  };

  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(false);

  const handleRegistrationResponse = res => {
    switch (res) {
      case 'There is already an API account registered with this email address':
        setError(true);
        break;
      case account.email:
        setEmailSent(true);
        break;
      default:
        setError(true);
    }
  };

  const [confirmationCode, setConfirmationCode] = useState('');
  const updateCode = event => {
    setConfirmationCode(event.target.value);
  };

  const callSendConfirmationCode = () => {
    sendConfirmationCode().then(res => {
      console.log('sendConfirmationCode returned: ', res);
      if (res.level === 'Information') {
        setError(false);
        setConfirmed(true);
      } else {
        setError(true);
        setConfirmationCode('');
      }
    });
  };
  const sendConfirmationCode = async () => {
    const url = '/api/sendConfirmationCode';

    const reqBody = JSON.stringify({
      code: confirmationCode,
      email: account.email,
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

  const [confirmed, setConfirmed] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const updateKey = event => {
    setApiKey(event.target.value);
  };

  const callSendApiKey = () => {
    sendApiKey().then(res => {
      console.log('sendApiKey returned: ', res);
      dispatch(addApiKey(apiKey));
    });
  };
  const sendApiKey = async () => {
    const url = '/api/addApiKey';

    const reqBody = JSON.stringify({
      apiKey: apiKey,
      userId: account.id,
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

  const [dates, setDates] = useState([]);
  const callGetDates = () => {
    getDates().then(res => {
      console.log('getDates returned: ', res);
      setDates(res);
    });
  };
  const getDates = async () => {
    const url = '/api/getDates';

    const reqBody = JSON.stringify({
      apiKey: account.api_key,
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

  const [open, setOpen] = useState(false);
  const [activeDate, setActiveDate] = useState({});
  const handleClick = date => {
    setActiveDate(date);
    setOpen(true);
  };

  const formatDates = unformattedDates => {
    let formattedDates = '';
    unformattedDates.map(fullDate => {
      const date = new Date(fullDate.startDate);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      formattedDates += `${year}-${month}-${day}, `;
    });

    return formattedDates.slice(0, -2);
  };

  return (
    <>
      <Navigation />
      <Grid container align="center" rowSpacing={1.5}>
        <Grid item xs={12} margin={1}>
          <Typography variant="h3" align="center">
            UWaterloo Important Dates
          </Typography>
        </Grid>

        {!account.api_key ? (
          <>
            {!emailSent ? (
              <>
                <Grid item xs={12} margin={1}>
                  <Button
                    data-testid="signout-button"
                    size="large"
                    edge="start"
                    color="primary"
                    sx={{
                      '&:hover': {backgroundColor: 'lightblue'},
                    }}
                    onClick={register}
                    variant="contained"
                  >
                    Register email
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Collapse in={error}>
                    <Alert
                      onClose={() => {
                        setError(false);
                      }}
                      variant="filled"
                      severity="error"
                      sx={{width: 680, marginTop: 2}}
                    >
                      Email already used elsewhere, try a different account
                    </Alert>
                  </Collapse>
                </Grid>
              </>
            ) : (
              <>
                {!confirmed ? (
                  <>
                    <Grid item xs={12} margin={1}>
                      <Grid item xs={12} margin={1}>
                        <Typography variant="h5" align="center">
                          Email sent to: {account.email}
                        </Typography>
                      </Grid>

                      <Typography variant="h5" align="center">
                        Check your email inbox and paste the activation code
                        (not the API key) into the textbox below:
                      </Typography>
                    </Grid>

                    <Grid item xs={12} margin={1}>
                      <TextField
                        label="Paste your activation code"
                        onChange={updateCode}
                        placeholder="E.g., 5847E316-F489-4638-AA68-0BF32EC941A1"
                        sx={{width: 500, marginRight: 5}}
                        value={confirmationCode}
                      />

                      <Button
                        size="large"
                        edge="start"
                        color="primary"
                        onClick={callSendConfirmationCode}
                        sx={{
                          '&:hover': {backgroundColor: 'lightblue'},
                          height: '55px',
                          width: '170px',
                        }}
                        variant="contained"
                      >
                        Submit
                      </Button>
                    </Grid>

                    <Grid item xs={12}>
                      <Collapse in={error}>
                        <Alert
                          onClose={() => {
                            setError(false);
                          }}
                          variant="filled"
                          severity="error"
                          sx={{width: 680, marginTop: 2}}
                        >
                          Incorrect code
                        </Alert>
                      </Collapse>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} margin={1}>
                      <Grid item xs={12} margin={1}>
                        <Typography variant="h5" align="center">
                          New email sent to: {account.email}
                        </Typography>
                      </Grid>

                      <Typography variant="h5" align="center">
                        Check your inbox for a new email and paste the API key
                        into the textbox below:
                      </Typography>
                    </Grid>

                    <Grid item xs={12} margin={1}>
                      <TextField
                        label="Paste your API key"
                        onChange={updateKey}
                        placeholder="E.g., B090E7FCEDB24E66B16F539DC8F6EA21"
                        sx={{width: 500, marginRight: 5}}
                        value={apiKey}
                      />

                      <Button
                        size="large"
                        edge="start"
                        color="primary"
                        onClick={callSendApiKey}
                        sx={{
                          '&:hover': {backgroundColor: 'lightblue'},
                          height: '55px',
                          width: '170px',
                        }}
                        variant="contained"
                      >
                        Submit
                      </Button>
                    </Grid>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <Grid item xs={12} margin={1}>
              <Button
                data-testid="fetch-button"
                size="large"
                edge="start"
                color="primary"
                disabled={dates && dates.length > 0}
                onClick={callGetDates}
                sx={{
                  '&:hover': {backgroundColor: 'lightblue'},
                  height: '55px',
                  width: '200px',
                }}
                variant="contained"
              >
                View important dates
              </Button>
            </Grid>

            {dates && dates.length > 0 ? (
              <Grid item xs={12} marginLeft={10} marginRight={10} marginTop={2}>
                <TableContainer component={Paper}>
                  <Table sx={{minWidth: 650}}>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell sx={{width: '50%'}}>
                          Name
                        </StyledTableCell>
                        <StyledTableCell sx={{width: '35%'}}>
                          Date(s)
                        </StyledTableCell>
                        <StyledTableCell sx={{width: '15%'}}>
                          Type
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[...dates].reverse().map(date => {
                        return (
                          <StyledTableRow
                            data-testid={`date-${date.id}-tablerow`}
                            key={date.id}
                            onClick={() => handleClick(date)}
                            sx={{
                              '&:last-child td, &:last-child th': {border: 0},
                              '&:hover': {backgroundColor: 'lightblue'},
                            }}
                          >
                            <StyledTableCell component="th" scope="row">
                              {date.name}
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                              {date.details && date.details.length > 0 ? (
                                formatDates(date.details)
                              ) : (
                                <></>
                              )}
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                              {date.importantDateType}
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Dialog onClose={() => setOpen(false)} open={open}>
                  <DialogTitle>{activeDate.name}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      {activeDate.details && activeDate.details.length > 0 ? (
                        formatDates(activeDate.details)
                      ) : (
                        <></>
                      )}
                    </DialogContentText>
                    <div
                      dangerouslySetInnerHTML={{__html: activeDate.description}}
                    ></div>
                  </DialogContent>
                  <DialogActions>
                    <Button variant="contained" onClick={() => setOpen(false)}>
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid>
            ) : (
              <></>
            )}
          </>
        )}
      </Grid>
    </>
  );
};

export default ImportantDates;
