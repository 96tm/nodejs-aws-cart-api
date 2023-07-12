import { CartItem } from '../../cart/models';

export enum OrderStatus {
  Open = 'OPEN',
  InProgress = 'IN_PROGRESS',
  Ordered = 'ORDERED',
}

export type Order = {
  id?: string;
  userId: string;
  cartId: string;
  items: CartItem[];
  payment: {
    type: string;
    address?: any;
    creditCard?: any;
  };
  delivery: {
    type: string;
    address: any;
  };
  comments: string;
  status: string;
  total: number;
};

export interface OrderCreateDTO extends Omit<Order, 'id'> {}

export interface OrderUpdateDTO extends Pick<Order, 'status'> {}
