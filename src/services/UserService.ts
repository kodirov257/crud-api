import { UserRepository } from '../repositories/UserRepository';
import { User } from '../models/User';

export class UserService {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  public create(username: string, age: number, hobbies?: string[]): User {
    return this.repository.create(username, age, hobbies);
  }
}
