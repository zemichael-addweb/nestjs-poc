import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../user/entities/user.entity'; // Import User entity for type

// Define an interface for the authenticated request
interface AuthenticatedRequest extends Request {
  user: Omit<User, 'password'>;
}

interface JwtAuthenticatedRequest extends Request {
  user: { userId: number; username: string }; // Matches JwtStrategy payload
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Use LocalAuthGuard to trigger LocalStrategy for validation
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK) // Return 200 OK on successful login
  login(@Request() req: AuthenticatedRequest) { // No async needed, add type
    // If LocalAuthGuard passes, req.user contains the user object from LocalStrategy.validate
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    // TODO: Add validation pipe for createUserDto
    return this.authService.register(createUserDto);
  }

  // Example protected route - can remove later
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req: JwtAuthenticatedRequest) {
    // Add type
    return req.user; // req.user is populated by JwtStrategy.validate
  }
}
