import {
  Body,
  Req,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UpdateWishesDto } from './dto/update-wishes.dto';
import { Wish } from './entities/wishes.entity';
import { CreateWishesDto } from './dto/create-wishes.dto';

@Controller('wishes')
export class WishesController {
  constructor(private wishService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  createWish(
    @Req() { user },
    @Body() createWish: CreateWishesDto,
  ): Promise<Wish> {
    return this.wishService.createWish(user.sub, createWish);
  }

  @Get('last')
  findLast(): Promise<Wish[]> {
    return this.wishService.findLast();
  }

  @Get('top')
  findTop(): Promise<Wish[]> {
    return this.wishService.findTop();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOneWish(@Param('id') id: number) {
    return this.wishService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  updateWish(
    @Param('id') id: number,
    @Body() wishDTO: UpdateWishesDto,
    @Req() { user },
  ): Promise<Wish> {
    return this.wishService.updateWish(id, wishDTO, user.sub);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteWish(@Req() { user }, @Param('id') id: number): Promise<Wish> {
    return this.wishService.deleteWish(user, id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copyWish(@Req() { user }, @Param('id') id: number): Promise<Wish> {
    return this.wishService.copyWish(user, id);
  }
}
