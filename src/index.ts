import process from 'node:process';
import dotenv from 'dotenv';
import http from 'http';

import routes from './routes';
import './config/dependencies';

dotenv.config();

const hostname = '127.0.0.1';
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const server = http.createServer(routes.handler);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
