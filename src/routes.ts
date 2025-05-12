import { IncomingMessage, ServerResponse } from 'node:http';

import { UserController } from './controllers/UserController';
import { Container } from './container';
import { matchPath } from './utils';

const handler = async (
  req: IncomingMessage,
  res: ServerResponse,
): Promise<ServerResponse> => {
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

  res.writeHead(404, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify({ error: 'Request not found' }));
};

export default {
  handler,
};
