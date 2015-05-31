var dequeue = require ('dequeue');
var dgram = require("dgram");
var FIFO = new dequeue();

var udpserver = dgram.createSocket("udp4");
var udpclient = dgram.createSocket("udp4");

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./ais.db');
var sys = require('sys')
var child1 = require('child_process').spawn('./aisdispatcher', ['-u', '-h', '0.0.0.0', '-p', '4003', '-H', '192.168.1.111:5000']);
var child2 = require('child_process').spawn('./gpsd', ['udp://192.168.1.111:5000']);
var child = require('child_process').spawn('./gpspipe', ['-w', '-S', '-2']);
child.stdout.setEncoding('utf8');

var ftpclient = require('ftp');
var fs = require('fs');

var MMSI;
var LONGITUDE;
var LATITUDE;
var COG;
var SOG;
var NAVSTAT;
var IMO;
var NAME;
var CALLSIGN;
var TYPE;
var A;
var B;
var C;
var D;
var DRAUGHT;
var DEST;
var ETA;
var TIME;
var xml;
var query;
var obj;
var i;
var msg;
var lines;
var message;
var curmmsi;

udpserver.bind(4001);
udpclient.bind(4002);

setInterval(fetcher,2);

udpserver.on("message",
    function (msg, rinfo) {
        FIFO.push(msg);
    }
);

function fetcher () {
    if (FIFO.length > 0) {
        msg = FIFO.shift();
        udpclient.send(msg, 0, msg.length, 4003, '127.0.0.1', function(err, bytes) {
			if (err) throw err;
		});
    }
}

function buildxml(message) {
    IMO = message.IMO ? message.IMO : "";
    NAME = message.NAME ? message.NAME : "";
    CALLSIGN = message.CALLSIGN ? message.CALLSIGN : "";
    TYPE = message.TYPE ? message.TYPE : "";
    A = message.A ? message.A : "";
    B = message.B ? message.B : "";
    C = message.C ? message.C : "";
    D = message.D ? message.D : "";
    DRAUGHT = message.DRAUGHT ? message.DRAUGHT : "";
    DEST = message.DEST ? message.DEST : "";
    ETA = message.ETA ? message.ETA : "";
    ETA = ETA.replace("T", " ").replace("Z", "");
    TIME = new Date().toISOString();
    TIME = TIME.replace("T", " ").slice(0, -5).concat(" GMT");
    MMSI = obj['mmsi'];
    LONGITUDE = obj['lon'];
    LATITUDE = obj['lat'];
    COG = obj['course'];
    SOG = obj['speed'];
    NAVSTAT = obj['status'];
    xml = "<vessel ";
    xml += "MMSI=" + '"' + MMSI + '"';
    xml += "  TIME=" + '"' + TIME + '"';
    xml += "  LONGITUDE=" + '"' + LONGITUDE + '"';
    xml += "  LATITUDE=" + '"' + LATITUDE + '"';
    xml += "  COG=" + '"' + COG + '"';
    xml += "  SOG=" + '"' + SOG + '"';
    xml += "  NAVSTAT=" + '"' + NAVSTAT + '"';
    xml += "  IMO=" + '"' + IMO + '"';
    xml += "  NAME=" + '"' + NAME + '"';
    xml += "  CALLSIGN=" + '"' + CALLSIGN + '"';
    xml += "  TYPE=" + '"' + TYPE + '"';
    xml += "  A=" + '"' + A + '"';
    xml += "  B=" + '"' + B + '"';
    xml += "  C=" + '"' + C + '"';
    xml += "  D=" + '"' + D + '"';
    xml += "  DRAUGHT=" + '"' + DRAUGHT + '"';
    xml += "  DEST=" + '"' + DEST + '"';
    xml += "  ETA=" + '"' + ETA + '"';
    xml += " />";
    console.log(xml);
}

function writedb(obj) {
    query = "REPLACE INTO MESSAGES (MMSI,IMO,NAME,CALLSIGN,TYPE,A,B,C,D,DRAUGHT,DEST,ETA) VALUES ("
    + "'" + obj['mmsi'] + "',"
    + "'" + obj['imo'] + "',"
    + "'" + obj['shipname'] + "',"
    + "'" + obj['callsign'] + "',"
    + "'" + obj['shiptype'] + "',"
    + "'" + obj['to_bow'] + "',"
    + "'" + obj['to_stern'] + "',"
    + "'" + obj['to_port'] + "',"
    + "'" + obj['to_starboard'] + "',"
    + "'" + obj['draught'] + "',"
    + "'" + obj['destination'] + "',"
    + "'" + obj['eta'] + "'" +
    ")";
    db.run(query);
}

function readdb(curmmsi,callback)
{
    db.get("SELECT MAX(rowid) AS IMO,NAME,CALLSIGN,TYPE,A,B,C,D,DRAUGHT,DEST,ETA FROM messages WHERE MMSI = " + curmmsi + " LIMIT 1", function (err, message) {
        if (err) {console.log(err + 'eeeeeeee')}
        if (message.NAME){
            callback(message)
        }
    });
}

child.stdout.on('data', function(data) {
    lines = data.split("\r\n");
    for(i  in lines) {
        if (lines[i].substring(0,1) == "{") {
            try {
                obj = JSON.parse(lines[i]);
            } catch (err) {
                console.log(err);
                console.log(lines[i])
            }
            if (obj['type'] == 5) {
                writedb(obj);
            } else if (obj['type'] == 1 || obj['type'] == 3) {
                curmmsi = obj['mmsi'];
                readdb(curmmsi,buildxml);
            } else {
            }
        }
    }
});

