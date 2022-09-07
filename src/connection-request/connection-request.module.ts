import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'src/connection/connection.entity';
import { ConnectionRequestController } from './connection-request.controller';
import { ConnectionRequest } from './connection-request.entity';
import { ConnectionRequestService } from './connection-request.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Connection, ConnectionRequest]),
  ],
  controllers: [ConnectionRequestController],
  providers: [ConnectionRequestService]
})
export class ConnectionRequestModule {}
