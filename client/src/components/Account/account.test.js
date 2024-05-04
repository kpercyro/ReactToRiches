import fetch from 'node-fetch';

test('check that server allows account creation', async () => {
  const addAccountApi = async () => {
    const url = 'http://localhost:5000/api/addAccount';

    const reqBody = JSON.stringify({
      email: 'jest-test@test.uwaterloo.ca',
      firstName: 'jest',
      lastName: 'test',
      photo:
        'https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Download-Image.png',
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
    const url = 'http://localhost:5000/api/updateNotifications';

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

    const resBody = await response.json();
    if (response.status !== 200) throw Error(resBody.message);
    return resBody;
  };

  const accountRes = await addAccountApi();
  expect(accountRes.express).toHaveProperty('insertId');

  const notiRes = await createNotifications(accountRes.express.insertId);
  expect(notiRes.express).toBeDefined();
  expect(notiRes.express).not.toBeNull();
});

test('check that server can fetch account details', async () => {
  const getAccountApi = async () => {
    const url = 'http://localhost:5000/api/getAccount';

    const reqBody = JSON.stringify({
      email: 'jest-test@test.uwaterloo.ca',
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

  const res = await getAccountApi();
  const user = res.express[0];

  expect(user).toBeDefined();
  expect(user).not.toBeNull();
  expect(user).toHaveProperty('photo_url');
});
