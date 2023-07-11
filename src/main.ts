import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import 'dotenv/config';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  /*
      protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
  
      collection of smaller middleware functions that set security-related HTTP headers
  
      provides 11 security related middlewares
    */
  app.use(helmet());

  //mechanism that allows resources to be requested from another domain
  app.enableCors();

  //exploit of a website where unauthorized commands are transmitted from a user that the web application trusts
  // app.use(csurf());

  // Compression can greatly decrease the size of the response body, thereby increasing the speed of a web app.
  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      //removes all properties of request's body which are not in dto
      whitelist: true,

      //all to transform properties, int -> string
      transform: false,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  await app.listen(process.env.APP_PORT || 8080, () => {
    console.log(`app running in port ${process.env.APP_PORT}`);
    for (let i = 0; i < 6; i++) {
      console.log('.');
    }
  });
}

bootstrap();
