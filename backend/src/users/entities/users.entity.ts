import {
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Wish } from '../../wishes/entities/wishes.entity';
import { Offer } from '../../offers/entities/offers.entity';
import { Wishlist } from '../../wishlists/entity/wishlists.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

@Entity()
export class User {
  @ApiProperty({ description: 'ID пользователя', example: 5 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Время создания' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Время обновления' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Имя пользователя', example: 'Sergey' })
  @IsString()
  @Length(2, 30)
  @Column({
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    length: 200,
    default: 'Пока ничего не рассказал о себе',
  })
  about: string;

  @Column({
    default: 'https://i.pravatar.cc/300',
  })
  avatar: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
