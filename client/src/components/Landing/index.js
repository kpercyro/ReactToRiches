import {Avatar, Button, Chip, Grid, Typography, Paper} from '@mui/material';
import Navigation from '../Navigation/index.js';
import TopGoal from '../Landing/topGoal';
import LatestBlogPost from '../Landing/latestBlogPost';
import Login from '../Account/Login.js';
import {useDispatch, useSelector} from 'react-redux';
import {removeAccount} from '../Account/accountSlice.js';

const Landing = () => {
  const dispatch = useDispatch();
  const account = useSelector(state => state.account.value);
  return (
    <>
      {Object.keys(account).length > 0 ? (
        <>
          {console.log(account)}
          <Navigation />
          <Grid container align="center" rowSpacing={1.5}>

            <Grid item xs={12} marginTop={5}>
              <Typography variant="h4" align="center">
                Welcome, {account.first_name}
              </Typography>
            </Grid>

            <Grid item xs={6}>
            <Paper elevation={3} style={{ padding: '20px' }}>
            
              <TopGoal />

              </Paper>
            </Grid>

            <Grid item xs={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
          <LatestBlogPost />
          </Paper>
          </Grid>
            
            <Grid item xs={12} margin={1}>
              <Button
                data-testid="signout-button"
                size="large"
                edge="start"
                color="primary"
                sx={{
                  '&:hover': {backgroundColor: 'lightblue'},
                }}
                onClick={() => dispatch(removeAccount())}
                variant="contained"
              >
                Sign out
                <Chip
                  avatar={<Avatar src={account.photo_url} />}
                  label={account.first_name + ' ' + account.last_name}
                  sx={{marginX: 2, color: 'white'}}
                />
              </Button>
            </Grid>
          </Grid>
        </>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Landing;
