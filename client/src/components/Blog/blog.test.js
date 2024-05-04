import fetch from 'node-fetch';

test('check that server sends a blog object', async () => {
  const getPostApi = async () => {
    const url = 'http://localhost:5000/api/getPostById';

    const reqBody = JSON.stringify({
      id: 13,
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

  const res = await getPostApi();
  const post = res.express[0];

  expect(post).toBeDefined();
  expect(post).not.toBeNull();
  expect(post).toHaveProperty('title');
});

test('check that server sends a user object', async () => {
  const getUserApi = async () => {
    const url = 'http://localhost:5000/api/getAuthor';

    const reqBody = JSON.stringify({
      id: 1,
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

  const res = await getUserApi();
  const user = res.express[0];

  expect(user).toBeDefined();
  expect(user).not.toBeNull();
  expect(user).toHaveProperty('first_name');
});
