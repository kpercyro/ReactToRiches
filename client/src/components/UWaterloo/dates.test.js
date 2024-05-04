import fetch from 'node-fetch';

test('check that server sends all dates', async () => {
  const getDates = async () => {
    const url = 'http://localhost:5000/api/getDates';

    const reqBody = JSON.stringify({
      apiKey: 'E0537ED520B74DE19CA42E952E197305',
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

  const res = await getDates();
  const date = res[0];

  expect(date).toBeDefined();
  expect(date).not.toBeNull();
  expect(date).toHaveProperty('name');
});
