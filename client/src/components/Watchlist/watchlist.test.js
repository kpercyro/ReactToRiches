import fetch from 'node-fetch';

test('check that server sends watchlist', async () => {
  const getWatchlistApi = async () => {
    const url = 'http://localhost:5000/api/getWatchlist';

    const response = await fetch(url);

    const body = await response.json();
    if (response.status !== 200) throw Error(body.error);
    return body;
  };

  const res = await getWatchlistApi();
  const watchlist = res.watchlist;

  expect(watchlist).toBeDefined();
  expect(Array.isArray(watchlist)).toBe(true);
  expect(watchlist.every(stock => stock.hasOwnProperty('name'))).toBe(true);
});

test('check deleting stock from watchlist', async () => {
  const deleteFromWatchlistApi = async () => {
    const url = 'http://localhost:5000/api/deleteFromWatchlist';

    const reqBody = JSON.stringify({
      stockName: 'AAPL', // Provide the stock name you want to delete
    });

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: reqBody,
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.error);
    return body;
  };

  const res = await deleteFromWatchlistApi();

  expect(res.message).toEqual('Stock deleted from watchlist');
});
