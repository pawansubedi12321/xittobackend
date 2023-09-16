import 'dotenv/config';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  //typeorm config
  type: 'postgres',
  host: process.env.DATABASE_HOST || "containers-us-west-192.railway.app" ,
  port: parseInt(process.env.DATABASE_PORT || "7208") ,
  username: process.env.DATABASE_USER || "postgres" ,
  password: process.env.DATABASE_PASSWORD || "lJyjJXg1LWu76KEOoJSz",
  database: process.env.DATABASE_NAME || "railway",
  entities: ['dist/**/*.entity.js'],
  logging: true,
  synchronize: true,
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
