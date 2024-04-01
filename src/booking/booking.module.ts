import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { TransactionService } from 'src/transaction/transaction.service';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Module({
  imports : [
    TypeOrmModule.forFeature([Booking, Transaction]),
  ],
  controllers: [BookingController],
  providers: [BookingService, TransactionService]
})
export class BookingModule {}
