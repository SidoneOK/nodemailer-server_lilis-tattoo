const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const cors = require('cors');
require('dotenv').config()

const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

const OAuth2_client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET)
OAuth2_client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })



app.use(cors({
  origin: 'https://www.lilistattoo.com', // use your actual domain name (or localhost), using * is not recommended
  // optionsSuccessStatus: 200, https://www.lilistattoo.com  
}))
app.options('/booking', cors());

app.use(express.json({ limit: "150mb" }));


app.get('/', (req, res) => {
  res.send('HI server is working 2')
})


function requestBodyObject(body) {
  return {
    ...body,
    tattooImgArray: body.tattooImgArray.map((file) => {
      return { ...file, url: `file length: ${file.url.length}` };
    }),
  };
}

async function sendToTg(message) {
  try {

    let url = 'https://api.telegram.org/bot' + process.env.TELEGRAM_BOT_TOKEN + '/sendMessage';
    let body = JSON.stringify({
      chat_id: process.env.TG_CHAT,
      parse_mode: 'Markdown',
      text: message,
    });
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
        'Access-Control-Allow-Headers':
          'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
      },
      body,
    });
    console.log("No problem", message);
    return res;
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    throw error; // Ретранслюємо помилку для обробки вище
  }
}


// app.get("/test", async function (req, res) {
//   try {
//     await sendToTg("message")
//     return true
//   } catch(error) {
//     return error
//   }
// })



app.post("/sent", async function (request, result) {
  // console.log("Request start info", requestBodyObject(request.body));

  let output = `
    <h3>${request.body.firstName} ${request.body.lastName} </h3>
    <ul>
      <li>Name: ${request.body.firstName} ${request.body.lastName} </li>
      <li>Email: ${request.body.email} </li>
      <li>Phone: ${request.body.telephone} </li>
      <li>Instagram nickname: ${request.body.instagramNikname} </li>
      <li>${request.body.firstName} birthday: ${request.body.birthDate} </li>
      <li>${request.body.firstName} location: ${request.body.location}</li>
      <li>Description of what ${request.body.firstName} want: ${request.body.message}</li>
      <li>Tattoo size: ${request.body.TattooSize}</li>
      <li>Placement on body: ${request.body.Placement}</li>
      <li>Preferred skin tone: ${request.body.skinTone}</li>
      <li>Preferred tattoo color: ${request.body.tatooColor}</li>
      <li>${request.body.firstName} availability: ${request.body.availability}</li>
      <li>Other inquiries: ${request.body.otherInquires}</li>
      <li>Contraindications: ${request.body.Contraindications}</li>
      <li>BestDays: ${request.body.BestDays}</li>
      <li>otherInquires: ${request.body.otherInquires}</li>
      <li>Limit budget: ${request.body.budget}</li>
      <li>Person is over 18: ${request.body.age}</li>
      <li>Will check Spam folder: ${request.body.checkSpam}</li>
    </ul>
    `;


  const accessToken = OAuth2_client.getAccessToken();
  let transporter = nodemailer.createTransport({
    servise: "gmail",
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken
    },
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    // auth: {
    //   user: process.env.EMAIL,
    //   pass: process.env.APP_PASSWORD,
    // },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // send mail with defined transport object
  let mailOptions = {
    from: "testLiliaTatto@gmail.com",
    to: "lilis.tattooo@gmail.com", //lilis.tattooo@gmail.com
    replyTo: `${request.body.email}`,
    subject: `LILIS:New Sign Up for Tattooing from  ${request.body.firstName} ${request.body.lastName}`,
    text: "profile below",
    html: output,
    attachments: request.body.tattooImgArray.map((file) => {
      return {
        filename: file.title,
        content: file.url.split("base64,")[1],
        encoding: "base64",
      };
    }),
  };

  let sendMailResultHandler = async (error, info) => {
    if (error) {
      let errorInfo = {
        text: "ERROR",
        message: error,
        profile: request.body,
        info: info,
      };
      console.log(error, 'email sender error')

      const errorMessage = `
      Error sending email:Code: ${error.code}\n
      Command: ${error.command}\n
      Message: ${error.message}\n
    `;
      await sendToTg(errorMessage)
      result.json(errorInfo);
      return;
    }

    let emailSent = {
      text: "Email sent",
      profile: requestBodyObject(request.body),
      info: info,
    };

   
    const tgMessage = getTgMessade(emailSent);
    // console.log("Email sent piece", request.body);
    // console.log(emailSent, 'emailSent shom emailer')
    await sendToTg(tgMessage)
    result.json(emailSent);
  };

  transporter.sendMail(mailOptions, sendMailResultHandler);
  await sendToTg('after transporter')
  console.log('after transporter')
});  



function getTgMessade(emailSent) {
  const tgMessage = `
  Email sent successfully:\n
  *Name:* ${emailSent.profile.firstName} ${emailSent.profile.lastName}\n
  *Email:* ${emailSent.profile.email}\n
  *Telephone:* ${emailSent.profile.telephone}\n
  *Instagram Nickname:* ${emailSent.profile.instagramNikname}\n
  *Birth Date:* ${emailSent.profile.birthDate}\n
  *Location:* ${emailSent.profile.location}\n
  *Tattoo Size:* ${emailSent.profile.TattooSize}\n
  *Placement:* ${emailSent.profile.Placement}\n
  *Skin Tone:* ${emailSent.profile.skinTone}\n
  *Message:* ${emailSent.profile.message}\n
  *Tattoo Color:* ${emailSent.profile.tatooColor}\n
  *Availability:* ${emailSent.profile.availability}\n
  *Contraindications:* ${emailSent.profile.Contraindications}\n
  *Best Days:* ${emailSent.profile.BestDays}\n
  *Other Inquiries:* ${emailSent.profile.otherInquires}\n
  *Budget:* ${emailSent.profile.budget}\n
  *Age:* ${emailSent.profile.age}\n
  *Check Spam Folder:* ${emailSent.profile.checkSpam}\n
`;
  return tgMessage
 }



app.listen(3001, () => {
  console.log("server started...");
});