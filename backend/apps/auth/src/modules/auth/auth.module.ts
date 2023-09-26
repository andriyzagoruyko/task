import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@app/shared/config/config.service';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        signOptions: { expiresIn: '10000s' },
        ...configService.jwt,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
