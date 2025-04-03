import { Coupon } from '@/models/coupon.model';

export class CouponService {
  private readonly couponApiUrl: string;

  constructor(baseUrl: string) {
    this.couponApiUrl = `${baseUrl}/coupons`;
  }

  async getCoupon(couponId: string): Promise<Coupon> {
    const response = await fetch(`${this.couponApiUrl}/${couponId}`);
    const coupon = await response.json();

    if (!coupon) {
      throw new Error('Invalid coupon');
    }

    return coupon;
  }

  applyDiscount(price: number, coupon: Coupon): number {
    if (!coupon) return price;
    return Math.max(0, price - coupon.discount);
  }
}
