import fetch from 'node-fetch';

test('check that server sends credit scores', async () => {
  const getCreditScoresApi = async () => {
    const url = 'http://localhost:5000/api/getCreditScores';

    const response = await fetch(url);

    const body = await response.json();
    if (response.status !== 200) throw Error(body.error);
    return body;
  };

  const res = await getCreditScoresApi();
  const creditScores = res;

  expect(creditScores).toBeDefined();
  expect(Array.isArray(creditScores)).toBe(true);
  expect(creditScores.every(score => score.hasOwnProperty('name'))).toBe(true);
});

test('check adding a credit score', async () => {
  const addCreditScoreApi = async () => {
    const url = 'http://localhost:5000/api/addCreditScore';

    const reqBody = JSON.stringify({
      name: 'John Doe',
      age: 30,
      income: 60000,
      employmentStatus: 'employed',
      monthlyExpenses: 2000,
      savings: 30000,
      debt: 5000,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: reqBody,
    });

    const body = await response.json();
    if (response.status !== 201) throw Error(body.error);
    return body;
  };

  const res = await addCreditScoreApi();

  expect(res.success).toBe(true);
});
