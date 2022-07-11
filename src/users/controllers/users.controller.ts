import { Controller, Get, Param } from '@nestjs/common';
import { IUser } from 'src/shared/interfaces/users.interfaces';
import { ValidateUserPipe } from 'src/shared/pipes/validateUser.pipe';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id', ValidateUserPipe) id): Promise<IUser> {
    return await this.usersService.findOne({ where: { id } });
  }
}
