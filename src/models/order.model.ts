import { BaseModel } from './base.model';

export interface OrderItem extends BaseModel {
  productId: string;
  price: number;
  quantity: number;
}

export interface Order extends BaseModel {
  totalPrice: number;
  items: OrderItem[];
  couponId?: string;
  paymentMethod: string;
}
