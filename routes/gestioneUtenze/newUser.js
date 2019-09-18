const express = require('express');
const uuid = require('uuid');
const mail = require('../../gestioneModuli/mailModule');

const creaUtente = express.Router();

creaUtente.post('/sendPssw', (req, res) => {
  const { email } = req.body;
  const { db } = req;
  const collection = db.get('docUtenti');
  collection.findOne({ type: 'docTotUtenti' }).then((data) => {
    data.users.forEach((user, index) => {
      if (user.email === email) {
        console.log('found it');
        mail.sendMail(email, 'fruttaMatta, recover your password', `user: ${data.users[index].user} pssw: ${data.users[index].pssw}`, () => {
          res.json({ response: ` email sent to ${data.users[index].user}` });
        });
      }
    });
  });
});

creaUtente.post('/newUser', (req, res) => {
  const valkey = uuid();
  const { user } = req.body;
  const { pssw } = req.body;
  const usrEmail = req.body.email;
  const { db } = req;
  const collection = db.get('docUtenti');
  collection.findOne({ type: 'docTotUtenti' }).then((data) => {
    const { nonValidatedUsers } = data;
    const existingUsr = nonValidatedUsers.concat(data.users);
    existingUsr.forEach((item) => {
      if (item.email === usrEmail) {
        res.json({ response: 'email already existing, try another email' });
      } else {
        nonValidatedUsers.push({
          user,
          pssw,
          email: usrEmail,
          valkey,
        });
        collection.findOneAndUpdate({ type: 'docTotUtenti' }, { $set: { nonValidatedUsers } }).then(() => {
          mail.sendMail(usrEmail, 'fruttaMatta, validate your account', `user: ${user} pssw: ${pssw} confirm key: ${valkey}`, () => {
            res.json({ response: 'yeah' });
          });
        });
      }
    });
  });
});

module.exports = creaUtente;
