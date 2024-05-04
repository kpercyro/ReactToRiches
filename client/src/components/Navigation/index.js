import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useState} from 'react';
import Navigation from '../Navigation/index.js';
import Login from '../Account/Login.js';
import {useDispatch, useSelector} from 'react-redux';
import {removeAccount} from '../Account/accountSlice.js';

const Landing = () => {
  const [financeAnchorEl, setFinanceAnchorEl] = useState(null);
  const [socialAnchorEl, setSocialAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const account = useSelector(state => state.account.value);

  const handleFinanceClick = event => {
    setFinanceAnchorEl(event.currentTarget);
  };

  const handleFinanceClose = () => {
    setFinanceAnchorEl(null);
  };

  const handleSocialClick = event => {
    setSocialAnchorEl(event.currentTarget);
  };

  const handleSocialClose = () => {
    setSocialAnchorEl(null);
  };

  const handleProfileClick = event => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleSignOut = () => {
    dispatch(removeAccount());
    window.open('/', '_self');
  };

  const buttonSx = {
    minWidth: '120px',
    height: '48px', // Set the same height for all buttons
    mr: 4,
    border: '1px solid white',
    '&:hover': {backgroundColor: 'lightblue'},
  };

  return (
    <>
      {Object.keys(account).length > 0 ? (
        <>
          <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
              <Toolbar>
                <h1 style={{marginRight: '20px'}}>ReactToRiches</h1>
                <Button
                  size="large"
                  edge="start"
                  color="inherit"
                  sx={buttonSx}
                  onClick={() => window.open('/', '_self')}
                >
                  Home
                </Button>

                {/* Finances dropdown */}
                <Button
                  data-testid="finance-menu"
                  size="large"
                  color="inherit"
                  aria-controls="finance-menu"
                  aria-haspopup="true"
                  onClick={handleFinanceClick}
                  sx={buttonSx}
                >
                  Finances <ExpandMoreIcon />
                </Button>
                <Menu
                  id="finance-menu"
                  anchorEl={financeAnchorEl}
                  open={Boolean(financeAnchorEl)}
                  onClose={handleFinanceClose}
                >
                  <MenuItem onClick={() => window.open('/budget', '_self')}>
                    Budget
                  </MenuItem>
                  <MenuItem onClick={() => window.open('/goals', '_self')}>
                    Goals
                  </MenuItem>
                  <MenuItem onClick={() => window.open('/livestocks', '_self')}>
                    Stocks
                  </MenuItem>
                  <MenuItem onClick={() => window.open('/watchlist', '_self')}>
                    Watchlist
                  </MenuItem>
                  <MenuItem
                    onClick={() => window.open('/creditScore', '_self')}
                  >
                    Credit Score
                  </MenuItem>
                </Menu>

                {/* Social dropdown */}
                <Button
                  data-testid="social-menu"
                  size="large"
                  color="inherit"
                  aria-controls="social-menu"
                  aria-haspopup="true"
                  onClick={handleSocialClick}
                  sx={buttonSx}
                >
                  Social <ExpandMoreIcon />
                </Button>
                <Menu
                  id="social-menu"
                  anchorEl={socialAnchorEl}
                  open={Boolean(socialAnchorEl)}
                  onClose={handleSocialClose}
                >
                  <MenuItem
                    data-testid="blog-menu-item"
                    onClick={() => window.open('/blogList', '_self')}
                  >
                    Blog
                  </MenuItem>
                  <MenuItem onClick={() => window.open('/community', '_self')}>
                    Community
                  </MenuItem>
                  <MenuItem onClick={() => window.open('/videos', '_self')}>
                    Videos
                  </MenuItem>
                  <MenuItem onClick={() => window.open('/messaging', '_self')}>
                    Messaging
                  </MenuItem>
                </Menu>

                {/* Profile dropdown */}
                <Button
                  data-testid="profile-menu"
                  size="large"
                  color="inherit"
                  aria-controls="profile-menu"
                  aria-haspopup="true"
                  onClick={handleProfileClick}
                  sx={buttonSx}
                >
                  <Avatar
                    src={account.photo_url}
                    sx={{width: 24, height: 24, mr: 1}}
                  />
                  <Typography variant="body1" sx={{marginLeft: '8px'}}>
                    {account.first_name}
                  </Typography>
                  <ExpandMoreIcon />
                </Button>
                <Menu
                  id="profile-menu"
                  anchorEl={profileAnchorEl}
                  open={Boolean(profileAnchorEl)}
                  onClose={handleProfileClose}
                >
                  <MenuItem
                    onClick={() => window.open('/foodServices', '_self')}
                  >
                    Food Services
                  </MenuItem>
                  <MenuItem
                    data-testid="dates-menu-item"
                    onClick={() => window.open('/importantDates', '_self')}
                  >
                    Important Dates
                  </MenuItem>
                  <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
                </Menu>

                {/* Notification button */}
                <Button
                  size="large"
                  edge="start"
                  color="inherit"
                  sx={buttonSx}
                  onClick={() => window.open('/notificationMenu', '_self')}
                >
                  <NotificationsNoneIcon />
                </Button>
              </Toolbar>
            </AppBar>
          </Box>
        </>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Landing;
