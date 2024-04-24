import {
  IsString,
  IsUrl,
  Length,
  IsArray,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsOptional()
  @IsString()
  @Length(1, 1500)
  description: string;

  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: number[];

  @IsString()
  @IsUrl()
  image: string;
}
