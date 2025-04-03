import { Coupon } from '@/models/coupon.model';
import { CouponService } from '@/services/coupon.service';
import { MOCKED_BASE_URL, MOCKED_COUPON } from '../mock/mock-data';

describe('CouponService', () => {
  let couponService: CouponService;

  beforeEach(() => {
    couponService = new CouponService(MOCKED_BASE_URL);
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getCoupon', () => {
    it('should fetch and return a coupon when a valid couponId is provided', async () => {
      const mockCoupon: Coupon = MOCKED_COUPON;
      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockCoupon),
      });

      const result = await couponService.getCoupon(MOCKED_COUPON.id);

      expect(global.fetch).toHaveBeenCalledWith(`${MOCKED_BASE_URL}/coupons/${MOCKED_COUPON.id}`);
      expect(result).toEqual(mockCoupon);
    });

    it('should throw an error when the coupon is invalid', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(null),
      });

      await expect(couponService.getCoupon('invalid-id')).rejects.toThrow('Invalid coupon');
    });
  });

  describe('applyDiscount', () => {
    it('should return original price when coupon is null or undefined', () => {
      const price = 100;

      const result = couponService.applyDiscount(price, null as unknown as Coupon);

      expect(result).toBe(price);
    });

    it('should apply the discount and return the discounted price', () => {
      const price = 100;
      const coupon: Coupon = MOCKED_COUPON;

      const result = couponService.applyDiscount(price, coupon);

      expect(result).toBe(price - MOCKED_COUPON.discount);
    });

    it('should not return a negative price after applying the discount', () => {
      const price = 10;
      const coupon: Coupon = {
        ...MOCKED_COUPON,
        discount: 30,
      };

      const result = couponService.applyDiscount(price, coupon);

      expect(result).toBe(0);
    });

    it('should handle zero price correctly', () => {
      const price = 0;
      const coupon: Coupon = MOCKED_COUPON;

      const result = couponService.applyDiscount(price, coupon);

      expect(result).toBe(0);
    });

    it('should handle negative discount correctly', () => {
      const price = 100;
      const coupon: Coupon = {
        ...MOCKED_COUPON,
        discount: -20,
      };

      const result = couponService.applyDiscount(price, coupon);

      expect(result).toBe(120);
    });

    it('should handle discount decimal values correctly', () => {
      const price = 100;
      const coupon: Coupon = {
        ...MOCKED_COUPON,
        discount: 10.5,
      };

      const result = couponService.applyDiscount(price, coupon);

      expect(result).toBe(89.5);
    });
  });
});
