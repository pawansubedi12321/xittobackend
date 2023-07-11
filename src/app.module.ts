import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppDataSource } from './config/database.config';
import MailConfig from './config/mail.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmailModule } from './email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';
import ThrottlerConfig from './config/throttler.config';
import { EventsModule } from './ws-events/events.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    //A common technique to protect applications from brute-force attacks is rate-limiting
    ThrottlerModule.forRoot(ThrottlerConfig),

    //events
    EventEmitterModule.forRoot(),

    //db config
    TypeOrmModule.forRoot(AppDataSource.options),

    //mail config
    MailerModule.forRoot(MailConfig),


    EmailModule,

    EventsModule,

    ServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
