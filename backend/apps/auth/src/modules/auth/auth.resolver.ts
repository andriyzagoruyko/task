import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthService } from './auth.service';
import { LoginUserInput } from './dto/login-user.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponseDto)
  login(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    return this.authService.signIn(loginUserInput);
  }

  @Mutation(() => LoginResponseDto)
  register(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    return this.authService.signIn(loginUserInput);
  }

  @Query(() => String)
  @UseGuards(AuthGuard)
  test() {
    return 'hello';
  }
}
