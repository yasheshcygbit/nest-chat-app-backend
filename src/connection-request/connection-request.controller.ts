import { Body, Controller, Post } from '@nestjs/common';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { AuthUserDto } from 'src/common/decorators/dto/auth-user.dto';
import { ConnectionRequestService } from './connection-request.service';
import { AcceptConnectionRequestDto } from './dto/accept-connection-request.dto';
import { SendConnectionRequestDto } from './dto/send-connection-request.dto';

@Controller('connection-request')
export class ConnectionRequestController {

  constructor (
    private readonly connectionRequestService: ConnectionRequestService
  ) {}
  
  @Post('sendConnectionRequest')
  async sendConnectionRequest(@AuthUser() user: AuthUserDto,  @Body() sendConnectionRequestDto: SendConnectionRequestDto) {
    this.connectionRequestService.sendConnectionRequest(user, sendConnectionRequestDto);
  }

  @Post('acceptConnectionRequest')
  async acceptConnectionRequest(@Body() acceptConnectionRequestDto: AcceptConnectionRequestDto) {
    this.connectionRequestService.acceptConnectionRequest(acceptConnectionRequestDto);
  }
}
