var express = require('express'),
  https = require('https'),
  app = express(),
  port = process.env.PORT || 3000;

app.listen(port);

app.use(express.static(__dirname + '/client'));

app.get('/', function (req, res) {
  res.sendFile('index.html', {root: __dirname});
})

// var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database('mydb.db');
// var check;

// var addStationsToDb = function (stations) {
//   db.serialize(function() {

//     db.run("CREATE TABLE if not exists stations (info TEXT)");
//     var stmt = db.prepare("INSERT INTO stations VALUES (?)");
//     for (var i = 0; i < stations.length; i++) {
//       var station = stations[i];
//       stmt.run(station.properties.addressStreet);
//     }
//     stmt.finalize();

//     db.each("SELECT rowid AS id, info FROM stations", function(err, row) {
//         console.log(row.id + ": " + row.info);
//     });
//     console.log(stations.length);
//   });

//   db.close();
// }
