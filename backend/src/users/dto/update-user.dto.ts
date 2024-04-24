import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'Имя пользователя', example: 'Sergey' })
  @IsString()
  @IsOptional()
  @Length(2, 30)
  username: string;

  @ApiProperty({ description: 'E-mail', example: 'user@ya.ru' })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Пароль пользователя' })
  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  @Length(2, 200)
  about: string;

  @IsUrl()
  @IsOptional()
  avatar: string;
}
