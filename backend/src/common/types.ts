import { User } from 'src/users/entities/users.entity';

export type TUser = Omit<User, 'password'>;

export type TToken = { access_token: string };
