import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offers.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  async addOffer(offer, userId): Promise<Offer> {
    const user = await this.usersService.findOne(userId);
    const wish = await this.wishesService.findOne(offer.itemId);
    const donations = Number(wish.raised) + offer.amount;

    if (user.id === wish.owner.id) {
      throw new BadRequestException('Вы не можете скидываться за свой подарок');
    }

    if (donations > wish.price) {
      throw new BadRequestException(
        'Сумма доната не может быть выше стоимости подарка',
      );
    }

    await this.wishesService.updateWish(
      offer.itemId,
      { raised: donations },
      userId,
    );

    return this.offerRepository.save({ ...offer, user, item: wish });
  }

  async findAllOffers(): Promise<Offer[]> {
    const offers = await this.offerRepository.find({
      relations: ['user', 'item'],
    });

    offers.forEach((offer) => delete offer.user.password);
    return offers;
  }

  async findOneOffer(id): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { id },
    });
    return offer;
  }
}
