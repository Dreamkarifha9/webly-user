import { IResponse } from '../../shared';

import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UsersDto implements IResponse<UserDto[]> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  error: string[];

  @ApiProperty({ type: [UserDto] })
  data: UserDto[];

  @ApiProperty()
  currentPage?: number;

  @ApiProperty()
  perPage?: number;

  @ApiProperty()
  totalPage?: number;

  @ApiProperty()
  total?: number;
}
