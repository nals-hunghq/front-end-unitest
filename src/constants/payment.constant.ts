import { PaymentMethod, PaymentMethodConfig } from '@/models/payment.model';

export const PAYMENT_METHODS: PaymentMethodConfig[] = [
  { method: PaymentMethod.CREDIT, maxAmount: Infinity },
  { method: PaymentMethod.PAYPAY, maxAmount: 500000 },
  { method: PaymentMethod.AUPAY, maxAmount: 300000 },
];
