import { Body, ClassSerializerInterceptor, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { GetAllDetailsOfUserDto } from './dto/get-all-details-of-user.dto';
import { UsersService } from './users.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {

  constructor (
    private readonly userService: UsersService
  ) {}

  @Post('getAllDetailsOfUser')
  async getAllDetailsOfUser(@Body() getAllDetailsOfUserDto: GetAllDetailsOfUserDto) {
    return await this.userService.getAllDetailsOfUser(getAllDetailsOfUserDto);
  }
}
