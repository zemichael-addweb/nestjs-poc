import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  // For demonstration, using an in-memory array
  // Replace with database interaction in a real application
  private readonly users: User[] = [];
  private nextId = 1;

  findOne(username: string): User | undefined {
    return this.users.find((user) => user.username === username);
  }

  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: this.nextId++,
      username: createUserDto.username,
      password: createUserDto.password, // Password will be hashed by AuthService
    };
    this.users.push(newUser);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = newUser; // Don't return password hash
    return result as User;
  }
}
