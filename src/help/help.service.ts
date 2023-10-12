import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHelpDto } from './dto/create-help.dto';
import { UpdateHelpDto } from './dto/update-help.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Help } from './entities/help.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HelpService {

  constructor(
    @InjectRepository(Help) private readonly helpRepo: Repository<Help>,
  ){}

  async create(createHelpDto: CreateHelpDto) {
    try {
      let nHelp = await this.helpRepo.create(createHelpDto);
      return await this.helpRepo.save(nHelp);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      let nHelp = await this.helpRepo.createQueryBuilder().getMany();
      return nHelp;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} help`;
  }

  update(id: number, updateHelpDto: UpdateHelpDto) {
    return `This action updates a #${id} help`;
  }

  remove(id: number) {
    return `This action removes a #${id} help`;
  }
}
