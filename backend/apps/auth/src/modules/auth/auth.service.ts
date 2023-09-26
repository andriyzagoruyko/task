import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserInput } from './dto/login-user.input';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@app/shared/config/config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(loginUserInput: LoginUserInput) {
    try {
      const { password, ...user } = await this.userService.findOneByUsername(
        loginUserInput.username,
      );

      if (password !== loginUserInput.password) {
        throw new UnauthorizedException('Incorrect credentials');
      }

      const payload = { sub: user.id, username: user.username };
      const accessToken = await this.jwtService.signAsync(
        payload,
        this.configService.jwt,
      );

      return { accessToken, user };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new UnauthorizedException('Incorrect credentials');
      }
      throw e;
    }
  }
}
