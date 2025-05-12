import { randomUUID } from 'node:crypto';

import { Repository } from '../contracts/Repository';
import { User } from '../models/User';

let users: Record<string, User> = {};

export const resetUsers = () => {
  users = {};
};

export class UserRepository implements Repository<User> {
  public all(): User[] {
    return Object.values(users);
  }

  public create(username: string, age: number, hobbies?: string[]): User {
    const user = new User(randomUUID().toString(), username, age, hobbies);

    users[user.id] = user;

    return user;
  }

  public find(id: string): User | undefined {
    return users[id];
  }

  public update(
    user: User,
    username: string,
    age: number,
    hobbies?: string[],
  ): User {
    user.username = username;
    user.age = age;
    user.hobbies = hobbies;

    users[user.id] = user;

    return user;
  }

  public remove(user: User): boolean {
    if (users[user.id]) {
      delete users[user.id];
      return true;
    }
    return false;
  }
}
