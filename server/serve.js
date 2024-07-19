const http = require('http');
const httpServer = require('http-server');
const path = require('path');

const server = httpServer.createServer({
  root: path.join(__dirname, './'),
  cors: true,
});

server.listen(8080, () => {
  console.log('Starting up http-server, serving ./');
  console.log('Available on:');
  console.log('  http://127.0.0.1:8080');
  console.log('  http://localhost:8080');
  console.log('Hit CTRL-C to stop the server');

  server.server.on('request', (req, res) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  });
});