
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fruttamattamail@gmail.com',
    pass: '5d547b41f089792dc0bab839',
  },
});
const sendMail = (a, b, c, after) => {
  const mailOptions = {
    from: 'fruttamattamail@gmail.com',
    to: 'carlogambi@hotmail.it',
    subject: 'prova immagini',
    html: '<img src="cid:note@example.com"/>',
    attachments: [
      {
        filename: 'image.png',
        path: `image.png`,
        cid: 'note@example.com', // should be as unique as possible
      },
    ],
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
