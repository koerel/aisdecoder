var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/home/vagrant/Code/aisdecoder/ais.db');

db.each("SELECT MAX(rowid) AS IMO,NAME,CALLSIGN,TYPE,A,B,C,D,DRAUGHT,DEST,ETA FROM messages WHERE MMSI = 236037000", function(err, message) {
 	console.log(message.NAME);
});