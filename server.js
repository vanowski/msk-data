var express = require('express');
var path = require('path');

var server = express();

server.use(express.static('build'));

server.get('/', function(req, res) {
    res.sendFile(path.resolve('index.html'));
});

server.get('/tweets', function(req, res) {
    res.sendFile(path.resolve('data/tweets.csv'));
});

server.listen(9000, function() {
    console.log('Serving from ' + path.resolve('./'));
});