const http = require('http');
const fs = require('fs');

const server = http.createServer(function(req, res) {
	console.log(`request was made: ${req.url}`);
	res.writeHead(200, {'Content-Type': 'application/json'});
	const readStream = fs.createReadStream(__dirname + '/okveds.json');

	readStream.on('open', function () {
    readStream.pipe(res);
  });

  readStream.on('error', function(err) {
    res.end(err);
  });
});

server.listen(8080, '127.0.0.1');
console.log('Server listening to port 8080');