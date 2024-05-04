import fetch from 'node-fetch';

test('check that server sends transactions', async () => {
  const getTransactionsApi = async () => {
    const url = 'http://localhost:5000/api/getTransactions';

    const response = await fetch(url);

    const body = await response.json();
    if (response.status !== 200) throw Error(body.error);
    return body;
  };

  const res = await getTransactionsApi();
  const transactions = res;

  // Assuming transactions is an array of transaction objects
  expect(transactions).toBeDefined();
  expect(Array.isArray(transactions)).toBe(true);
  expect(transactions.length).toBeGreaterThan(0);

  // Checking properties of the first transaction
  const firstTransaction = transactions[0];
  expect(firstTransaction).toHaveProperty('id');
  expect(firstTransaction).toHaveProperty('amount');
  expect(firstTransaction).toHaveProperty('category');
  expect(firstTransaction).toHaveProperty('date');
});
