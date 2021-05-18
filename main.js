const express = require('express');
const app = express();
const mysql = require('./dbcon');


app.use(express.static('public'));
app.set('port', 6531);
app.use(express.json());

//Queries
//TODO

// Get all rows
app.get('/', (req, res) => {
    //TODO
});


// Add new row to table
app.post('/', (req, res) => {
    //TODO

});


app.delete('/', (req, res) => {
    //TODO
});

app.get('/reset-table', (req, res, next) => {
    //TODO
});


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