import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'src/channels/channel.entity';
import { Connection } from 'src/connection/connection.entity';
import { UserChannel } from 'src/user-channel/user-channel.entity';
import { ConnectionRequestController } from './connection-request.controller';
import { ConnectionRequest } from './connection-request.entity';
import { ConnectionRequestService } from './connection-request.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Connection, ConnectionRequest, Channel, UserChannel]),
  ],
  controllers: [ConnectionRequestController],
  providers: [ConnectionRequestService]
})
export class ConnectionRequestModule {}
