import { PaymentMethod } from '@/models/payment.model';

describe('PaymentMethod', () => {
  it('should have correct values for each payment method', () => {
    expect(PaymentMethod.CREDIT).toBe('credit');
    expect(PaymentMethod.PAYPAY).toBe('paypay');
    expect(PaymentMethod.AUPAY).toBe('aupay');
  });
});
