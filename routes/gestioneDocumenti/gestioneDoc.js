const express = require('express');
const uuid = require('uuid');
const doc = express.Router();

doc.post('/giveMeMyDataBitch', (req, res) => {
  const { usrTempkey } = req.body;
  const { db } = req;
  const collection = db.get('docUtenti');
  collection.findOne({ type: 'docTotUtenti' }).then((data) => {
    console.log(data);
    const { users } = data;
    const index = users.findIndex(piece => piece.tempkey == usrTempkey);
    collection.find({ usrEmail: users[index].email }).then((docs) => {
      const tempUserData = users[index];
      delete tempUserData.pssw;
      res.json({ incoming: { userData: tempUserData, docs } });
    });
  });
});

doc.post('/modPssw', (req, res) => {
  const checkPssw = req.body.checkPssw.trim();
  const nuovaPssw = req.body.nuovaPssw.trim();
  let resp = '';
  const { db } = req;
  const collection = db.get('docUtenti');
  collection.findOne({ type: 'docTotUtenti' }).then((data) => {
    const { users } = data;
    users.forEach((user, index) => {
      if (user.pssw === checkPssw) {
        users[index].pssw = nuovaPssw;
        resp = 'password updated';
      } else {
        resp = 'the old password is wrong';
      }
    });
    if (resp === 'password updated') {
      collection.findOneAndUpdate({ type: 'docTotUtenti' }, { $set: { users } }).then(() => {
        res.json({ resp });
      });
    }
  });
});
doc.post('/modUsername', (req, res) => {
  console.log('ueooo');
  let resp = '';
  const newusername = req.body.newusername.trim();
  const { userEmail } = req.body;
  const { db } = req;
  const collection = db.get('docUtenti');
  collection.findOne({ type: 'docTotUtenti' }).then((data) => {
    const { users } = data;
    users.forEach((user, index) => {
      if (user.email === userEmail) {
        users[index].user = newusername;
        resp = 'userName updated';
      } else {
        resp = 'userName not updated';
      }
    });
    if (resp === 'userName updated') {
      collection.findOneAndUpdate({ type: 'docTotUtenti' }, { $set: { users } }).then(() => {
        res.json({ resp });
      });
    }
  });
});


doc.post('/salvaNewDoc', (req, res) => {
  const { newDoc } = req.body;
  const newDocParsed = JSON.parse(newDoc);
  const { db } = req;
  const collection = db.get('docUtenti');
  console.log(newDocParsed.articoli);
  collection.insert({
    usrEmail: newDocParsed.usrEmail,
    nDoc: newDocParsed.nDoc,
    dataDoc: newDocParsed.dataDoc,
    dettDoc: newDocParsed.dettDoc,
    fornitore: newDocParsed.fornitore,
    articoli: newDocParsed.articoli,
  });
});

doc.post('/nuovoArticolo', (req, res) => {
  const articolo = JSON.parse(req.body.toSend);
  console.log(articolo);
  const { docId } = articolo;
  delete articolo.docId;
  const { db } = req;
  const collection = db.get('docUtenti');
  collection.findOne({ _id: docId }).then((documento) => {
    documento.articoli.push(articolo);
    console.log(articolo);
    console.log(documento);
    const { articoli } = documento;
    collection.findOneAndUpdate({ _id: docId }, { $set: { articoli } }).then(() => {});
  });
});
doc.post('/modArticolo', (req, res) => {
  const articolo = JSON.parse(req.body.toSend);
  console.log(articolo);
  const { docId } = articolo;
  const { indexArt } = articolo;
  delete articolo.docId;
  delete articolo.indexArt;
  const { db } = req;
  const collection = db.get('docUtenti');
  collection.findOne({ _id: docId }).then((documento) => {
    const { articoli } = documento;
    articoli[indexArt] = articolo;
    console.log(articolo);
    console.log(documento);
    collection.findOneAndUpdate({ _id: docId }, { $set: { articoli } }).then(() => {});
  });
});

doc.post('/modDocumento', (req, res) => {
  const documento = JSON.parse(req.body.toSend);
  const { docId } = documento;
  const { nDoc } = documento;
  const { dataDoc } = documento;
  const { fornitore } = documento;
  const { dettDoc } = documento;
  const { db } = req;
  const collection = db.get('docUtenti');
  collection.findOne({ _id: docId }).then(() => {
    collection.findOneAndUpdate({ _id: docId }, {
      $set: {
        nDoc,
        dataDoc,
        fornitore,
        dettDoc,
      },
    }).then(() => {});
  });
});

doc.post('/modForn', (req, res) => {
  const { newNameForn } = req.body;
  const { oldNameForn } = req.body;
  const { db } = req;
  const collection = db.get('docUtenti');
  collection.find({ fornitore: oldNameForn }).then((data) => {
    data.forEach((docForn) => {
      collection.findOneAndUpdate({ _id: docForn._id }, {
        $set: {
          fornitore: newNameForn,
        },
      }).then(() => {});
    });
  });
});

doc.post('/deleteForn', (req, res) => {
  const { nomeForn } = req.body;
  const { db } = req;
  const collection = db.get('docUtenti');
  collection.remove({ fornitore: nomeForn });
});

doc.post('/deleteDoc', (req, res) => {
  const { docId } = req.body;
  const { db } = req;
  const collection = db.get('docUtenti');
  collection.remove({ _id: docId });
});

doc.post('/deleteArt', (req, res) => {
  const { indexArt } = req.body;
  const { docId } = req.body;
  const { db } = req;
  const collection = db.get('docUtenti');
  collection.findOne({ _id: docId }).then((documento) => {
    documento.articoli.splice(indexArt, 1);
    collection.findOneAndUpdate({ _id: docId }, { $set: { articoli } }).then(() => {});
  });
});

module.exports = doc;
