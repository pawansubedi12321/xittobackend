import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserDetails } from './entities/userdetails.entity';
import { log } from 'console';
import { BcryptService } from 'src/core/bcryptjs/bcyrpt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserDetails) private readonly userDetailsRepo: Repository<UserDetails>,
    private readonly bcryptService: BcryptService,
  ) { }


  //create user 
  async create(image: Express.Multer.File, createUserDto: CreateUserDto) {
    // return image.path;
    let imagePath: any = null;
    if(image != null){
      imagePath= image.path;
    }
    try {
      let isUserExits = await this.userRepo.createQueryBuilder('user').where('phone = :phone', {
        phone: createUserDto.phone
      }).getOne();
      if (isUserExits != null) {
        throw new HttpException("User already exits", HttpStatus.BAD_REQUEST);
      }
      const hashPassword = await this.bcryptService.hashPassword(
        createUserDto.password,
      );
      const nUserDetails = await this.userDetailsRepo.create(
        {
          district: createUserDto.district,
          gender: createUserDto.gender,
          location: createUserDto.address,
          refer_code: generateUniqueString(),
          profile_url: imagePath
        }
      );
      var userDetails = await this.userDetailsRepo.save({ ...nUserDetails });
      const nUser = await this.userRepo.create(
        {
          ...createUserDto,
          password: hashPassword,
          userDetails: userDetails
          //  userDetails: detailsId,
        }
      );
      let data = await this.userRepo.save({ ...nUser });
      if (createUserDto.invite_code != null) {
        const user = await this.userDetailsRepo
          .createQueryBuilder('user')
          .where('refer_code= :code', {
            code: createUserDto.invite_code,
          }).getOne();
        if (user) {
          await this.userDetailsRepo.createQueryBuilder('user').update(UserDetails).set(
            {
              earnings: (user).earnings + 10,
            }
          ).where("id = :id", { id: (user).id }).execute();
        }
      }
      return {
        ...data,
        userDetails: userDetails,
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  async findOneByPhone(phone: string) {
    try {
      let user = await this.userRepo.createQueryBuilder('user').leftJoinAndSelect('user.userDetails', 'userDetails').where(
        'user.phone= :phone', {phone: phone}
      ).getOne(); 
      if (user != null) {
        return user;
      }
      return null;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      let users = await this.userRepo.createQueryBuilder('user').leftJoinAndSelect('user.userDetails', 'userDetails').getMany(); 
      if (users != null) {
        return users;
      }
      throw new HttpException("User not found", HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  findOne(id: string) {
    try {

    } catch (error) {

    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}


function generateUniqueString(): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}