import { IncomingMessage, ServerResponse } from 'node:http';

import { UserController } from './controllers/UserController';
import { Container } from './container';
import { matchPath } from './utils';

const handler = async (
  req: IncomingMessage,
  res: ServerResponse,
): Promise<ServerResponse> => {
  try {
    const url = req.url;
    const method = req.method;

    if (!url || !method) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Request not found' }));
    }

    let match = matchPath('api/users', url);
    if (match.matched && method === 'GET') {
      const controller = Container.getInstance().get<UserController>(
        UserController.name,
      );
      return controller.list(req, res);
    }

    match = matchPath('api/users', url);
    if (match.matched && method === 'POST') {
      const controller = Container.getInstance().get<UserController>(
        UserController.name,
      );
      return await controller.create(req, res);
    }

    match = matchPath('api/users/{userId}', url);
    if (match.matched && method === 'GET') {
      const controller = Container.getInstance().get<UserController>(
        UserController.name,
      );

      if (!match.params.userId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Invalid user id' }));
      }

      return controller.show(req, res, match.params.userId);
    }

    match = matchPath('api/users/{userId}', url);
    if (match.matched && method === 'PUT') {
      const controller = Container.getInstance().get<UserController>(
        UserController.name,
      );

      if (!match.params.userId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Invalid user id' }));
      }

      return await controller.update(req, res, match.params.userId);
    }

    match = matchPath('api/users/{userId}', url);
    if (match.matched && method === 'DELETE') {
      const controller = Container.getInstance().get<UserController>(
        UserController.name,
      );

      if (!match.params.userId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Invalid user id' }));
      }

      return await controller.remove(req, res, match.params.userId);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Request not found' }));
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Sorry. Something went wrong.' }));
  }
};

export default {
  handler,
};
