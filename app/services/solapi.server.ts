import coolsms from 'coolsms-node-sdk';

type CoolsmsMessageService = typeof coolsms;

const messageService: CoolsmsMessageService = new coolsms.default(
  process.env.COOL_SMS_API_KEY,
  process.env.COOL_SMS_SECRET_KEY
);

type Props = {
  from: string;
  to: string;
  text: string;
};

export async function sendOneMessage({ from, to, text }: Props) {
  const data = await messageService.sendOne({
    to,
    from,
    text: text,
  });

  return data;
}

// apiKey, apiSecret 설정
// const messageService = new coolsms('ENTER_YOUR_API_KEY', 'ENTER_YOUR_API_SECRET');

// const BASE_URL = 'https://api.solapi.com/messages/v4/send-many/detail';

// import crypto from 'crypto';

// SOLAPI_API_KEY
// SOLAPI_SECRET

// const salt = 'jqsba2jxjnrjor';

// export function generateSignature(date) {
//   const message = date + salt;

//   const signature = crypto
//     .createHmac('sha256', process.env.SOLAPI_SECRET)
//     .update(message)
//     .digest('hex');

//   return signature;
// }

// export async function sendOneMessage() {
//   const date = new Date();

//   return await fetch(BASE_URL, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `AuthenticationMethod apiKey=${
//         process.env.SOLAPI_API_KEY
//       }, date=${date}, salt=${salt}, signature=${generateSignature(date)}`,
//     },
//     body: {
//       messages: [
//         {
//           to: '01097690373',
//           from: '01097690373',
//           text: 'text~',
//         },
//       ],
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => console.log(data))
//     .catch((error) => console.error('Error:', error));
// }
