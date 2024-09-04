import { DataSource } from 'typeorm';
import { Coupon } from '../models/Coupen';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'coupons',
  synchronize: true,
  logging: false,
  entities: [Coupon],
  migrations: [],
  subscribers: [],
});
