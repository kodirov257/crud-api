import dotenv from 'dotenv';
import http from 'http';
import * as process from "node:process";

dotenv.config();

const hostname = '127.0.0.1';
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
