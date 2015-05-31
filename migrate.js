/**
 * Created by karel on 30/05/15.
 */

var args = process.argv.slice(2);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./ais.db');

switch (args[0]) {

    case "up":
        query = "CREATE TABLE messages(ID INTEGER PRIMARY KEY AUTOINCREMENT,MMSI CHAR(10) NOT NULL UNIQUE,IMO CHAR(10),NAME CHAR(20),CALLSIGN CHAR(10),TYPE CHAR(5),A CHAR(10),B CHAR(10),C CHAR(10),D CHAR(10),DRAUGHT CHAR(10),DEST CHAR(20),ETA CHAR(30));";
        console.log(query);
        db.run(query);
        db.close();
        break;
    case "down":
        query = "DROP TABLE messages;";
        console.log(query);
        db.run(query);
        db.close();
        break;
    default :
        console.log("Use 'node migrate up' to migrate or 'node migrate down' to roll back.");
        process.exit();

}
