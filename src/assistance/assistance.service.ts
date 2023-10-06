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

  async findAll(user: any) {
   try {
    if(user.role == Role.ADMIN){
      let assistances = await this.assistanceRepo.createQueryBuilder('assistance').leftJoinAndSelect('assistance.category','category').getMany(); 
      let updateAssistance = assistances.map((element)=>{
        element.category['imagePath'] = `${BASE_URL}${element.category['imagePath']}`;
        return element;
      });
      return updateAssistance;
    }else{
      let assistance = await this.assistanceRepo.createQueryBuilder('assistance').leftJoinAndSelect('assistance.category','category').where('assistance.user = :user',{user: user.id}).getMany();
      // return assistance;
      let updateAssistance = assistance.map((element)=>{
        element.category['imagePath'] = `${BASE_URL}${element.category['imagePath']}`;
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

  update(id: number, updateAssistanceDto: UpdateAssistanceDto) {
    return `This action updates a #${id} assistance`;
  }

  remove(id: number) {
    return `This action removes a #${id} assistance`;
  }
}
