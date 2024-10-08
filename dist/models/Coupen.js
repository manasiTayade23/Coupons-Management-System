"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coupon = void 0;
const Column_1 = require("typeorm/decorator/columns/Column");
const PrimaryGeneratedColumn_1 = require("typeorm/decorator/columns/PrimaryGeneratedColumn");
const Entity_1 = require("typeorm/decorator/entity/Entity");
let Coupon = class Coupon {
};
exports.Coupon = Coupon;
__decorate([
    (0, PrimaryGeneratedColumn_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Coupon.prototype, "id", void 0);
__decorate([
    (0, Column_1.Column)(),
    __metadata("design:type", String)
], Coupon.prototype, "type", void 0);
__decorate([
    (0, Column_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], Coupon.prototype, "details", void 0);
__decorate([
    (0, Column_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], Coupon.prototype, "conditions", void 0);
__decorate([
    (0, Column_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Coupon.prototype, "isActive", void 0);
exports.Coupon = Coupon = __decorate([
    (0, Entity_1.Entity)()
], Coupon);
