import { IncomingMessage, ServerResponse } from 'node:http';

import { UserService } from '../services/UserService';
import { parseRequestBody } from '../utils';
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
      return response.end(JSON.stringify({ error: 'Please provide username and age'}));
    }

    const user: User = this.service.create(username, age, hobbies);

    response.writeHead(200, { 'Content-Type': 'application/json' });
    return response.end(JSON.stringify(user));
  }
}
