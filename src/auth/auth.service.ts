import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from 'src/core/bcryptjs/bcyrpt.service';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { BASE_URL } from 'src/core/constant/constant';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private bcryptService: BcryptService,
    private usersService: UsersService,
  ){}


  async login(loginDto : LoginDto){

    let user = await this.usersService.findOneByPhone(
      loginDto.phone,
    );
    if(user !=null){
      let comparePassword = await this.bcryptService.comparePassword(
        loginDto.password,
        user.password,
      );

      if (comparePassword) {
        const payload = {
          id: user.id,
          phone: user.phone ?? null,
          role: user.role,
        };
        const accessToken = await this.jwtService.signAsync(payload);
        if(user.userDetails.profile_url !=null){
          user.userDetails.profile_url = `${BASE_URL}${user.userDetails.profile_url}`
        }
        return {
          ...payload,
          phone: user.phone,
          accessToken,
          name: user.name,
          userDetails: user.userDetails,
        };
      } else {
        throw new HttpException('Please enter a valid password', HttpStatus.BAD_REQUEST);
      }
    }
    throw new HttpException('Please enter a valid phone number', HttpStatus.BAD_REQUEST);
  }
  
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
