export enum CartStatus {
  Open = 'OPEN',
  Ordered = 'ORDERED',
}

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type CartItem = {
  product: Product;
  count: number;
};

export type Cart = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  status: CartStatus;
  items: CartItem[];
};

export interface CartItemDTO extends Pick<CartItem, 'count'> {
  productId: string;
}

export interface CartUpdateDTO {
  items: CartItemDTO[];
}
