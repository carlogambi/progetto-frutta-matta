const express = require('express');

const logIn = express.Router();

logIn.post('/login', (req, res) => {
  const { userEmail } = req.body;
  const { password } = req.body;
  const { db } = req;
  const collection = db.get('docUtenti');
  collection.findOne({ type: 'docTotUtenti' }).then((data) => {
    const { users } = data;
    const loggedUser = data.users.find((item) => {
      return item.email === userEmail && item.pssw === password;
    });
    if (loggedUser === undefined) {
      res.json({ incoming: false });
    } else {
      const index = data.users.findIndex(piece => piece.email === userEmail);
      users[index].tempkey = parseInt(Math.random() * (2000 - 2) + 2, 10);
      collection.findOneAndUpdate({ type: 'docTotUtenti' }, { $set: { users } }).then(() => {
        res.json({
          incoming: users[index].tempkey,
        });
      });
    }
  });
});


module.exports = logIn;
