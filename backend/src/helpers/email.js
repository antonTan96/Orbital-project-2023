const nodemailer = require('nodemailer');
const baseURL = "https://rememberthemilk.azurewebsites.net/";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_ADDRESS,
      pass: process.env.GMAIL_PASSWORD
    }
});

function sendEmail(userEmail, token) {
    const mailOptions = {
      from: process.env.GMAIL_ADDRESS,
      to: userEmail,
      subject: '[Remember The Milk] Account Activation',
      text: `Please click the link below to activate your account.\n\n${baseURL}activate?token=${token}`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent');
      }
    });
}

module.exports = {sendEmail};