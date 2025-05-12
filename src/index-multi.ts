import cluster from 'node:cluster';
import process from 'node:process';
import dotenv from 'dotenv';
import http from 'http';
import os from 'node:os';

import './config/dependencies';
import routes from './routes';
import { Container } from './container';
import { setUsers, UserRepository } from './repositories/UserRepository';
import { User } from './models/User';

dotenv.config();

const hostname = '127.0.0.1';
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const numCPUs = os.cpus().length;
const workers = numCPUs > 1 ? numCPUs - 1 : 1;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  const workerPorts: number[] = [];
  for (let i = 0; i < workers; i++) {
    const currentPort = port + i + 1;
    workerPorts.push(currentPort);
    cluster.fork({ WORKER_PORT: currentPort.toString() });
  }

  cluster.on('message', (_, message) => {
    if (cluster.workers) {
      Object.values(cluster.workers).forEach((w) => {
        w?.send(message); // Broadcast update to all workers
      });
    }

    console.log('Updated users.');
  });

  let currentWorker = 0;

  const server = http.createServer((req, res) => {
    const options = {
      hostname: hostname,
      port: workerPorts[currentWorker],
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxyServer = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    req.pipe(proxyServer, { end: true });

    proxyServer.on('error', (err) => {
      res.writeHead(500);
      res.end(`Load balancer error: ${err.message}`);
    });

    currentWorker = (currentWorker + 1) % workerPorts.length;
  });

  server.listen(port, hostname, () => {
    console.log(`Load balancer running at http://${hostname}:${port}/`);
  });
} else {
  const workerPort = parseInt(process.env.WORKER_PORT || '3001');

  interface WorkerMessage {
    users?: User[];
  }

  process.on('message', (message: WorkerMessage) => {
    if (message && message.users) {
      setUsers(message.users);
    }
  });

  const server = http.createServer(async (req, res) => {
    const result = await routes.handler(req, res);

    const repository = Container.getInstance().get<UserRepository>(
      UserRepository.name,
    );

    if (process.send) {
      process.send({
        users: repository.all(),
      });
    } else {
      console.error(
        'process.send is undefined, likely because we are in the master process.',
      );
    }

    return result;
  });

  server.listen(workerPort, hostname, () => {
    console.log(`Worker Server running at http://${hostname}:${workerPort}/`);
  });
}
