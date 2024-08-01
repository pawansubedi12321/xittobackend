import 'dotenv/config';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  //typeorm config
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: ['dist/**/*.entity.js'],
  logging: true,
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,  // Use this if you need to bypass SSL certificate issues
  },
  // type: 'postgres',
  // host: process.env.DATABASE_HOST ,
  // port: parseInt(process.env.DATABASE_PORT) ,
  // username: process.env.DATABASE_USER ,
  // password: process.env.DATABASE_PASSWORD,
  // database: process.env.DATABASE_NAME,
  // entities: ['dist/**/*.entity.js'],
  // logging: true,
  // synchronize: true,
  // ssl: true 

  // extra:{
  //   ssl: true
  // }
  
  // synchronize: false,

  //database configs
  //migrations credentials
//   migrationsRun: true,
//   migrations: ['dist/migrations/*.js'] || ['dist/src/migrations/*.js'],
//   migrationsTableName: 'migrations_history',

  // seeds: ['src/**/seeding/**/*.seeder.ts'],
  // factories: ['src/**/factories/**/*.ts'],
});
