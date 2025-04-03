export enum PaymentMethod {
  CREDIT = 'credit',
  PAYPAY = 'paypay',
  AUPAY = 'aupay',
}

export interface PaymentMethodConfig {
  method: PaymentMethod;
  maxAmount: number;
}