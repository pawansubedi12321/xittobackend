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

    const {active} = query;
    
    if(user.role == Role.ADMIN){
      let queryBuilder = await this.assistanceRepo.createQueryBuilder('assistance').leftJoinAndSelect('assistance.category','category').leftJoinAndSelect('assistance.user','user'); 
      if(active != null){
        queryBuilder = queryBuilder.where('assistance.active = :active', { active : active })
      }
      const assistances= await queryBuilder.getMany();
      let updateAssistance = assistances.map((element)=>{
        element.category['imagePath'] = `${process.env.BASE_URL}${element.category['imagePath']}`;
        return element;
      });
      return updateAssistance;
    }else{

      let queryBuilder = await this.assistanceRepo.createQueryBuilder('assistance').leftJoinAndSelect('assistance.category','category').where('assistance.user = :user',{user: user.id});
      // return assistance;
      if(active != null){
        queryBuilder = queryBuilder.andWhere('assistance.active = :active', { active : active });
      }
      let assistance =await queryBuilder.getMany();
      let updateAssistance = assistance.map((element)=>{
        element.category['imagePath'] = `${process.env.BASE_URL}${element.category['imagePath']}`;
        return element;
      });
      return updateAssistance;
    }
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

  remove(id: number) {
    return `This action removes a #${id} assistance`;
  }
}
