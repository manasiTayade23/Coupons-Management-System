Overview
This project includes middleware functions and a service class for handling coupon validation, creation, and application in an Express.js application. The system ensures that coupon data is valid and meets specified conditions before processing it.

Implemented Cases
Middleware Functions
sanitizeCouponMiddleware
This middleware sanitizes and validates coupon data in the request body. It performs the following checks:

Coupon Details Presence:

Ensures that couponDetails is present and not empty.
Data Type Validations:

threshold: Must be a number.
discount: Must be a number.
productId: Must be a number.
buyProducts: Must be an array with each object having productId (number > 0) and quantity (number > 0).
getProducts: Must be an array with each object having productId (number > 0) and quantity (number > 0).
Expiry Date Validation:

Checks if expiryDate (if provided) matches the format YYYY-MM-DD.

validateCouponMiddleware
This middleware validates coupons based on the data in the request and the state of the coupon in the database. It performs the following checks:

Cart Validation:

Ensures that cart and cart.items exist and that cart.items is an array.
Coupon Existence:

Verifies that the coupon with the given ID exists in the database.
Coupon Activation:

Checks that the coupon is active.
Expiry Check:

Validates that the coupon has not expired based on the current date.
Minimum Cart Value (for Cart-Wise Coupons):

For "cart-wise" coupons, checks if the total cart value meets the coupon's threshold.
BxGy Coupon Applicability:

For "Buy X Get Y" type coupons, ensures that there are sufficient quantities of the buy products in the cart to apply the coupon.
CouponService Class
The CouponService class provides methods for managing coupons:

createCoupon: Creates a new coupon.
getCoupons: Retrieves all coupons.
getCouponById: Retrieves a coupon by its ID.
updateCoupon: Updates an existing coupon.
deleteCoupon: Deletes a coupon by its ID.
getApplicableCoupons: Determines which coupons apply to a given cart and calculates the applicable discounts.
applyCouponToCart: Applies a coupon to a cart and returns the updated cart with applied discounts.
Unimplemented Cases
Complex Coupon Types:


Dynamic Validation:

No dynamic validation of coupons based on external factors or additional services.
Internationalization and Localization:

Error messages and date formats are not localized or internationalized.
Detailed Error Reporting:

Error handling is basic, with limited information provided for debugging or user feedback.
Asynchronous Validation:

Asynchronous validation or interactions with external services are not implemented.
Limitations

Database Dependency:

Heavy reliance on the database for coupon validation and management might impact performance.

Coupon Types and Conditions:

Limited to basic coupon types and conditions; more complex scenarios are not addressed.
Assumptions
Data Integrity:

Assumes that the request data adheres to the expected structure and is correct.
Database Schema:

Assumes the Coupon model in the database matches the schema expected by the middleware and service class.
Middleware Order:

Assumes sanitizeCouponMiddleware is used before validateCouponMiddleware to ensure proper data validation.
Coupon Types:

Assumes coupon types are limited to "cart-wise" and "BxGy". The system does not handle other potential types or complex coupon logic.
Input Validity:

Assumes inputs are generally accurate and conform to the expected format.
Conditions and Future Improvements
Advanced Coupon Types:

Condition: To improve functionality, it was considered to support more advanced coupon types and logic.
Reason for Exclusion: Due to time constraints and the scope of the project, only basic coupon types were implemented.
Dynamic and External Validation:

Condition: Implement dynamic validation or integration with external services for coupon validation.
Reason for Exclusion: Requires additional complexity and integration work that was outside the current project scope.
Internationalization/Localization:

Condition: Add support for different locales and languages.
Reason for Exclusion: Localization efforts were not included to keep the implementation focused on core functionality.
Detailed Error Reporting:

Condition: Enhance error reporting with more detailed messages and logging.
Reason for Exclusion: Basic error handling was implemented to ensure core functionality without extensive logging.
Conclusion
The middleware and service class provide essential functionality for managing and applying coupons in an Express.js application. While the implementation covers core requirements, future improvements could address more complex coupon types, dynamic validation, and enhanced error reporting.