import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entity/wishlists.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  async getAllWishlists(): Promise<Wishlist[]> {
    return this.wishlistsRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async createWishlist(body, userId): Promise<Wishlist> {
    const user = await this.usersService.findOne(userId);
    const wishes = await this.wishesService.findAllWishes(body.itemsId);

    return this.wishlistsRepository.save({
      ...body,
      owner: user,
      items: wishes,
    });
  }

  async getWishlistById(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new BadRequestException('Список не найден');
    }

    return wishlist;
  }

  async updateWishlist(wishlistId, body, userId): Promise<Wishlist> {
    const wishlist = await this.getWishlistById(wishlistId);

    if (wishlist.owner.id !== userId) {
      throw new BadRequestException('Данный список вам не принадлежит');
    }

    if (body.itemsId) {
      const { itemsId, ...newData } = body;
      const wishes = await this.wishesService.findAllWishes(itemsId);
      wishlist.items.push(...wishes);
      await this.wishlistsRepository.save(wishlist);
      await this.wishlistsRepository.update(wishlistId, newData);
    } else {
      await this.wishlistsRepository.update(wishlistId, body);
    }

    return wishlist;
  }

  async removeWishlist(id, userId): Promise<Wishlist> {
    const wishlist = await this.getWishlistById(id);

    if (wishlist.owner.id !== userId) {
      throw new BadRequestException('Данный лист вам не принадлежит');
    }

    await this.wishlistsRepository.delete(id);
    return wishlist;
  }
}
