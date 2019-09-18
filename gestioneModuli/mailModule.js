
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fruttamattamail@gmail.com',
    pass: '5d547b41f089792dc0bab839',
  },
});
const sendMail = (to, subject, html, after) => {
  const mailOptions = {
    from: 'fruttamattamail@gmail.com',
    to,
    subject,
    html,

  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
      after();
    }
  });
};

exports.sendMail = sendMail;
