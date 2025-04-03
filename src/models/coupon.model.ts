import { BaseModel } from './base.model';

export interface Coupon extends BaseModel {
  code: string;
  discount: number;
}
