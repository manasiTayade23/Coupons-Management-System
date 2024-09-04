import { Request, Response, NextFunction } from "express";
import { Coupon } from "../models/Coupen";
import { AppDataSource } from "../database";

export async function validateCouponMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { cart } = req.body;

    if (!cart || !cart.items || !Array.isArray(cart.items)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid cart format",
      });
    }

    const couponRepository = AppDataSource.getRepository(Coupon);
    const coupon = await couponRepository.findOneBy({ id: Number(id) });

    if (!coupon) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Coupon not found",
      });
    }

    // Check if the coupon is active
    if (!coupon.isActive) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Coupon is deactivated",
      });
    }

    // Check for expiry
    const currentDate = new Date();
    if (
      coupon.conditions.expiryDate &&
      currentDate > new Date(coupon.conditions.expiryDate)
    ) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Coupon has expired",
      });
    }

    // Check for minimum cart value for cart-wise coupons
    if (coupon.details.type === "cart-wise") {
      const cartTotal = cart.items.reduce(
        (total: number, item: { price: number; quantity: number }) =>
          total + item.price * item.quantity,
        0
      );
      if (cartTotal < (coupon.details?.threshold ?? 0)) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Cart value is less than threshold",
        });
      }
    }

    // Check for BxGy coupon applicability
    if (coupon.details.type === "bxgy") {
      let applicableBuyCount = Number.MAX_SAFE_INTEGER;
      coupon.details.buyProducts?.forEach((buyProduct) => {
        const cartItem = cart.items.find(
          (item: { productId: number }) =>
            item.productId === buyProduct.productId
        );
        if (cartItem) {
          const possibleReps = Math.floor(
            cartItem.quantity / buyProduct.quantity
          );
          applicableBuyCount = Math.min(applicableBuyCount, possibleReps);
        } else {
          applicableBuyCount = 0;
        }
      });

      const repetitionLimit = coupon.details.repetitionLimit ?? 1;
      const applicableRepetitions = Math.min(
        applicableBuyCount,
        repetitionLimit
      );

      if (applicableRepetitions <= 0) {
        return res.status(400).json({
          status: 400,
          success: false,
          message:
            "BxGy coupon cannot be applied due to insufficient items in the cart",
        });
      }
    }

    // If all checks pass, proceed to the next middleware or route handler
    next();
  } catch (error: any) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Server error",
      error: error.message || "Unknown error",
    });
  }
}
