import {
  Controller,
  Get,
  Query,
  Body,
  Param,
  HttpCode,
  Req,
  HttpStatus,
  Res,
  Delete,
  Post,
  Put,
  Logger,
  UseGuards,
} from '@nestjs/common';

import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';
import { MessagePattern } from '@nestjs/microservices';
import { AuthGuard } from 'src/guards/auth.guard';
import { RequestWithUser } from 'src/shared/interfaces/request-with-user.interface';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  private readonly logger: Logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) { }
  @MessagePattern('register')
  async handleRegister(data: CreateUserDto) {
    this.logger.debug(`display data ${JSON.stringify(data)}`);
    return this.usersService.insert(data);
  }

  @MessagePattern('validate')
  async handleValidatePassword(data: any) {
    this.logger.debug(`display data ${data}`);

    return this.usersService.validatePassword(data.username, data.password);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me')
  @ApiCreatedResponse({
    type: UserResponseDto,
  })
  findUser(@Req() request: RequestWithUser) {
    this.logger.debug(`request.user ${JSON.stringify(request.user)}`);
    const { id } = request.user;
    return this.usersService.findById(id);
  }
}
