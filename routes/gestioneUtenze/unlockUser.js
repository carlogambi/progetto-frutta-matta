const express = require('express');

const unlockUser = express.Router();

unlockUser.post('/confNumb', (req, res) => {
  const { confNumb } = req.body;
  res.json({ response: `confNumb data recived: ${confNumb}` });
  const { db } = req;
  const collection = db.get('docUtenti');
  collection.findOne({ type: 'docTotUtenti' }).then((data) => {
    const noValUsrz = data.nonValidatedUsers;
    const index = noValUsrz.findIndex(piece => piece.valkey === confNumb);
    const valUsrz = data.users;
    const thisUsr = noValUsrz[index];
    valUsrz.push(thisUsr);
    noValUsrz.splice(index, 1);
    collection.findOneAndUpdate({ type: 'docTotUtenti' }, { $set: { nonValidatedUsers: noValUsrz, users: valUsrz } }).then(() => { });
  });
});


module.exports = unlockUser;
