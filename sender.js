/**
 * Created by karel on 29/05/15.
 */
var fs = require('fs');
var readline = require('readline');
var dgram = require("dgram");
var udpclient = dgram.createSocket("udp4");

udpclient.bind(4014);



var rd = readline.createInterface({
    input: fs.createReadStream('./nmea-sample'),
    output: process.stdout,
    terminal: false
});

rd.on('line', function(line) {
    console.log(line);
    line = line + "\n";
    udpclient.send(line, 0, line.length, 4001, '192.168.1.111', function(err, bytes) {
        if (err) throw err;
    });
});

rd.on('close', function(){
   console.log('All data processed');
    udpclient.close();
    process.exit();
});