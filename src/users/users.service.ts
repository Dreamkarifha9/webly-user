import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { UserResponseDto } from './dto/user-response.dto';
@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  /**
   * Inserts a new User into the database.
   */
  async insert(createUser: CreateUserDto) {
    const existsUser = await this.findOneBySearch({
      username: createUser.username,
    });
    this.logger.debug(`existsUser :: ${JSON.stringify(existsUser)}`);
    if (existsUser) {
      throw new RpcException({
        message: 'username has been used.',
        status: HttpStatus.CONFLICT,
      });
    }

    const user: User = {
      id: uuid(),
      ...createUser,
      deleted: false,
    };

    const newUser = this.userRepository.create(user);
    await this.userRepository.save(newUser);
    const { password, salt, ...other } = newUser;
    return other;
  }

  async findOneBySearch(q: Partial<UserDto>) {
    return this.userRepository.findOneBy({ ...q });
  }

  async validatePassword(username: string, plainPassword: string) {
    username = username.toLowerCase();
    this.logger.debug(`username display ${JSON.stringify(username)}`);
    this.logger.debug(`plainPassword display ${JSON.stringify(plainPassword)}`);

    const user = await this.userRepository
      .createQueryBuilder('users')
      .addSelect(['users.*', 'users.password'])
      .where('users.username = :username', { username })
      .andWhere('users.active = :active', { active: true })
      .andWhere('users.deleted = :deleted', { deleted: false })
      .getOne();
    this.logger.debug(`user display ${JSON.stringify(user)}`);
    if (!user) return user;
    const { password, ...others } = user;
    if (await bcrypt.compareSync(plainPassword, password))
      return others as User;
  }

  /**
   * Returns a user by given id
   */
  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .select([
        'users.id',
        'users.username',
        'users.firstName',
        'users.lastName',
        'users.email',
      ])
      .where('users.id = :id', { id })
      .getOne();
    return user;
  }
}
