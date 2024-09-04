"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Coupen_1 = require("../models/Coupen");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'coupons',
    synchronize: true,
    logging: false,
    entities: [Coupen_1.Coupon],
    migrations: [],
    subscribers: [],
});
