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

const db = monk('mongodb://fruttaMatta:ventilatoregatto94@ds131296.mlab.com:31296/heroku_lf3bj8dl');
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
