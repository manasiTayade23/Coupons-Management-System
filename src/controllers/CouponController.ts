import { Request, Response } from "express";
import { CouponService } from "../services/CouponService";

export class CouponController {
  private couponService = new CouponService();

  async createCoupon(req: Request, res: Response) {
    try {
      const coupon = await this.couponService.createCoupon(req.body);
      return res.json({
        status: 201,
        success: true,
        message: "Coupon Created Successfully",
        data: coupon,
      });
    } catch (error:any) {
      return res.json({
        status: 500,
        success: false,
        message: "Error creating coupon",
        data: error.message,
      });
    }
  }

  async getCoupons(req: Request, res: Response) {
    try {
      const coupons = await this.couponService.getCoupons();
      return res.json({
        status: 200,
        success: true,
        message: "Coupon Fetched Successfully",
        data: coupons,
      });
    } catch (error) {
      return res.json({
        status: 500,
        success: false,
        message: "Error fetching coupon",
        data: {},
      });
    }
  }

  async getCouponById(req: Request, res: Response) {
    try {
      const coupon = await this.couponService.getCouponById(
        Number(req.params.id)
      );
      if (!coupon) return res.status(404).json({ message: "Coupon not found" });
      return res.json({
        status: 200,
        success: true,
        message: "Coupon Fetched Successfully",
        data: coupon,
      });
    } catch (error) {
      return res.json({
        status: 500,
        success: false,
        message: "Error fetching coupon",
        data: {},
      });
    }
  }

  async updateCoupon(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedCoupon = await this.couponService.updateCoupon(
        Number(id),
        req.body
      );
      if (!updatedCoupon)
        return res.json({
          status: 404,
          success: false,
          message: "Coupon Not Found",
          data: {},
        });
      return res.json({
        status: 200,
        success: true,
        message: "Coupon Updated Successfully",
        data: updatedCoupon,
      });
    } catch (error) {
      return res.json({
        status: 500,
        success: false,
        message: "Error fetching coupon",
        data: {},
      });
    }
  }

  async deleteCoupon(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.couponService.deleteCoupon(Number(id));
      if (!result)
        return res.json({
          status: 404,
          success: false,
          message: "Coupon Not Found",
          data: {},
        });
      return res.json({
        status: 204,
        success: true,
        message: "Coupon Deleted Successfully",
        data: {},
      });
    } catch (error) {
      return res.json({
        status: 500,
        success: false,
        message: "Error deleting coupon",
        data: {},
      });
    }
  }

  async fetchApplicableCoupons(req: Request, res: Response) {
    try {
      const { cart } = req.body;
      const applicableCoupons =
        await this.couponService.getApplicableCoupons(cart);

      return res.json({
        status: 200,
        success: true,
        message: "Coupon Applied Successfully",
        data: applicableCoupons,
      });
    } catch (error:any) {
      return res.json({
        status: 500,
        success: false,
        message: "Error fetching coupon",
        data: error.message,
      });
    }
  }

  async applyCoupon(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { cart } = req.body;
      const updatedCart = await this.couponService.applyCouponToCart(
        Number(id),
        cart
      );
      return res.json({
        status: 200,
        success: true,
        message: "Coupon Applied Successfully",
        data: updatedCart,
      });
    } catch (error:any) {      
      return res.json({
        status: 500,
        success: false,
        message: "Error applying coupon",
        data: error.message,
      });
    }
  }
}
