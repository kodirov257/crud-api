export class User {
  public id: string;
  public username: string;
  public age: number;
  public hobbies?: string[];

  constructor(id: string, username: string, age: number, hobbies?: string[]) {
    this.id = id;
    this.username = username;
    this.age = age;
    this.hobbies = hobbies || [];
  }
}
