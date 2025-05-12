import { randomUUID } from 'node:crypto';

import { Repository } from '../contracts/Repository';
import { User } from '../models/User';

const users: User[] = [];

export class UserRepository implements Repository<User> {
  public create(username: string, age: number, hobbies?: string[]): User {
    const user = new User(randomUUID().toString(), username, age, hobbies);

    users.push(user);

    return user;
  }
}
