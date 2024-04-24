import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OffersService } from './offers.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Offer } from './entities/offers.entity';

@ApiTags('offers')
@Controller('offers')
export class OffersController {
  constructor(private offerService: OffersService) {}

  @UseGuards(JwtGuard)
  @Post()
  addOffer(@Body() offer, @Req() { user }): Promise<Offer> {
    return this.offerService.addOffer(offer, user.sub);
  }

  @UseGuards(JwtGuard)
  @Get()
  getAllOffers(): Promise<Offer[]> {
    return this.offerService.findAllOffers();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getOneOffer(@Param('id') id: number): Promise<Offer> {
    return this.offerService.findOneOffer(id);
  }
}
