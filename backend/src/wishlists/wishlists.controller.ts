import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Wishlist } from './entity/wishlists.entity';

@Controller('wishlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Get()
  getAllWishlists(): Promise<Wishlist[]> {
    return this.wishlistsService.getAllWishlists();
  }

  @UseGuards(JwtGuard)
  @Post()
  createWishlist(@Req() { user }, @Body() body): Promise<Wishlist> {
    console.log(body);
    return this.wishlistsService.createWishlist(body, user.sub);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getWishListById(@Param('id') id: number): Promise<Wishlist> {
    return this.wishlistsService.getWishlistById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  updateWishlist(
    @Param('id') id,
    @Req() { user },
    @Body() body,
  ): Promise<Wishlist> {
    return this.wishlistsService.updateWishlist(id, body, user.sub);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  removeWishlist(@Param('id') id, @Req() { user }): Promise<Wishlist> {
    return this.wishlistsService.removeWishlist(id, user.sub);
  }
}
