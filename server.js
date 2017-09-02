var express = require('express'),
  https = require('https'),
  app = express(),
  port = process.env.PORT || 3000;

app.listen(port);

app.use(express.static(__dirname + '/client'));

app.get('/', function (req, res) {
  res.sendFile('index.html', {root: __dirname});
});

app.get('/map', function (requ, res) {
  res.sendFile('map.html', {root: __dirname});
});
