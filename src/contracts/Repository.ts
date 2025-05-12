export interface Repository<T> {
  create(username: string, age: number, hobbies?: string[]): T;
}
