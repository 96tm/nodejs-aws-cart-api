import { randomUUID } from 'crypto';

const [MAX_NUMBER, MIN_NUMBER] = [5, 1];

export const CART_ITEMS = [
  {
    cart_id: randomUUID(),
    product_id: randomUUID(),
    count: Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER,
  },
];
