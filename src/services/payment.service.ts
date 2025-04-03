import { PAYMENT_METHODS } from '@/constants/payment.constant';
import { Order } from '@/models/order.model';

export class PaymentService {
  private readonly paymentApiUrl: string;

  constructor(paymentUrl: string) {
    this.paymentApiUrl = paymentUrl;
  }

  buildPaymentMethod(totalPrice: number): string {
    const filteredMethods = PAYMENT_METHODS.filter(({ maxAmount }) => totalPrice <= maxAmount).map(({ method }) => method);

    return filteredMethods.join(',');
  }

  payViaLink(order: Order): void {
    const paymentUrl = new URL(this.paymentApiUrl);
    paymentUrl.searchParams.set('orderId', order.id);

    window.open(paymentUrl.toString(), '_blank');
  }
}
