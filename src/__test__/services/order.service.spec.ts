import { Order } from '@/models/order.model';
import { OrderService } from '@/services/order.service';
import { PaymentService } from '@/services/payment.service';
import { CouponService } from '@/services/coupon.service';
import { MOCKED_BASE_URL, MOCKED_COUPON, MOCKED_ORDER_ITEMS } from '../mock/mock-data';

describe('OrderService', () => {
  const MOCKED_ORDER_URL = `${MOCKED_BASE_URL}/order`;

  let orderService: OrderService;
  let paymentServiceMock: PaymentService;
  let couponServiceMock: CouponService;

  beforeEach(() => {
    paymentServiceMock = {
      payViaLink: vi.fn(),
      buildPaymentMethod: vi.fn().mockReturnValue('mock-payment-method'),
    } as unknown as PaymentService;

    couponServiceMock = {
      getCoupon: vi.fn().mockResolvedValue(MOCKED_COUPON),
      applyDiscount: vi.fn().mockImplementation((totalPrice, coupon) => totalPrice - coupon.discount),
    } as unknown as CouponService;

    orderService = new OrderService(MOCKED_BASE_URL, paymentServiceMock, couponServiceMock);

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('process', () => {
    it('should validate and process an order without a coupon', async () => {
      const order: Partial<Order> = {
        items: [
          { ...MOCKED_ORDER_ITEMS[0], price: 100, quantity: 2 },
          { ...MOCKED_ORDER_ITEMS[1], price: 50, quantity: 1 },
        ],
      };
      const payload = {
        ...order,
        totalPrice: 250,
        paymentMethod: 'mock-payment-method',
      };

      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({ ...payload, id: 'mock-order-id' }),
      });

      await orderService.process(order);

      expect(global.fetch).toHaveBeenCalledWith(MOCKED_ORDER_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
      expect(paymentServiceMock.payViaLink).toHaveBeenCalledWith({ ...payload, id: 'mock-order-id' });
    });

    it('should validate and process an order with a coupon', async () => {
      const order: Partial<Order> = {
        items: [
          { ...MOCKED_ORDER_ITEMS[0], price: 100, quantity: 2 },
          { ...MOCKED_ORDER_ITEMS[1], price: 50, quantity: 1 },
        ],
        couponId: MOCKED_COUPON.id,
      };
      const totalPrice = 250;

      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({ id: 'mock-order-id' }),
      });

      await orderService.process(order);

      expect(couponServiceMock.getCoupon).toHaveBeenCalledWith(MOCKED_COUPON.id);
      expect(couponServiceMock.applyDiscount).toHaveBeenCalledWith(250, MOCKED_COUPON);
      expect(paymentServiceMock.payViaLink).toHaveBeenCalledWith({ id: 'mock-order-id' });
      expect(global.fetch).toHaveBeenCalledWith(MOCKED_ORDER_URL, {
        method: 'POST',
        body: JSON.stringify({
          ...order,
          totalPrice: totalPrice - MOCKED_COUPON.discount,
          paymentMethod: 'mock-payment-method',
        }),
        headers: { 'Content-Type': 'application/json' },
      });
    });
  });

  describe('validateOrder', () => {
    it('should throw an error if order items are empty', () => {
      const order: Partial<Order> = {
        items: [],
      };

      expect(() => orderService['validateOrder'](order)).toThrow('Order items are required');
    });

    it('should throw an error if order items are invalid', () => {
      const order: Partial<Order> = {
        items: [
          { ...MOCKED_ORDER_ITEMS[0], price: 0, quantity: 1 },
          { ...MOCKED_ORDER_ITEMS[1], price: 50, quantity: -1 },
        ],
      };

      expect(() => orderService['validateOrder'](order)).toThrow('Order items are invalid');
    });
  });

  describe('calculateTotalPrice', () => {
    it('should calculate the total price of the order', () => {
      const order: Partial<Order> = {
        items: [
          { ...MOCKED_ORDER_ITEMS[0], price: 100, quantity: 2 },
          { ...MOCKED_ORDER_ITEMS[1], price: 50, quantity: 1 },
        ],
      };

      const totalPrice = orderService['calculateTotalPrice'](order);

      expect(totalPrice).toBe(250);
    });

    it('should return 0 if there are no items', () => {
      const order: Partial<Order> = {
        items: [],
      };

      const totalPrice = orderService['calculateTotalPrice'](order);

      expect(totalPrice).toBe(0);
    });

    it('should return 0 if items is undefined', () => {
      const order: Partial<Order> = {};

      const totalPrice = orderService['calculateTotalPrice'](order);

      expect(totalPrice).toBe(0);
    });
  });

  describe('applyCoupon', () => {
    it('should apply the coupon discount to the total price', async () => {
      const totalPrice = 250;

      const discountedPrice = await orderService['applyCoupon'](MOCKED_COUPON.id, totalPrice);

      expect(discountedPrice).toBe(totalPrice - MOCKED_COUPON.discount);
      expect(couponServiceMock.getCoupon).toHaveBeenCalledWith(MOCKED_COUPON.id);
      expect(couponServiceMock.applyDiscount).toHaveBeenCalledWith(totalPrice, MOCKED_COUPON);
    });
  });

  describe('buildOrderPayload', () => {
    it('should build the order payload with payment method', () => {
      const order: Partial<Order> = {
        items: [
          { ...MOCKED_ORDER_ITEMS[0], price: 100, quantity: 2 },
          { ...MOCKED_ORDER_ITEMS[1], price: 50, quantity: 1 },
        ],
      };
      const totalPrice = 250;

      const payload = orderService['buildOrderPayload'](order, totalPrice);

      expect(payload).toEqual({
        ...order,
        totalPrice,
        paymentMethod: 'mock-payment-method',
      });
    });

    it('should handle cases where the input order is empty or has missing properties', () => {
      const order: Partial<Order> = {};

      const payload = orderService['buildOrderPayload'](order, 0);

      expect(payload).toEqual({
        ...order,
        totalPrice: 0,
        paymentMethod: 'mock-payment-method',
      });
    });
  });

  describe('createOrder', () => {
    it('should create an order and return the created order', async () => {
      const orderPayload = {
        items: [
          { ...MOCKED_ORDER_ITEMS[0], price: 100, quantity: 2 },
          { ...MOCKED_ORDER_ITEMS[1], price: 50, quantity: 1 },
        ],
        totalPrice: 250,
        paymentMethod: 'mock-payment-method',
      };

      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({ id: 'mock-order-id' }),
      });

      const createdOrder = await orderService['createOrder'](orderPayload);

      expect(global.fetch).toHaveBeenCalledWith(MOCKED_ORDER_URL, {
        method: 'POST',
        body: JSON.stringify(orderPayload),
        headers: { 'Content-Type': 'application/json' },
      });
      expect(createdOrder).toEqual({ id: 'mock-order-id' });
    });
  });
});
