export interface Repository<T> {
  all(): T[];
  create(username: string, age: number, hobbies?: string[]): T;
  find(id: string): T|undefined;
}
