const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const cors = require('cors');
require('dotenv').config()



app.use(cors({
  origin: 'https://www.lilistattoo.com', // use your actual domain name (or localhost), using * is not recommended
    // optionsSuccessStatus: 200,
}))
app.options('/booking', cors());

app.use(express.json({ limit: "150mb" }));


app.get('/',  (req, res) => {
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
  
  app.post("/sent", function (request, result) {
    console.log("Request start info", requestBodyObject(request.body));
  
    let output = `
    <p>You have a new sign up for tattooing to Lilis</p>
    <h3>Sign Up Profile </h3>
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
  
    let transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false, // STARTTLS// true for 465, false for other ports
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  
    // send mail with defined transport object
    let mailOptions = {
      from: "liliatatooing@outlook.com",
      to: "liliatatooing@outlook.com",
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
  
    let sendMailResultHandler = (error, info) => {
      if (error) {
        let errorInfo = {
          text: "ERROR",
          message: error,
          profile: request.body,
          info: info,
        };
        console.log(errorInfo)
        result.json(errorInfo);
        return;
      }
  
      let emailSent = {
        text: "Email sent",
        profile: requestBodyObject(request.body),
        info: info,
      };
      // console.log("Email sent piece", request.body);
      result.json(emailSent);
    };
  
    transporter.sendMail(mailOptions, sendMailResultHandler);
  });




app.listen(3001, () => {
  console.log("server started...");
});