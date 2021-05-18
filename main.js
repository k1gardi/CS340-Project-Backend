const express = require('express');
const app = express();
const cors = require("cors");
const mysql = require('./dbcon');

app.use(cors());
app.use(express.static('public'));
app.set('port', 6531);
app.use(express.json());

app.use(express.urlencoded({extended:true}));
// app.use('/static', express.static('public'));
app.set('mysql', mysql);
app.use('/sake', require('./sake.js'));
// app.use('/company', require('./company.js'));
// app.use('/review', require('./review.js'));
// app.use('/reviewer', require('./reviewer.js'));
// app.use('/', express.static('public'));

app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
  console.log(`Express started on http://${process.env.HOSTNAME}:${app.get('port')}; press Ctrl-C to terminate.`);
});