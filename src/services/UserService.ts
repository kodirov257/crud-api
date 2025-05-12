import { UserRepository } from '../repositories/UserRepository';
import { User } from '../models/User';

export class UserService {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  public getAll(): User[] {
    return this.repository.all();
  }

  public create(username: string, age: number, hobbies?: string[]): User {
    return this.repository.create(username, age, hobbies);
  }

  public find(id: string): User|undefined {
    return this.repository.find(id);
  }

  public update(user: User, username: string, age: number, hobbies?: string[]): User {
    return this.repository.update(user, username, age, hobbies);
  }

  public remove (user: User): boolean {
    return this.repository.remove(user);
  }
}
