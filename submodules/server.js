import http from 'http';
import logger_func from '../logger.js';
const logger = new logger_func();

// Simple server to play around with, not associated with the bot yet
async function server() {
  http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Site under development');
  }).listen((parseInt(process.env.PORT, 10) || 8080), '0.0.0.0');
  logger.log('Server started.');
}

export default server;
