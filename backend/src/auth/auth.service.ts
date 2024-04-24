import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/common/hash.service';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/signup.dto';
import { TToken, TUser } from 'src/common/types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private hashService: HashService,
  ) {}

  signup(user: SignUpDto): Promise<TUser> {
    return this.userService.create(user);
  }

  async signin(user: TUser): Promise<TToken> {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string): Promise<User> {
    const user: any = await this.userService.findByUsername(username);

    if (user && this.hashService.compare(password, user.password)) {
      const { password, ...result } = user;

      return user;
    }
    return null;
  }
}
