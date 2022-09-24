import http from 'http';
import fs from 'fs';
import { join, extname } from 'path';
import logger_func from './logger.js';
const logger = new logger_func();

// Simple server to play around with, not associated with the bot yet
async function server() {
  http.createServer((req, res) => {
    logger.log(`Request: ${req.url}`);
    const root = 'web';
    const file = req.url;
    let full_path = join(root, file);
    if (full_path == 'web/' || full_path == 'web\\') full_path = 'web/index.html';

    const extension = extname(full_path);
    let contentType = 'text/html';
    switch (extension) {
    case '.md':
      contentType = 'text/markdown; charset=UTF-8';
      break;
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.ico':
      contentType = 'image/x-icon';
      break;
    }

    fs.readFile(full_path, (error, content) => {
      if (error) {
        logger.error(`Error on: ${full_path} | ${error.code}`);
        if (error.code == 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<link rel="stylesheet" href="style.css"><h1>File not found</h1>', 'utf-8');
        }
        else {
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.end('<link rel="stylesheet" href="style.css"><h1>Server ran into a problem:</h1><br><pre>' + error.code + '</pre>', 'utf-8');
        }
      }
      else {
        logger.log(`Sent: ${full_path}`);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  }).listen(8080, '0.0.0.0');
  logger.log('Server started.');
}

// server();
export default server;