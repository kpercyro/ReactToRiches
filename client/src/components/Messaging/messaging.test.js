import fetch from 'node-fetch';

test('check that server sends messages', async () => {
  const getMessagesApi = async () => {
    const url = 'http://localhost:5000/api/getSentMessages';

    const response = await fetch(url);

    const body = await response.json();
    if (response.status !== 200) throw Error(body.error);
    return body;
  };

  const res = await getMessagesApi();
  const messages = res.messages;

  expect(messages).toBeDefined();
  expect(Array.isArray(messages)).toBe(true);
  expect(messages.every(message => message.hasOwnProperty('recipient_name') && message.hasOwnProperty('message_text'))).toBe(true);
});

test('check sending a message', async () => {
  const sendMessageApi = async () => {
    const url = 'http://localhost:5000/api/sendMessage';

    const reqBody = JSON.stringify({
      recipientName: 'John', // Provide the recipient name
      messageText: 'Hello, John!', // Provide the message text
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

  const res = await sendMessageApi();

  expect(res.message).toEqual('Message sent successfully');
});
