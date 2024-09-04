import express  from 'express';
import { CouponController } from '../controllers/CouponController';
import { validateCouponMiddleware } from '../middleware/validateCouponMiddleware';
import { sanitizeCouponMiddleware } from '../middleware/sanitizeCouponMiddleware';

const router = express.Router();
const couponController = new CouponController();

router.post('/coupons',sanitizeCouponMiddleware, couponController.createCoupon.bind(couponController));
router.get('/coupons', couponController.getCoupons.bind(couponController));
router.get('/coupons/:id', couponController.getCouponById.bind(couponController));
router.put('/coupons/:id', couponController.updateCoupon.bind(couponController));
router.delete('/coupons/:id', couponController.deleteCoupon.bind(couponController));
router.post('/applicable-coupons',validateCouponMiddleware, couponController.fetchApplicableCoupons.bind(couponController));
router.post('/apply-coupon/:id',validateCouponMiddleware, couponController.applyCoupon.bind(couponController));

export default router;
