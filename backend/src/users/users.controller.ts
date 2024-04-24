import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { TUser } from 'src/common/types';
import { Wish } from 'src/wishes/entities/wishes.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  findOne(@Req() { user }): Promise<TUser> {
    return this.usersService.findOne(user.sub);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  updateProfileDate(
    @Req() { user },
    @Body() userDTO: UpdateUserDto,
  ): Promise<TUser> {
    return this.usersService.updateProfileDate(user.sub, userDTO);
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  getUserWishes(@Req() { user }): Promise<Wish[]> {
    return this.usersService.getUserWishes(user.sub);
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  getUserByUsername(@Param('username') username: string): Promise<TUser> {
    const user = this.usersService.findByUsername(username);

    return user;
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  getWishes(@Param('username') username: string): Promise<Wish[]> {
    return this.usersService.getWishes(username);
  }

  @UseGuards(JwtGuard)
  @Post('find')
  findUser(@Body() findUser): Promise<TUser[]> {
    return this.usersService.findUser(findUser.username);
  }
}
