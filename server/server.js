import http from 'http';

const host = '0.0.0.0';
const port = '8080';

// Simple server to play around with, not associated with the bot yet

const reqlisten = function(req, res) {
  console.log(`Request received for: ${req.url}`);
  res.writeHead(200);
  res.end('A simple server, nothing to see here');
};

const server = http.createServer(reqlisten);

const startserver = function() {
  server.listen(port, host, () => {
    console.log(`Simple server started ${host}:${port}`);
  });
};

export default startserver;