import { randomUUID } from 'node:crypto';

import { Repository } from '../contracts/Repository';
import { User } from '../models/User';

const users: User[] = [];

export class UserRepository implements Repository<User> {
  public all(): User[] {
    return users;
  }

  public create(username: string, age: number, hobbies?: string[]): User {
    const user = new User(randomUUID().toString(), username, age, hobbies);

    users.push(user);

    return user;
  }
  
  public find(id: string): User|undefined {
    for (const user of users) {
      if (user.id === id) {
        return user;
      }
    }
    return undefined;
  }
}
