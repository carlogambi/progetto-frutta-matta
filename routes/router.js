const express = require('express');

const router = express.Router();





router.get('/', (req, res) => {
  res.render('logIn');
});

router.get('/user/:tempkey', (req, res) => {
  const { tempkey } = req.params;
  res.render('userPageIndexEo');
});

router.post('/ajax/test', (req, res) => {
  const { test } = req.body;
  console.log(test);
  res.json({ output: test });
});


module.exports = router;
