import crypto from 'crypto';
import axios from 'axios';

function getHeader() {
  const now = new Date().toISOString();
  // 16진수 64자의 랜덤 값 생성
  const genRanHex = (size) =>
    [...Array(size)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('');
  const salt = genRanHex(64);
  const message = now + salt;

  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_SECRET;

  const signature = crypto
    .createHmac('sha256', apiSecret!)
    .update(message)
    .digest('hex');

  return {
    Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${now}, salt=${salt}, signature=${signature}`,
  };
}

export async function fetchSolapi() {
  const uri = `https://api.solapi.com/messages/v4/list?limit=1`;

  const response = await axios.get(uri, {
    headers: getHeader(),
  });

  return response.data;
}

export async function sendMessageBySolapi() {
  const uri = `https://api.solapi.com/messages/v4/send-many/detail`;

  const response = await axios.post(
    uri,
    {
      messages: [
        {
          from: '01097690373',
          to: '01097690373',
          text: 'what the fuck',
        },
      ],
    },
    {
      headers: getHeader(),
    }
  );

  return response.data;
}
