import { randomUUID } from 'crypto';

export const CARTS = [
  {
    id: randomUUID(),
    user_id: randomUUID(),
    created_at: new Date(),
    updated_at: new Date(),
    status: ['OPEN', 'ORDERED'][Math.floor(Math.random() * 2)],
  },
  {
    id: randomUUID(),
    user_id: randomUUID(),
    created_at: new Date(),
    updated_at: new Date(),
    status: ['OPEN', 'ORDERED'][Math.floor(Math.random() * 2)],
  },
];
