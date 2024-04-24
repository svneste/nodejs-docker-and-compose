import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsUrl,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Имя пользователя', example: 'Sergey' })
  @IsString()
  @Length(2, 30)
  username: string;

  @ApiProperty({ description: 'E-mail', example: 'user@ya.ru' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Пароль пользователя' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  @Length(2, 200)
  about: string;

  @IsUrl()
  @IsOptional()
  avatar: string;
}
