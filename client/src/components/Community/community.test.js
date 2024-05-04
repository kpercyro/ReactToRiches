import fetch from 'node-fetch';

test('check that server sends communities', async () => {
  const getCommunitiesApi = async () => {
    const url = 'http://localhost:5000/api/getCommunities';

    const response = await fetch(url);

    const body = await response.json();
    if (response.status !== 200) throw Error(body.error);
    return body;
  };

  const res = await getCommunitiesApi();
  const communities = res.communities;

  expect(communities).toBeDefined();
  expect(Array.isArray(communities)).toBe(true);
  expect(communities.every(community => community.hasOwnProperty('name'))).toBe(true);
});

test('check creating new community', async () => {
  const createCommunityApi = async () => {
    const url = 'http://localhost:5000/api/createCommunity';

    const reqBody = JSON.stringify({
      name: 'New Community',
      description: 'This is a new community.',
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

  const res = await createCommunityApi();

  expect(res.message).toEqual('Community created successfully');
});
