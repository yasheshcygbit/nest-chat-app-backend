import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/channels/channel.entity';
import { AuthUserDto } from 'src/common/decorators/dto/auth-user.dto';
import { Connection } from 'src/connection/connection.entity';
import { UserChannel } from 'src/user-channel/user-channel.entity';
import { Repository } from 'typeorm';
import { ConnectionRequest } from './connection-request.entity';
import { AcceptConnectionRequestDto } from './dto/accept-connection-request.dto';
import { SendConnectionRequestDto } from './dto/send-connection-request.dto';

@Injectable()
export class ConnectionRequestService {
  constructor (
    @InjectRepository(ConnectionRequest)
    private connectionRequestRepo: Repository<ConnectionRequest>,
    @InjectRepository(Connection)
    private connectionRepo: Repository<Connection>,

    @InjectRepository(Channel)
    private channelRepo: Repository<Channel>,

    @InjectRepository(UserChannel)
    private userChannelRepo: Repository<UserChannel>,
  ) {}

  async sendConnectionRequest(user: AuthUserDto, sendConnectionRequestDto: SendConnectionRequestDto) {
    console.log('[REQUEST user]', user);
    console.log('[REQUEST sendConnectionRequestDto]', sendConnectionRequestDto);
    try {
      // first check if the connection exists of this nature exists or not
      const respFind = await this.checkIfConnectionRequestExists(user.id, sendConnectionRequestDto.userId);
      console.log('[REQUEST respFind]', respFind);
      if (respFind) {
        // already in connection so throw error;
        throw 'ALREADY_EXISTS'
      } else {
        const respCreate = this.connectionRequestRepo.create({
          senderId: user.id,
          receiverId: sendConnectionRequestDto.userId,
        });
        return await this.connectionRequestRepo.save(respCreate);
      }      
    } catch (error) {
      console.log('[REQUEST error]', error);
      if (error === 'ALREADY_EXISTS') {
        throw new HttpException('Connection request already exists between these two users', HttpStatus.BAD_REQUEST);
      }
    }
  }

  async acceptConnectionRequest(acceptConnectionRequestDto: AcceptConnectionRequestDto) {
    try {
      // first check if the connection exists of this nature exists or not
      const respFind = await this.connectionRequestRepo.findOne({
        where: [
          {
            id: acceptConnectionRequestDto.id,
          },
        ],
        relations: ['sender', 'receiver']
      })
      if (respFind) {
        respFind.isAccepted = true;
        await this.connectionRequestRepo.save(respFind);
        // now create a Connection too
        const isConnectionAlreadyEstablished = await this.checkIfConnectionExists(respFind.senderId, respFind.receiverId);
        if (!isConnectionAlreadyEstablished) {
          const respCreate = this.connectionRepo.create({
            fromUserId: respFind.senderId,
            toUserId: respFind.receiverId,
          })
          const respConnectionCreate = await this.connectionRepo.save(respCreate);
          console.log('[CREATE_CHANNEL respConnectionCreate]', respConnectionCreate);
        }

        // now create channel and also add this channel and user in userchannel table

        const respChannelCreate = this.channelRepo.create({
          name: `Channel Between Sender ${respFind.sender.email} and Receiver ${respFind.receiver.email}`
        });
        const respChannelSave = await this.channelRepo.save(respChannelCreate);
        console.log('[CREATE_CHANNEL respChannelSave]', respChannelSave);

        // now create user channel
        const respUserChannelCreateFirst = this.userChannelRepo.create({
          channel: respChannelCreate,
          userId: respFind.sender.id
        })
        const respUserChannelSaveFirst = await this.userChannelRepo.save(respUserChannelCreateFirst);
        console.log('[CREATE_CHANNEL respUserChannelSaveFirst]', respUserChannelSaveFirst);
        
        const respUserChannelCreateSecond = this.userChannelRepo.create({
          channel: respChannelCreate,
          userId: respFind.receiver.id
        })
        const respUserChannelSaveSecond = await this.userChannelRepo.save(respUserChannelCreateSecond);
        console.log('[CREATE_CHANNEL respUserChannelSaveSecond]', respUserChannelSaveSecond);
      } else {
        throw 'REQUEST_DOESNT_EXISTS';
      }      
    } catch (error) {
      if (error === 'REQUEST_DOESNT_EXISTS') {
        throw new HttpException('Connection request doesnt exists', HttpStatus.BAD_REQUEST);
      }
    }
  }

  async checkIfConnectionRequestExists(userId: number, otherUserId: number) {
    const respFind = await this.connectionRequestRepo.findOne({
      where: [
        {
          senderId: userId,
          receiverId: otherUserId
        },
        {
          receiverId: userId,
          senderId: otherUserId
        },
      ]
    })
    if (respFind) {
      return true;
    } else {
      return false;
    }
  }

  async checkIfConnectionExists(userId: number, otherUserId: number) {
    const respFind = await this.connectionRepo.findOne({
      where: [
        {
          fromUserId: userId,
          toUserId: otherUserId,
        },
        {
          toUserId: userId,
          fromUserId: otherUserId,
        },
      ]
    })
    if (respFind) {
      return respFind;
    } else {
      return false;
    }
  }
}
