import { Order } from '@/models/order.model';
import { PaymentService } from './payment.service';
import { CouponService } from './coupon.service';

export class OrderService {
  private readonly orderApiUrl: string;

  constructor(private readonly baseUrl: string, private readonly paymentService: PaymentService, private readonly couponService: CouponService) {
    this.orderApiUrl = `${this.baseUrl}/order`;
  }

  async process(order: Partial<Order>): Promise<void> {
    this.validateOrder(order);
    let totalPrice = this.calculateTotalPrice(order);

    if (order.couponId) {
      totalPrice = await this.applyCoupon(order.couponId, totalPrice);
    }

    const orderPayload = this.buildOrderPayload(order, totalPrice);
    const createdOrder = await this.createOrder(orderPayload);

    this.paymentService.payViaLink(createdOrder);
  }

  private validateOrder(order: Partial<Order>): void {
    if (!order.items?.length) {
      throw new Error('Order items are required');
    }

    if (order.items.some((item) => item.price <= 0 || item.quantity <= 0)) {
      throw new Error('Order items are invalid');
    }
  }

  private calculateTotalPrice(order: Partial<Order>): number {
    return (order.items ?? []).reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  private async applyCoupon(couponId: string, totalPrice: number): Promise<number> {
    const coupon = await this.couponService.getCoupon(couponId);
    return this.couponService.applyDiscount(totalPrice, coupon);
  }

  private buildOrderPayload(order: Partial<Order>, totalPrice: number): Partial<Order> {
    return {
      ...order,
      totalPrice,
      paymentMethod: this.paymentService.buildPaymentMethod(totalPrice),
    };
  }

  private async createOrder(orderPayload: Partial<Order>): Promise<Order> {
    const response = await fetch(this.orderApiUrl, {
      method: 'POST',
      body: JSON.stringify(orderPayload),
      headers: { 'Content-Type': 'application/json' },
    });

    return response.json();
  }
}
