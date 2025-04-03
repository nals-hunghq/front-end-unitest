import { PAYMENT_METHODS } from '@/constants/payment.constant';
import { PaymentMethod } from '@/models/payment.model';

describe('PAYMENT_METHODS', () => {
  it('should have the correct number of payment methods', () => {
    expect(PAYMENT_METHODS).toHaveLength(3);
  });

  it('should include CREDIT payment method with maxAmount as Infinity', () => {
    const creditMethod = PAYMENT_METHODS.find((method) => method.method === PaymentMethod.CREDIT);
    expect(creditMethod).toBeDefined();
    expect(creditMethod?.maxAmount).toBe(Infinity);
  });

  it('should include PAYPAY payment method with maxAmount as 500000', () => {
    const paypayMethod = PAYMENT_METHODS.find((method) => method.method === PaymentMethod.PAYPAY);
    expect(paypayMethod).toBeDefined();
    expect(paypayMethod?.maxAmount).toBe(500000);
  });

  it('should include AUPAY payment method with maxAmount as 300000', () => {
    const aupayMethod = PAYMENT_METHODS.find((method) => method.method === PaymentMethod.AUPAY);
    expect(aupayMethod).toBeDefined();
    expect(aupayMethod?.maxAmount).toBe(300000);
  });
});
