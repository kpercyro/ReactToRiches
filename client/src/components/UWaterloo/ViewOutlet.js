import {useEffect, useState} from 'react';
import {Button, Grid, Typography} from '@mui/material';
import queryString from 'query-string';
import Navigation from '../Navigation';
import {useSelector} from 'react-redux';

const ViewOutlet = () => {
  const account = useSelector(state => state.account.value);
  const outletId = queryString.parse(window.location.search).id;

  const [outlet, setOutlet] = useState({});
  useEffect(() => {
    getOutlet();
  }, []);

  const getOutlet = () => {
    getOutletApi().then(res => {
      console.log('getOutletApi returned: ', res);
      setOutlet(res);
    });
  };

  const getOutletApi = async () => {
    const url = '/api/getOutletById';

    const reqBody = JSON.stringify({
      id: outletId,
      apiKey: account.api_key,
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

  return (
    <>
      <Navigation />

      <Grid container align="center" rowSpacing={1.5}>
        <Grid item xs={12}>
          <Typography variant="h2" align="center" marginTop={3}>
            {outlet.name ? outlet.name : 'loading...'}
          </Typography>
        </Grid>

        {outlet.location && outlet.location[0] && outlet.location[0].name ? (
          <Grid item xs={12}>
            <Typography variant="h5" align="center">
              Located at {outlet.location[0].name}
            </Typography>
          </Grid>
        ) : (
          <></>
        )}

        {outlet.summary ? (
          <Grid item xs={12} marginX={3}>
            <Typography variant="h4" align="center">
              {outlet.summary}
            </Typography>
          </Grid>
        ) : (
          <></>
        )}

        <Grid item xs={12} marginY={3}>
          <Button
            size="large"
            edge="start"
            color="primary"
            onClick={() => window.open('/foodServices', '_self')}
            sx={{
              '&:hover': {backgroundColor: 'lightblue'},
              height: '55px',
              width: '400px',
            }}
            variant="contained"
          >
            Return to all Food Services
          </Button>
        </Grid>

        {outlet.photo && outlet.photo.url ? (
          <Grid item xs={12} marginBottom={2}>
            <img
              src={outlet.photo.url}
              alt={outlet.name}
              width="700px"
              height="500px"
            />
          </Grid>
        ) : (
          <></>
        )}
      </Grid>
    </>
  );
};
export default ViewOutlet;
