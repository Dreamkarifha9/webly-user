import { UserDto } from './user.dto';
import { PickType } from '@nestjs/swagger';
export class UserResponseDto extends PickType(UserDto, [
  'id',
  'email',
  'firstName',
  'lastName',
]) { }
