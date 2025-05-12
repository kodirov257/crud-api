import { IncomingMessage, ServerResponse } from 'node:http';

import { UserService } from '../services/UserService';
import { isUUID, parseRequestBody } from '../utils';
import { User } from '../models/User';

export class UserController {
  private service: UserService;

  constructor(service: UserService) {
    this.service = service;
  }

  public list(
    request: IncomingMessage,
    response: ServerResponse,
  ): ServerResponse {
    const users: User[] = this.service.getAll();

    response.writeHead(200, { 'Content-Type': 'application/json' });
    return response.end(JSON.stringify(users));
  }

  public async create(
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<ServerResponse> {
    const { username, age, hobbies } = await parseRequestBody(request);

    if (!username || !age) {
      response.writeHead(400, { 'Content-Type': 'application/json' });
      return response.end(
        JSON.stringify({ error: 'Please provide username and age' }),
      );
    }

    const user: User = this.service.create(username, age, hobbies);

    response.writeHead(201, { 'Content-Type': 'application/json' });
    return response.end(JSON.stringify(user));
  }

  public show(
    request: IncomingMessage,
    response: ServerResponse,
    id: string,
  ): ServerResponse {
    if (!isUUID(id)) {
      response.writeHead(400, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ error: 'Invalid user id' }));
    }

    const user = this.service.find(id);

    if (!user) {
      response.writeHead(404, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ error: 'User not found' }));
    }

    response.writeHead(200, { 'Content-Type': 'application/json' });
    return response.end(JSON.stringify(user));
  }

  public async update(
    request: IncomingMessage,
    response: ServerResponse,
    id: string,
  ): Promise<ServerResponse> {
    if (!isUUID(id)) {
      response.writeHead(400, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ error: 'Invalid user id' }));
    }

    let user = this.service.find(id);

    if (!user) {
      response.writeHead(404, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ error: 'User not found' }));
    }

    const { username, age, hobbies } = await parseRequestBody(request);

    if (!username || !age) {
      response.writeHead(400, { 'Content-Type': 'application/json' });
      return response.end(
        JSON.stringify({ error: 'Please provide username and age' }),
      );
    }

    user = this.service.update(user, username, age, hobbies);

    response.writeHead(200, { 'Content-Type': 'application/json' });
    return response.end(JSON.stringify(user));
  }

  public async remove(
    request: IncomingMessage,
    response: ServerResponse,
    id: string,
  ): Promise<ServerResponse> {
    if (!isUUID(id)) {
      response.writeHead(400, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ error: 'Invalid user id' }));
    }

    const user = this.service.find(id);

    if (!user) {
      response.writeHead(404, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ error: 'User not found' }));
    }

    if (this.service.remove(user)) {
      response.writeHead(204, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify(user));
    }

    response.writeHead(400, { 'Content-Type': 'application/json' });
    return response.end(JSON.stringify({ error: 'User not removed' }));
  }
}
