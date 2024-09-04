"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./database");
const couponRoutes_1 = __importDefault(require("./routes/couponRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', couponRoutes_1.default);
database_1.AppDataSource.initialize()
    .then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
})
    .catch((error) => console.log(error));
