"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponService = void 0;
const database_1 = require("../database");
const Coupen_1 = require("../models/Coupen");
class CouponService {
    constructor() {
        this.couponRepository = database_1.AppDataSource.getRepository(Coupen_1.Coupon);
    }
    async createCoupon(couponData) {
        const couponRepository = database_1.AppDataSource.getRepository(Coupen_1.Coupon);
        const coupon = couponRepository.create(couponData);
        return couponRepository.save(coupon);
    }
    async getCoupons() {
        const couponRepository = database_1.AppDataSource.getRepository(Coupen_1.Coupon);
        return couponRepository.find();
    }
    async getCouponById(id) {
        const couponRepository = database_1.AppDataSource.getRepository(Coupen_1.Coupon);
        return couponRepository.findOneBy({ id });
    }
    async updateCoupon(id, couponData) {
        const couponRepository = database_1.AppDataSource.getRepository(Coupen_1.Coupon);
        const coupon = await couponRepository.findOneBy({ id });
        if (!coupon)
            return null;
        if (couponData.details) {
            coupon.details = {
                ...coupon.details,
                ...couponData.details,
            };
        }
        if (couponData.conditions) {
            coupon.conditions = {
                ...coupon.conditions,
                ...couponData.conditions,
            };
        }
        // Apply other coupon data updates (e.g., type, isActive)
        Object.assign(coupon, couponData);
        return couponRepository.save(coupon);
    }
    async deleteCoupon(id) {
        const couponRepository = database_1.AppDataSource.getRepository(Coupen_1.Coupon);
        const result = await couponRepository.delete(id);
        return result.affected !== 0;
    }
    async getApplicableCoupons(cart) {
        const couponRepository = database_1.AppDataSource.getRepository(Coupen_1.Coupon);
        const coupons = await couponRepository.find({ where: { isActive: true } });
        const applicableCoupons = [];
        const currentDate = new Date();
        let cartTotal = 0;
        // Calculate total cart value
        cart.items.forEach((item) => {
            cartTotal += item.price * item.quantity;
        });
        for (const coupon of coupons) {
            // Sanity check: ensure coupon has not expired
            if (coupon.conditions.expiryDate && currentDate > new Date(coupon.conditions.expiryDate)) {
                continue;
            }
            if (coupon.type === "cart-wise") {
                const threshold = coupon.details.threshold ?? 0;
                const discountValue = coupon.details.discount ?? 0;
                if (cartTotal > threshold) {
                    // Apply discount as a fixed amount
                    applicableCoupons.push({
                        couponId: coupon.id,
                        type: coupon.type,
                        discount: (discountValue / 100) * cartTotal, // Assuming discountValue is a percentage
                    });
                }
            }
            else if (coupon.type === "product-wise") {
                const productId = coupon.details.buyProducts?.[0]?.productId;
                const discountValue = coupon.details.discount ?? 0;
                cart.items.forEach((item) => {
                    if (item.productId === productId) {
                        const itemDiscount = (discountValue / 100) * item.price * item.quantity; // Assuming discountValue is a percentage
                        applicableCoupons.push({
                            couponId: coupon.id,
                            type: coupon.type,
                            discount: itemDiscount,
                        });
                    }
                });
            }
            else if (coupon.type === "bxgy") {
                let applicableBuyCount = Number.MAX_SAFE_INTEGER;
                coupon.details.buyProducts?.forEach((buyProduct) => {
                    const cartItem = cart.items.find((item) => item.productId === buyProduct.productId);
                    if (cartItem) {
                        const possibleReps = Math.floor(cartItem.quantity / buyProduct.quantity);
                        applicableBuyCount = Math.min(applicableBuyCount, possibleReps);
                    }
                    else {
                        applicableBuyCount = 0;
                    }
                });
                const repetitionLimit = coupon.details.repetitionLimit ?? 1;
                const applicableRepetitions = Math.min(applicableBuyCount, repetitionLimit);
                if (applicableRepetitions > 0) {
                    let discount = 0;
                    coupon.details.getProducts?.forEach((getProduct) => {
                        const cartItem = cart.items.find((item) => item.productId === getProduct.productId);
                        if (cartItem) {
                            discount += cartItem.price * getProduct.quantity * applicableRepetitions;
                        }
                    });
                    applicableCoupons.push({
                        couponId: coupon.id,
                        type: coupon.type,
                        discount,
                    });
                }
            }
        }
        return applicableCoupons;
    }
    async applyCouponToCart(couponId, cart) {
        const couponRepository = database_1.AppDataSource.getRepository(Coupen_1.Coupon);
        const coupon = await couponRepository.findOneBy({ id: couponId });
        if (!coupon) {
            throw new Error("Coupon not found");
        }
        // Sanity check: ensure coupon has not expired
        const currentDate = new Date();
        if (coupon.conditions.expiryDate && currentDate > new Date(coupon.conditions.expiryDate)) {
            throw new Error("Coupon has expired");
        }
        else if (!coupon.isActive) {
            throw new Error("Coupon is deactivated");
        }
        // Step 1: Calculate the total cart value
        const cartTotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        // Initialize variables to track discounts
        let totalDiscount = 0;
        let finalPrice = cartTotal;
        // Step 2: Apply coupon logic based on coupon type
        switch (coupon.type) {
            case "cart-wise":
                if (cartTotal < coupon.details?.threshold) {
                    throw new Error("Cart value is less than threshold");
                }
                if (typeof coupon.details.discount === "number" &&
                    typeof coupon.details.threshold === "number") {
                    if (cartTotal >= coupon.details.threshold) {
                        // Assuming discount is percentage
                        totalDiscount = (coupon.details.discount / 100) * cartTotal;
                        finalPrice = cartTotal - totalDiscount;
                    }
                }
                break;
            case "product-wise":
                if (Array.isArray(cart.items) &&
                    typeof coupon.details.discount === "number" &&
                    typeof coupon.details.productId === "number") {
                    const productId = coupon.details.productId;
                    const discountValue = coupon.details.discount;
                    cart.items.forEach((item) => {
                        if (item.productId === productId) {
                            const itemTotal = item.price * item.quantity;
                            // Assuming discount is percentage
                            const discount = Math.min((discountValue / 100) * itemTotal, itemTotal);
                            totalDiscount += discount;
                            finalPrice -= discount;
                        }
                    });
                }
                break;
            case "bxgy":
                if (Array.isArray(coupon.details.buyProducts) &&
                    Array.isArray(coupon.details.getProducts)) {
                    const buyProducts = coupon.details.buyProducts;
                    const getProducts = coupon.details.getProducts;
                    const repetitionLimit = coupon.details.repetitionLimit || 1;
                    // Check if the cart meets the buy criteria
                    const validForDiscount = buyProducts.every((buyProduct) => {
                        const cartProduct = cart.items.find((item) => item.productId === buyProduct.productId);
                        return cartProduct && cartProduct.quantity >= buyProduct.quantity;
                    });
                    if (validForDiscount) {
                        getProducts.forEach((getProduct) => {
                            const getProductItem = cart.items.find((item) => item.productId === getProduct.productId);
                            if (getProductItem) {
                                const quantityEligibleForDiscount = Math.min(getProductItem.quantity, getProduct.quantity * repetitionLimit);
                                const discountAmount = quantityEligibleForDiscount * getProductItem.price;
                                totalDiscount += discountAmount;
                                finalPrice -= discountAmount;
                            }
                        });
                    }
                }
                break;
            default:
                throw new Error("Unknown coupon type");
        }
        // Step 3: Construct the updated cart response
        const updatedCart = {
            items: cart.items.map((item) => {
                // Only apply discount to items that matched the criteria
                const itemTotal = item.price * item.quantity;
                const itemDiscount = coupon.type === "product-wise" &&
                    item.productId === coupon.details.productId
                    ? (itemTotal / cartTotal) * totalDiscount
                    : 0;
                return {
                    ...item,
                    total_discount: itemDiscount,
                };
            }),
            total_price: cartTotal,
            total_discount: totalDiscount,
            final_price: finalPrice,
        };
        return updatedCart;
    }
}
exports.CouponService = CouponService;
