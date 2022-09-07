import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  generateTokens(payload: any) {
    return {
      user: payload,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload)
    }
  }

  generateAccessToken(payload: any) {
    return {
      accessToken: this.jwtService.sign(payload)
    }
  }

  async login(loginDto: LoginDto) {
    console.log('[AUTH loginDto]', loginDto);
    try {
      const responseFind = await this.userRepository.findOne({
        where: [
          {
            email: loginDto.email
          }
        ]
      })
      console.log('[AUTH process.env.JWT_SECRET]', process.env.JWT_SECRET);
      console.log('[AUTH responseFind]', responseFind);
      if (responseFind && responseFind.password === loginDto.password) {
        // user is authenticated
        return this.generateTokens({...responseFind});
      } else {
        throw 'PASSWORD_DONT_MATCH';
      }
    } catch (error) {
      console.log('[AUTH error]', error);
      if (error === 'PASSWORD_DONT_MATCH') {
        throw new HttpException('Passwords done match', 403);
      }
      throw new HttpException('Internal server errors', 500);
    }
  }

  async register(registerDto: RegisterDto) {
    // first find the user
    try {
      const responseFind = await this.userRepository.findOne({
        where: [
          {
            email: registerDto.email
          }
        ]
      })
      console.log('[RESP_CREATE responseFind]', responseFind);
      if (responseFind) {
        // user is authenticated
        throw 'USER_ALREADY_EXISTS';
      } else {
        // create user
        const responseCreate = this.userRepository.create({ email: registerDto.email, password: registerDto.password })
        const finalResp = await this.userRepository.save(responseCreate);
        console.log('[RESP_CREATE finalResp]', finalResp);
        return this.generateTokens({...finalResp});
      }
    } catch (error) {
      console.log('[RESP_CREATE error]', error);
      // throw error;
      if (error === 'USER_ALREADY_EXISTS') {
        throw new HttpException('User already exists', 403);
      }
      throw new HttpException('Internal server errors', 500);
    }
  }
}
