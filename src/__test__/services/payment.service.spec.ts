import { Order } from '@/models/order.model';
import { PaymentService } from '@/services/payment.service';
import { MOCKED_ORDER, MOCKED_PAYMENT_URL } from '../mock/mock-data';

vi.mock('@/constants/payment.constant', () => ({
  PAYMENT_METHODS: [
    { method: 'credit', maxAmount: 500 },
    { method: 'paypay', maxAmount: 200 },
    { method: 'aupay', maxAmount: 100 },
  ],
}));

describe('PaymentService', () => {
  let paymentService: PaymentService;

  beforeEach(() => {
    paymentService = new PaymentService(MOCKED_PAYMENT_URL);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('buildPaymentMethod', () => {
    it('should return a comma-separated list of payment methods for the given total price', () => {
      const totalPrice = 150;

      const result = paymentService.buildPaymentMethod(totalPrice);

      expect(result).toBe('credit,paypay');
    });

    it('should return a single payment method if only one is available for the given total price', () => {
      const totalPrice = 400;

      const result = paymentService.buildPaymentMethod(totalPrice);

      expect(result).toBe('credit');
    });

    it('should return all available payment methods if the total price is less than the minimum amount', () => {
      const totalPrice = 50;

      const result = paymentService.buildPaymentMethod(totalPrice);

      expect(result).toBe('credit,paypay,aupay');
    });

    it('should return an empty string if no payment methods are available for the given total price', () => {
      const totalPrice = 600;

      const result = paymentService.buildPaymentMethod(totalPrice);

      expect(result).toBe('');
    });
  });

  describe('payViaLink', () => {
    it('should open a new window with the correct payment URL', () => {
      const order: Order = MOCKED_ORDER;
      const expectedUrl = new URL(MOCKED_PAYMENT_URL);
      expectedUrl.searchParams.set('orderId', order.id);
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

      paymentService.payViaLink(order);

      expect(openSpy).toHaveBeenCalledWith(expectedUrl.toString(), '_blank');
      openSpy.mockRestore();
    });
  });
});
