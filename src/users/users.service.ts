import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllDetailsOfUserDto } from './dto/get-all-details-of-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  async getAllDetailsOfUser(getAllDetailsOfUserDto: GetAllDetailsOfUserDto) {
    // find the details of user
    console.log('[ERROR getAllDetailsOfUserDto]', getAllDetailsOfUserDto);
    try {
      const respFind = await this.userRepo.findOne({
        where: [{ 
          id: getAllDetailsOfUserDto.id 
        }],
        relations: [
          'connectionRequestsSent',
          'connectionRequestsReceived',
          'fromUserConnections',
          'toUserConnections',
          'userChannels'
        ]
      });
      // const respFind = await this.userRepo.createQueryBuilder('user')
      // .select('user')
      // .where('user.id = :id', { id: getAllDetailsOfUserDto.id })
      // .innerJoinAndSelect('user.connectionRequestsSent', 'connectionRequestsSent')
      // .innerJoinAndSelect('connectionRequestsSent.sender', 'connectionRequestsSentUser')
      // .getOne()
      console.log('[ERROR respFind]', respFind);
      if (respFind) {
        return respFind;
      } else {
        throw 'NO_USER_DETAILS';
      }
    } catch (error) {
      console.log('[ERROR error]', error);
      if (error === 'NO_USER_DETAILS') {
        throw new HttpException('Connection request doesnt exists', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Internal server errors', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
