import fetch from 'node-fetch';

test('check that server sends goals', async () => {
  const getGoalsApi = async () => {
    const url = 'http://localhost:5000/api/getGoals';

    const response = await fetch(url);

    const body = await response.json();
    if (response.status !== 200) throw Error(body.error);
    return body;
  };

  const res = await getGoalsApi();
  const goals = res;

  expect(goals).toBeDefined();
  expect(Array.isArray(goals)).toBe(true);
  expect(goals.length).toBeGreaterThan(0);
  expect(goals.every(goal => goal.hasOwnProperty('id'))).toBe(true);
  expect(goals.every(goal => goal.hasOwnProperty('title'))).toBe(true);
  expect(goals.every(goal => goal.hasOwnProperty('targetAmount'))).toBe(true);
  expect(goals.every(goal => goal.hasOwnProperty('targetDate'))).toBe(true);
  expect(goals.every(goal => goal.hasOwnProperty('status'))).toBe(true);
  expect(goals.every(goal => typeof goal.id === 'number')).toBe(true);
  expect(goals.every(goal => typeof goal.title === 'string')).toBe(true);
});
