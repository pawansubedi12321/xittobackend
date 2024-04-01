import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { BookingDto } from './dto/booking.dto';
import { TransactionService } from 'src/transaction/transaction.service';
import { use } from 'passport';
import { FilterBookingDto } from './dto/filterbooking.dto';
import { log } from 'console';
import { BookingStatus } from 'src/utils/enum/bookingStatus';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking) private readonly bookingRepo: Repository<Booking>,
    private transactionService: TransactionService,
  ) {}
  async create(bookingDto: BookingDto, userId: string) {
    try {
      let bookingDetails = bookingDto.bookingDetails;
      let paymentDetails = bookingDto.paymentDetails;
      let nBooking = await this.bookingRepo.create({...bookingDetails, bookedBy: userId});
      let saveBooking = await this.bookingRepo.save(nBooking);
      // return saveBooking.assignTo;
      let sTransaction  = await this.transactionService.create({...paymentDetails,booking: saveBooking.id});
      return {saveBooking,sTransaction};
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); 
    }
  }

  async findAll(userId : string) {
    try {
      let bookings  = await this.bookingRepo.createQueryBuilder('booking').orderBy('booking.created_at', 'DESC').where('booking.bookedBy = :userId', { userId: userId }).leftJoinAndSelect('booking.assignTo','assignTo').getMany();
      // let bookings  = await this.bookingRepo.find({where: {}});
      return bookings;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);  
    }
  }

  async filterBooking(userId : string, filterDto : FilterBookingDto) {
    // return filterDto.assignTo;
    try {
      let queryBuilder  = await this.bookingRepo.createQueryBuilder('booking')
      .orderBy('booking.created_at', 'DESC')
      .where('booking.bookedBy = :userId', { userId: userId })
      .leftJoinAndSelect('booking.assignTo','assignTo');
      // let bookings  = await this.bookingRepo.find({where: {}});

      if( filterDto.status != null && filterDto.status != ''){  
        queryBuilder.andWhere('booking.status = :status', { status : filterDto.status })
      }

      if( filterDto.location != null && filterDto.location != ''){  
        queryBuilder.andWhere('LOWER(booking.location) ILIKE :location', { location: `%${filterDto.location.toLowerCase()}%` })
      }

      if( filterDto.itemCount != null && filterDto.itemCount != ''){  
        queryBuilder.andWhere('booking.itemCount = :itemCount', { itemCount : filterDto.itemCount })
      }

      if( filterDto.timePeriod != null && filterDto.timePeriod != ''){  
        queryBuilder.andWhere('LOWER(booking.timePeriod) ILIKE :timePeriod', { timePeriod: `%${filterDto.timePeriod.toLowerCase()}%` })
      }

      if( filterDto.problemInterval != null && filterDto.problemInterval != ''){  
        queryBuilder.andWhere('LOWER(booking.problemInterval) ILIKE :problemInterval', { problemInterval: `%${filterDto.problemInterval.toLowerCase()}%` })
      }

      if( filterDto.transactionMode != null && filterDto.transactionMode != ''){  
        queryBuilder.andWhere('booking.transactionMode = :transactionMode', { transactionMode : filterDto.transactionMode.toLowerCase() })
      }


      let bookings = await queryBuilder.getMany();
      return bookings;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);  
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    try {
      if(updateBookingDto.status == BookingStatus.ONGOING){
        if(updateBookingDto.assignTo == null){
         throw new HttpException("Please assign a worker", HttpStatus.BAD_REQUEST);
        }
      }
      if(updateBookingDto.status == BookingStatus.COMPLETED){
        if(updateBookingDto.assignTo != null){
         throw new HttpException("You can't assign a worker", HttpStatus.BAD_REQUEST);
        }
      }
      let updatePost = await this.bookingRepo.createQueryBuilder('booking').update(Booking).set(updateBookingDto).where('id = :id', { id: id }).execute();
      return updatePost;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
