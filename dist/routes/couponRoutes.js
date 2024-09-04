"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CouponController_1 = require("../controllers/CouponController");
const validateCouponMiddleware_1 = require("../middleware/validateCouponMiddleware");
const sanitizeCouponMiddleware_1 = require("../middleware/sanitizeCouponMiddleware");
const router = express_1.default.Router();
const couponController = new CouponController_1.CouponController();
router.post('/coupons', sanitizeCouponMiddleware_1.sanitizeCouponMiddleware, couponController.createCoupon.bind(couponController));
router.get('/coupons', couponController.getCoupons.bind(couponController));
router.get('/coupons/:id', couponController.getCouponById.bind(couponController));
router.put('/coupons/:id', couponController.updateCoupon.bind(couponController));
router.delete('/coupons/:id', couponController.deleteCoupon.bind(couponController));
router.post('/applicable-coupons', validateCouponMiddleware_1.validateCouponMiddleware, couponController.fetchApplicableCoupons.bind(couponController));
router.post('/apply-coupon/:id', validateCouponMiddleware_1.validateCouponMiddleware, couponController.applyCoupon.bind(couponController));
exports.default = router;
