import { DataSource } from 'typeorm';
import { Coupon } from '../models/Coupen';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'your_username',
  password: 'your_password',
  database: 'database_name',
  synchronize: true,
  logging: false,
  entities: [Coupon],
  migrations: [],
  subscribers: [],
});