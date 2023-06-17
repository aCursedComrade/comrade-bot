import http from 'http';

// Simple server to play around with, not associated with the bot yet
async function server() {
    http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Site under development');
    }).listen((parseInt(process.env.PORT, 10) || 9000), '0.0.0.0');
    console.log('Server started.');
}

export default server;
