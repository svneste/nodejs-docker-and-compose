import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wishes.entity';
import { In, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateWishesDto } from './dto/create-wishes.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private userService: UsersService,
  ) {}

  async createWish(id: number, createWish: CreateWishesDto): Promise<Wish> {
    const user = await this.userService.findOne(id);

    return this.wishRepository.save({
      ...createWish,
      owner: user,
    });
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
    });

    if (!wish) {
      throw new BadRequestException('Подарок не найден');
    }

    return wish;
  }

  async updateWish(id: number, wishDTO, userId): Promise<Wish> {
    const wish = await this.findOne(id);

    if (wishDTO.price && wish.offers.length > 0) {
      throw new BadRequestException(
        'Нельзя изменить стоимость, уже есть скинувшиеся',
      );
    }
    if (wish.owner.id !== userId) {
      throw new BadRequestException('Вы не можете редактировать чужие подарки');
    }

    await this.wishRepository.update(id, wishDTO);

    return this.findOne(id);
  }

  async deleteWish(user, id: number): Promise<Wish> {
    const wish = await this.findOne(id);

    if (user && user.sub !== wish.owner.id) {
      throw new BadRequestException('Не найдено');
    }

    if (wish.offers.length > 0) {
      throw new BadRequestException('Вы не можете удалить данный подарок');
    }

    await this.wishRepository.delete(id);

    return wish;
  }

  async copyWish(user, wishId: number): Promise<Wish> {
    const { id, createdAt, updatedAt, copied, raised, offers, ...dataWish } =
      await this.findOne(wishId);

    const owner = await this.userService.findOne(user.sub);

    await this.wishRepository.update(id, { copied: copied + 1 });

    return this.wishRepository.save({
      ...dataWish,
      owner,
    });
  }

  async findAllWishes(wishId) {
    return this.wishRepository.find({
      where: {
        id: In(wishId),
      },
    });
  }

  async findLast(): Promise<Wish[]> {
    return this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: ['owner', 'offers'],
    });
  }

  async findTop(): Promise<Wish[]> {
    return this.wishRepository.find({
      order: { copied: 'DESC' },
      take: 20,
      relations: ['owner', 'offers'],
    });
  }
}
