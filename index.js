const express = require('express');
const bodyParser = require('body-parser');
const monk = require('monk');
const engines = require('consolidate');

const app = express();

const router = require('./routes/router');

const newUser = require('./routes/gestioneUtenze/newUser');
const logIn = require('./routes/gestioneUtenze/logIn');
const unlockUser = require('./routes/gestioneUtenze/unlockUser');
const gestioneDoc = require('./routes/gestioneDocumenti/gestioneDoc');


app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(`${__dirname}/public`));
app.set('views', `${__dirname}/templates`);
app.engine('html', engines.mustache);
app.set('view engine', 'html');

const db = monk('process.env.MONGOLAB_URI');
db.then(() =>{
  console.log("connection success");
}).catch((e)=>{
  console.error("Error !",e);
});
app.use((req, res, next) => { req.db = db; next(); });

app.use('/', router);

app.use('/', newUser);
app.use('/', logIn);
app.use('/', unlockUser);
app.use('/', gestioneDoc);

app.listen(process.env.PORT || 3000);

console.log('test Running at Port 3000');

const collection = db.get('docUtenti');
collection.findOne({type: "docTotUtenti" }).then((doc) => {console.log(doc);})

app.post('/giveMeMyDataBitch', (req, res) => {
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
