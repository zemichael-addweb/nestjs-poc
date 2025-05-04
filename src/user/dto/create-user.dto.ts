export class CreateUserDto {
  username: string;
  password?: string; // Password will be handled by auth service during registration
}
