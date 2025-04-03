# Unit Test Checklist for Services

## OrderService

- `processOrder` method

  - Should validate order before processing
  - Should calculate total price correctly
  - Should apply coupon if provided
  - Should build order payload correctly
  - Should create order successfully
  - Should initiate payment via link
  - Should throw error for invalid orders

- `validateOrder` method

  - Should throw error when order has no items
  - Should throw error when any item has invalid price or quantity
  - Should throw error when total price is not greater than 0

- `calculateTotalPrice` method

  - Should return 0 for empty order
  - Should calculate sum of (price \* quantity) for all items

- `applyCoupon` method

  - Should retrieve coupon from coupon service
  - Should apply discount to total price

- `buildOrderPayload` method

  - Should return an order payload with the same properties as the input order
  - Should include the `totalPrice` in the returned payload
  - Should call `paymentService.buildPaymentMethod` with the correct `totalPrice`
  - Should include the payment method returned by `paymentService.buildPaymentMethod` in the payload
  - Should handle cases where the input order is empty or has missing properties

## PaymentService

- `buildPaymentMethod` method

  - Should return a comma-separated list of payment methods for the given total price
  - Should return a single payment method if only one is available for the given total price
  - Should return all available payment methods if the total price is less than the minimum amount
  - Should return an empty string if no payment methods are available for the given total price

- `payViaLink` method
  - Should generate payment link for valid order
  - Should handle payment processing errors

## CouponService

- `getCoupon` method

  - Should fetch and return a coupon when a valid couponId is provided
  - Should throw an error when the coupon is invalid

- `applyDiscount` method

  - Should return original price when coupon is null or undefined
  - Should apply the discount and return the discounted price
  - Should not return a negative price after applying the discount
  - Should handle zero price correctly
  - Should handle negative discount correctly
  - Should handle discount decimal values correctly
