var Client = require('ftp');
var fs = require('fs');

var c = new Client();
c.on('ready', function() {
    c.put('feedbagaar.xml', 'feedbagaar.xml', function(err) {
        if (err) throw err;
        c.end();
    });
});
// connect to localhost:21 as anonymous
