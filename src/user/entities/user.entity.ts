export class User {
  id: number;
  username: string;
  password?: string; // Avoid exposing password hash by default
}
