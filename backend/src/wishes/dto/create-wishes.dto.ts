import { IsNumber, IsString, IsUrl, Length, IsPositive } from 'class-validator';

export class CreateWishesDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  price: number;

  @IsString()
  @Length(1, 1024)
  description: string;
}
