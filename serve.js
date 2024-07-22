const httpServer = require('http-server');
const path = require('path');

const port = process.env.PORT || 8080; // Use PORT from environment or default to 8080

const server = httpServer.createServer({
  root: path.join(__dirname, './html/'),
  cors: true,
});

server.listen(port, () => {
  console.log(`Starting up http-server, serving ./ on port ${port}`);
  console.log('Available on:');
  console.log(`  http://127.0.0.1:${port}`);
  console.log(`  http://localhost:${port}`);
  console.log('Hit CTRL-C to stop the server');

  server.server.on('request', (req, res) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  });

  server.server.on('error', (err) => {
    console.error('Server Error:', err);
  });

  server.server.on('clientError', (err, socket) => {
    console.error('Client Error:', err);
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  });
});