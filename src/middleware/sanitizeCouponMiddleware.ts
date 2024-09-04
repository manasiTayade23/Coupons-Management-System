import { Request, Response, NextFunction } from "express";
import { Coupon } from "../models/Coupen";
import { isEmpty } from "class-validator";

export function sanitizeCouponMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const { cart } = req.body;

  // Sanitize coupon details
  const couponDetails = req.body.details;

  if (couponDetails == null || Object.keys(couponDetails).length === 0) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Please Provide Correct Data",
    });
  }
  if (couponDetails.threshold && typeof couponDetails.threshold !== "number") {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Invalid threshold value",
    });
  }
  if (couponDetails.discount && typeof couponDetails.discount !== "number") {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Invalid discount value",
    });
  }
  if (couponDetails.productId && typeof couponDetails.productId !== "number") {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Invalid productId value",
    });
  }
  if (couponDetails.buyProducts && !Array.isArray(couponDetails.buyProducts)) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Invalid buyProducts format",
    });
  }
  couponDetails.buyProducts?.forEach((item: any, index: number) => {
    if (typeof item.productId !== "number" || item.productId <= 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: `Invalid productId in buyProducts at index ${index}`,
      });
    }
    if (typeof item.quantity !== "number" || item.quantity <= 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: `Invalid quantity in buyProducts at index ${index}`,
      });
    }
  });

  if (couponDetails.getProducts && !Array.isArray(couponDetails.getProducts)) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Invalid getProducts format",
    });
  }
  couponDetails.getProducts?.forEach((item: any, index: number) => {
    if (typeof item.productId !== "number" || item.productId <= 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: `Invalid productId in getProducts at index ${index}`,
      });
    }
    if (typeof item.quantity !== "number" || item.quantity <= 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: `Invalid quantity in getProducts at index ${index}`,
      });
    }
  });

  // Sanitize conditions
  const conditions = req.body.conditions || {};
  if (conditions == null || Object.keys(conditions).length === 0) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Please Provide Correct Data",
    });
  }
  if (conditions && conditions.expiryDate) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    // Check if date is valid
    if (conditions && conditions.expiryDate) {
      // Check if expiryDate is not empty and matches the date format regex
      if (!conditions.expiryDate || !dateRegex.test(conditions.expiryDate)) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Invalid expiry date format.",
        });
      }
    }
  }
  if (conditions.customerGroups && !Array.isArray(conditions.customerGroups)) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Invalid customerGroups format",
    });
  }

  next();
}
