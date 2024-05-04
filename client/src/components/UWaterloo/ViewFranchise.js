import {useEffect, useState} from 'react';
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
  Typography,
} from '@mui/material';
import queryString from 'query-string';
import Navigation from '../Navigation';
import {useSelector} from 'react-redux';

const ViewFranchise = () => {
  const account = useSelector(state => state.account.value);
  const franchiseId = queryString.parse(window.location.search).id;

  const [franchise, setFranchise] = useState({});
  useEffect(() => {
    getFranchise();
  }, []);

  const getFranchise = () => {
    getFranchiseApi().then(res => {
      console.log('getFranchiseApi returned: ', res);
      setFranchise(res);
    });
  };

  const getFranchiseApi = async () => {
    const url = '/api/getFranchiseById';

    const reqBody = JSON.stringify({
      id: franchiseId,
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
        <Grid item xs={12}>
          <Typography variant="h2" align="center" marginTop={3}>
            {franchise.name ? franchise.name : 'loading...'}
          </Typography>
        </Grid>

        <Grid item xs={12} marginY={1}>
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

        {franchise.combos ? (
          <Grid item xs={12} marginLeft={10} marginRight={10} marginY={2}>
            <TableContainer component={Paper}>
              <Table sx={{minWidth: 650}}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{width: '20%'}}>Name</StyledTableCell>
                    <StyledTableCell sx={{width: '40%'}}>
                      Description
                    </StyledTableCell>
                    <StyledTableCell sx={{width: '40%'}}>Photo</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {franchise.combos.map((item, index) => {
                    return (
                      <StyledTableRow
                        data-testid={`post-${item.name}-tablerow`}
                        key={item.name}
                        sx={{
                          '&:last-child td, &:last-child th': {border: 0},
                        }}
                      >
                        <StyledTableCell component="th" scope="row">
                          {item.name}
                        </StyledTableCell>
                        <StyledTableCell>{item.options}</StyledTableCell>
                        <StyledTableCell>
                          {item.image ? (
                            <img
                              src={item.image.url}
                              alt={item.name}
                              width="350px"
                              height="200px"
                            />
                          ) : (
                            ''
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        ) : (
          <></>
        )}
      </Grid>
    </>
  );
};
export default ViewFranchise;
