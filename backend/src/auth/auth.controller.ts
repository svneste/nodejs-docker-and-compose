import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/users.entity';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LocalGuard } from './guards/local.guard';
import { SignUpDto } from './dto/signup.dto';
import { TToken } from 'src/common/types';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('crash-test')
  crash() {
    setTimeout(() => {
      throw new Error('Сервер сейчас упадёт');
    }, 0);
  }

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Req() req) {
    return this.authService.signin(req.user);
  }

  @ApiCreatedResponse({ description: 'Пользователь создан', type: User })
  @ApiBadRequestResponse({
    description: 'Некорректные данные пользователя',
  })
  @ApiConflictResponse({
    description: 'Пользователь с таким e-mail уже существует',
  })
  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto): Promise<TToken> {
    const user = await this.authService.signup(signUpDto);

    const token = await this.authService.signin(user);

    return token;
  }
}
