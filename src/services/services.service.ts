import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateServiceDto} from './dto/create-service.dto';
import {UpdateServiceDto} from './dto/update-service.dto';
import {Service} from "./entities/service.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class ServicesService {
  constructor(
      @InjectRepository(Service)
      private readonly model: Repository<Service>,


  ) {}
 async create(createServiceDto: CreateServiceDto) {

    try{
        const unique:any = await this.checkUnique(createServiceDto?.title);
        if(unique) {
            throw  new HttpException("Service should be unique",HttpStatus.CONFLICT)
        } else  {
              await  this.model.createQueryBuilder().insert().into(Service).values(createServiceDto).execute()

        }

    }catch (e:any) {
      throw  new HttpException(e?.message,HttpStatus.CONFLICT)
    }
  }

 async findAll() {
    try {
        return  await this.model.createQueryBuilder('service').where('service.status =:status', { status: true }).getMany()
    } catch (e) {
        console.log(e)
        throw  new HttpException("Something went wrong",HttpStatus.BAD_REQUEST)

    }
  }

 async findOne(id: string) {
      try {
          const response:any =   await this.model.createQueryBuilder('service').where('service.id =:id', { id: id }).getOne();
          if(!response?.status){
              throw  new HttpException("Service is inactive",HttpStatus.BAD_REQUEST)

          }else {
              return response
          }
      } catch (e) {
          console.log(e)
          throw  new HttpException(e,HttpStatus.BAD_REQUEST)

      }
  }

    async updateStatus(id: string, data: any) {
        try {
            const res = await this.model
                .createQueryBuilder('service')
                .update(Service)
                .set({
                    status: data?.status,
                })
                .where('service.id =:id', { id: id })
                .execute();
            return;
        } catch (e) {
            throw new HttpException(
                'Cannot update service status',
                HttpStatus.FORBIDDEN,
            );
        }
    }

    async updateService(id: string, data: any) {
        try {
            const res = await this.model
                .createQueryBuilder('service')
                .update(Service)
                .set({
                    title: data?.title,
                })
                .where('service.id =:id', { id: id })
                .execute();
            return;
        } catch (e) {
            throw new HttpException(
                'Cannot update service ',
                HttpStatus.FORBIDDEN,
            );
        }
    }

  remove(id: number) {
    return `This action removes a #${id} service`;
  }


  async checkUnique(title:string) {
      try {
         const res =  await this.model
              .createQueryBuilder('service')
              .where('service.title =:title', {title:title}).getOne();

      }
      catch (e) {
          throw new HttpException("Service should be unique", HttpStatus.BAD_REQUEST)
      }


  }
}
