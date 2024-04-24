import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { HashService } from 'src/common/hash.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { TUser } from 'src/common/types';
import { Wish } from 'src/wishes/entities/wishes.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUsername = await this.userRepository.findOne({
      where: {
        username: createUserDto.username,
      },
    });
    const existEmail = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existUsername || existEmail) {
      throw new BadRequestException(
        'Пользователь с указанными данными уже зарегистрирован',
      );
    }

    const { password, ...user } = await this.userRepository.save({
      username: createUserDto.username,
      about: createUserDto.about,
      avatar: createUserDto.avatar,
      email: createUserDto.email,
      password: this.hashService.getHash(createUserDto.password),
    });
    return user;
  }

  async findOne(id: number): Promise<TUser> {
    const { password, ...user } = await this.userRepository.findOne({
      where: { id },
    });
    return user;
  }

  async findByUsername(username: string): Promise<TUser> {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
    if (!user) {
      throw new BadRequestException('Такой пользователь не найден');
    }
    return user;
  }

  async updateProfileDate(id: number, userDTO: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (userDTO.username && userDTO.username !== user.username) {
      const usernameExist = await this.findByUsername(userDTO.username);
      if (usernameExist) {
        throw new BadRequestException('Такое имя пользователя уже существует');
      }
    }

    if (userDTO.email && userDTO.email !== user.email) {
      const userEmailExist = await this.userRepository.findOne({
        where: {
          email: userDTO.email,
        },
      });
      if (userEmailExist) {
        throw new BadRequestException('Такой email уже зарегистрирован');
      }
    }
    if (userDTO.password) {
      userDTO.password = this.hashService.getHash(userDTO.password);
    }

    await this.userRepository.update(id, userDTO);
    return this.findOne(id);
  }

  async getUserWishes(userId: number): Promise<Wish[]> {
    const user = await this.findOne(userId);

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }
    const { wishes } = await this.userRepository.findOne({
      where: { id: userId },
      select: ['wishes'],
      relations: ['wishes', 'wishes.owner', 'wishes.offers'],
    });

    return wishes;
  }

  async getWishes(username: string): Promise<Wish[]> {
    await this.findByUsername(username);
    const { wishes } = await this.userRepository.findOne({
      where: { username },
      select: ['wishes'],
      relations: ['wishes', 'wishes.owner', 'wishes.offers'],
    });
    return wishes;
  }

  async findUser(findUser): Promise<TUser[]> {
    return await this.userRepository.find({
      where: { username: findUser },
    });
  }
}
