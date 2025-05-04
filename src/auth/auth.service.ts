import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = this.userService.findOne(username);
    // Ensure user and password exist before comparing
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // No async needed if jwtService.sign is synchronous
  login(user: Omit<User, 'password'>): { access_token: string } {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    console.log('createUserDto', createUserDto);
    // check if createUserDto is an instance of CreateUserDto
    if (!('username' in createUserDto) || !('password' in createUserDto)) {
      throw new BadRequestException(
        'Invalid registration data. Please add username and password.',
      );
    }

    // Check if username already exists
    if (!createUserDto.username) {
      throw new BadRequestException('Username is required for registration');
    }

    // Check if password is provided
    if (!createUserDto.password) {
      throw new BadRequestException('Password is required for registration');
    }

    const existingUser = this.userService.findOne(createUserDto.username);
    if (existingUser) {
      throw new UnauthorizedException('Username already exists');
      // Consider using HttpException with HttpStatus.CONFLICT (409) for better semantics
    }

    if (!createUserDto.password) {
      // Should ideally be caught by validation pipes earlier
      throw new BadRequestException('Password is required for registration');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    const userToCreate: CreateUserDto = {
      username: createUserDto.username,
      password: hashedPassword,
    };

    const createdUser = this.userService.create(userToCreate);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = createdUser; // createdUser already excludes password
    return result;
  }
} 