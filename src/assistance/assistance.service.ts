import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAssistanceDto } from './dto/create-assistance.dto';
import { UpdateAssistanceDto } from './dto/update-assistance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Assistance } from './entities/assistance.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/utils/enum/role.enum';
import { BASE_URL } from 'src/core/constant/constant';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AssistanceService {
  constructor(
    @InjectRepository(Assistance) private readonly assistanceRepo: Repository<Assistance>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ){}
  async create(createAssistanceDto: CreateAssistanceDto, user: any) {
    // return createAssistanceDto;
    try {
      let checkAllready = await this.assistanceRepo.createQueryBuilder('assistance').where('assistance.category = :category',{category: createAssistanceDto.category}).andWhere('assistance.user = :user',{user: user.id}).getOne();
      // return checkAllready;
      if(checkAllready != null){
       throw new HttpException("You have already applied for this service", HttpStatus.BAD_REQUEST);
      }
      await this.userRepo.createQueryBuilder('user').update(User).set({role : Role.WORKER}).where("id = :id", { id: user.id }).execute();
      let nAssistance = await this.assistanceRepo.create({
        ...createAssistanceDto,user: user.id
      },);
      return await this.assistanceRepo.save(nAssistance);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(user: any, query : any) {
    try {
      const { active, page, pageSize } = query;
      const pageNumber = parseInt(page, 10) || 1;
      const size = parseInt(pageSize, 10) || 10; // Default page size is 10

      let queryBuilder = this.assistanceRepo.createQueryBuilder('assistance')
          .leftJoinAndSelect('assistance.category', 'category');

      if (user.role === Role.ADMIN) {
          queryBuilder.leftJoinAndSelect('assistance.user', 'user');
      } else {
          queryBuilder.where('assistance.user = :userId', { userId: user.id });
      }

      if (active !== undefined) {
          queryBuilder = queryBuilder.andWhere('assistance.active = :active', { active });
      }

      // Calculate offset based on page number and page size
      const offset = (pageNumber - 1) * size;

      queryBuilder.skip(offset).take(size);

      const assistances = await queryBuilder.getMany();

      let updateAssistance = assistances.map((element) => {
          element.category['imagePath'] = `${process.env.BASE_URL}${element.category['imagePath']}`;
          return element;
      });

      return {"assistance": updateAssistance,pageNumber,pageSize : size};
  } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }
  }


  async myAssistance(user: any, query: any) {
    try {
        const { active, page, pageSize } = query;
        const pageNumber = parseInt(page, 10) || 1;
        const size = parseInt(pageSize, 10) || 10; // Default page size is 10

        let queryBuilder = this.assistanceRepo.createQueryBuilder('assistance')
            .leftJoinAndSelect('assistance.category', 'category');

        if (user.role === Role.ADMIN) {
            queryBuilder.leftJoinAndSelect('assistance.user', 'user');
        } else {
            queryBuilder.where('assistance.user = :userId', { userId: user.id });
        }

        if (active !== undefined) {
            queryBuilder = queryBuilder.andWhere('assistance.active = :active', { active });
        }

        // Calculate offset based on page number and page size
        const offset = (pageNumber - 1) * size;

        queryBuilder.skip(offset).take(size);

        const assistances = await queryBuilder.getMany();

        let updateAssistance = assistances.map((element) => {
            element.category['imagePath'] = `${process.env.BASE_URL}${element.category['imagePath']}`;
            return element;
        });

        return {"assistance": updateAssistance,pageNumber,pageSize : size};
    } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
}
  findOne(id: number) {
    return `This action returns a #${id} assistance`;
  }

 async activeInactive(id: string, updateAssistanceDto: any) {
    try {
      let updateAssistance = await this.assistanceRepo.createQueryBuilder('assistance').update(Assistance).set({...updateAssistanceDto}).where('id = :id', { id: id }).execute();
      return;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    } 
  }

  async approve(id: string, updateAssistanceDto: any) {
    try {
      let updateAssistance = await this.assistanceRepo.createQueryBuilder('assistance').update(Assistance).set({approved: true}).where('id = :id', { id: id }).execute();
      return;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    } 
  }

  remove(id: number) {
    return `This action removes a #${id} assistance`;
  }
}
