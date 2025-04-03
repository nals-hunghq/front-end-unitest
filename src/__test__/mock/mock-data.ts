export const MOCKED_BASE_URL = 'https://mocked-api.example.com';
export const MOCKED_PAYMENT_URL = 'https://mocked-payment.example.com';
export const MOCKED_ORDER_ITEMS = [
  {
    id: '1',
    productId: '1',
    price: 100,
    quantity: 1,
  },
  {
    id: '2',
    productId: '2',
    price: 50,
    quantity: 2,
  },
  {
    id: '3',
    productId: '3',
    price: 25,
    quantity: 4,
  },
];
export const MOCKED_ORDER = {
  id: '123',
  items: [MOCKED_ORDER_ITEMS[0]],
  paymentMethod: 'credit',
  totalPrice: 100,
};
export const MOCKED_COUPON = {
  id: '123',
  discount: 20,
  code: 'MOCKED_CODE',
};
